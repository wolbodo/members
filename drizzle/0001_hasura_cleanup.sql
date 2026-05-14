-- Hasura -> Drizzle transition. Idempotent: safe on the legacy production
-- database and on a fresh database built by 0000_baseline.sql.

-- 1. Drop dead Hasura state ------------------------------------------------
DROP TRIGGER IF EXISTS "notify_hasura_mail-trigger_INSERT" ON mail.entries;
--> statement-breakpoint
DROP SCHEMA IF EXISTS hdb_catalog CASCADE;
--> statement-breakpoint
DROP TYPE IF EXISTS auth.jwt_token;
--> statement-breakpoint

-- 2. Re-point audit triggers from the Hasura GUC to app-set GUCs -----------
--    current_setting('hasura.user') -> current_setting('app.user_id' / 'app.user_role')
CREATE OR REPLACE FUNCTION auth.change_trigger() RETURNS trigger
	LANGUAGE plpgsql AS $fn$
BEGIN
	INSERT INTO auth.history (author_id, person_id, role, timestamp, new_values, old_values)
	VALUES (
		NULLIF(current_setting('app.user_id', true), '')::INTEGER,
		NEW.id,
		NULLIF(current_setting('app.user_role', true), ''),
		current_timestamp,
		public.jsonb_diff(to_jsonb(row_to_json(NEW)), to_jsonb(row_to_json(OLD))),
		public.jsonb_diff(to_jsonb(row_to_json(OLD)), to_jsonb(row_to_json(NEW)))
	);
	RETURN NEW;
END; $fn$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION auth.role_change_trigger() RETURNS trigger
	LANGUAGE plpgsql AS $fn$
BEGIN
	INSERT INTO auth.history (author_id, person_id, role, timestamp, new_values, old_values)
	VALUES (
		NULLIF(current_setting('app.user_id', true), '')::INTEGER,
		NEW.person_id,
		NULLIF(current_setting('app.user_role', true), ''),
		current_timestamp,
		public.jsonb_diff(to_jsonb(row_to_json(NEW)), to_jsonb(row_to_json(OLD))),
		public.jsonb_diff(to_jsonb(row_to_json(OLD)), to_jsonb(row_to_json(NEW)))
	);
	RETURN NEW;
END; $fn$;
--> statement-breakpoint

-- 3. Mail dispatch trigger (replaces the dropped Hasura webhook) -----------
--    The in-process worker in src/lib/server/mail-worker.ts LISTENs on this.
CREATE OR REPLACE FUNCTION mail.notify_entry() RETURNS trigger
	LANGUAGE plpgsql AS $fn$
BEGIN
	PERFORM pg_notify('mail_entries_new', NEW.id::text);
	RETURN NEW;
END; $fn$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS mail_entry_notify ON mail.entries;
--> statement-breakpoint
CREATE TRIGGER mail_entry_notify
	AFTER INSERT ON mail.entries
	FOR EACH ROW EXECUTE FUNCTION mail.notify_entry();
--> statement-breakpoint

-- 4. Reconcile mail.entries.status ----------------------------------------
--    The Hasura-era /mail/trigger handler only ever wrote message_info, never
--    status -- so every historical row is still 'new' regardless of whether
--    it was actually delivered. A populated message_info is the real "sent"
--    signal. Reconcile status to reflect reality so the worker's catch-up
--    sweep does not re-send already-delivered mail. message_info is NOT
--    touched -- the SMTP audit trail is preserved.
UPDATE mail.entries
SET status = 'sent'
WHERE status = 'new'
  AND message_info IS NOT NULL
  AND message_info <> '{}'::jsonb;
--> statement-breakpoint
--    Whatever is still 'new' was enqueued but never confirmed sent. Every such
--    row predates this migration (the new worker maintains status from here
--    on), and a stale password-reset token is dead within 30 minutes anyway.
--    Park them as 'error' so the catch-up sweep skips them; the row and its
--    `data` are kept intact for inspection on /mail.
UPDATE mail.entries
SET status = 'error'
WHERE status = 'new';
--> statement-breakpoint

-- 5. Extend mail.status so the worker can claim a row before sending ------
--    Done last: PG allows ADD VALUE inside a transaction, but the new value
--    cannot be used in the same transaction - nothing below uses it.
ALTER TYPE mail.status ADD VALUE IF NOT EXISTS 'sending';
