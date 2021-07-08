\c members;
BEGIN;

CREATE OR REPLACE FUNCTION auth.role_change_trigger()
RETURNS trigger AS $$
BEGIN
  INSERT INTO auth.history (author_id, person_id, role, timestamp, new_values, old_values)
  VALUES (
    (current_setting('hasura.user', 't')::jsonb ->> 'x-hasura-user-id')::INTEGER,
    NEW.id,
    current_setting('hasura.user', 't')::jsonb ->> 'x-hasura-role',
    current_timestamp,                            -- action_tstamp_tx
    jsonb_diff(to_jsonb(row_to_json(NEW)), to_jsonb(row_to_json(OLD))),
    jsonb_diff(to_jsonb(row_to_json(OLD)), to_jsonb(row_to_json(NEW)))
  );
  RETURN NEW;
END; $$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS log_role_history on auth.person_role;
CREATE TRIGGER log_role_history
  BEFORE UPDATE
  ON auth.person_role
  FOR EACH ROW EXECUTE PROCEDURE 
  auth.change_trigger();

COMMIT;