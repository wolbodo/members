-- Notify the in-process mail worker whenever a new row is enqueued in
-- mail.entries. Replaces the Hasura event-trigger that used to POST to
-- /mail/trigger. Apply once: psql "$DATABASE_URL" -f migrations/0001_mail_notify.sql
CREATE OR REPLACE FUNCTION mail.notify_entry() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('mail_entries_new', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS mail_entry_notify ON mail.entries;
CREATE TRIGGER mail_entry_notify
  AFTER INSERT ON mail.entries
  FOR EACH ROW EXECUTE FUNCTION mail.notify_entry();
