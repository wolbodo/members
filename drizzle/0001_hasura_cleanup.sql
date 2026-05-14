-- 1. Drop dead Hasura state ------------------------------------------------
DROP TRIGGER IF EXISTS "notify_hasura_mail-trigger_INSERT" ON mail.entries;
--> statement-breakpoint
DROP SCHEMA IF EXISTS hdb_catalog CASCADE;
--> statement-breakpoint
DROP TYPE IF EXISTS auth.jwt_token;
--> statement-breakpoint

-- 2. Functions & Triggers --------------------------------------------------

CREATE OR REPLACE FUNCTION public.jsonb_diff(new jsonb, old jsonb) RETURNS jsonb
	LANGUAGE plpgsql AS $$
DECLARE
	result JSONB;
	v RECORD;
BEGIN
	result = new;
	FOR v IN SELECT * FROM jsonb_each(old) LOOP
		IF result @> jsonb_build_object(v.key,v.value) THEN 
			result = result - v.key;
		ELSIF result ? v.key THEN 
			CONTINUE;
		ELSE
			result = result || jsonb_build_object(v.key,'null');
		END IF;
	END LOOP;
	RETURN result;
END; $$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION auth.change_trigger() RETURNS trigger
	LANGUAGE plpgsql AS $fn$
BEGIN
	INSERT INTO auth.history (author_id, person_id, role, timestamp, new_values, old_values)
	VALUES (
		NULLIF(current_setting('app.user_id', true), '')::INTEGER,
		NEW.id,
		NULLIF(current_setting('app.user_role', true), ''),
		current_timestamp,
		public.jsonb_diff(to_jsonb(row_to_json(NEW)), CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END),
		public.jsonb_diff(CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END, to_jsonb(row_to_json(NEW)))
	);
	RETURN NEW;
END; $fn$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS log_history ON auth.person;
--> statement-breakpoint
CREATE TRIGGER log_history AFTER INSERT OR UPDATE ON auth.person FOR EACH ROW EXECUTE FUNCTION auth.change_trigger();
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
		public.jsonb_diff(to_jsonb(row_to_json(NEW)), CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END),
		public.jsonb_diff(CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END, to_jsonb(row_to_json(NEW)))
	);
	RETURN NEW;
END; $fn$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS log_role_history ON auth.person_role;
--> statement-breakpoint
CREATE TRIGGER log_role_history AFTER INSERT OR UPDATE ON auth.person_role FOR EACH ROW EXECUTE FUNCTION auth.role_change_trigger();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION mail.notify_entry() RETURNS trigger
	LANGUAGE plpgsql AS $fn$
BEGIN
	PERFORM pg_notify('mail_entries_new', NEW.id::text);
	RETURN NEW;
END; $fn$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS mail_entry_notify ON mail.entries;
--> statement-breakpoint
CREATE TRIGGER mail_entry_notify AFTER INSERT ON mail.entries FOR EACH ROW EXECUTE FUNCTION mail.notify_entry();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION auth.update_modified() RETURNS trigger
	LANGUAGE plpgsql AS $$
BEGIN
	NEW.modified = now(); 
	RETURN NEW;
END; $$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS update_modified ON auth.person;
--> statement-breakpoint
CREATE TRIGGER update_modified BEFORE UPDATE ON auth.person FOR EACH ROW EXECUTE FUNCTION auth.update_modified();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION auth.hash_password() RETURNS trigger
	LANGUAGE plpgsql AS $$
BEGIN
	IF NEW.password IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.password <> OLD.password) THEN
		NEW.password = crypt(NEW.password, gen_salt('bf')); 
	END IF;
	RETURN NEW;
EXCEPTION WHEN OTHERS THEN
	RETURN NEW;
END; $$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS hash_password ON auth.person;
--> statement-breakpoint
CREATE TRIGGER hash_password BEFORE INSERT OR UPDATE OF password ON auth.person FOR EACH ROW EXECUTE FUNCTION auth.hash_password();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION mail.notify_password_change() RETURNS trigger
	LANGUAGE plpgsql AS $$
BEGIN
	INSERT INTO mail.entries (person_id, template)
	VALUES (NEW.id, 'password-change-notification');
	RETURN NEW;
END; $$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS notify_password_change ON auth.person;
--> statement-breakpoint
CREATE TRIGGER notify_password_change AFTER UPDATE OF password ON auth.person FOR EACH ROW EXECUTE FUNCTION mail.notify_password_change();
--> statement-breakpoint

-- 3. Data Reconciliation ---------------------------------------------------

UPDATE mail.entries SET status = 'sent' WHERE status = 'new' AND message_info IS NOT NULL AND message_info <> '{}'::jsonb;
--> statement-breakpoint
UPDATE mail.entries SET status = 'error' WHERE status = 'new';
--> statement-breakpoint
ALTER TYPE mail.status ADD VALUE IF NOT EXISTS 'sending';
