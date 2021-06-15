\c members;
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS(
    	SELECT column_name
    	FROM information_schema.columns
    	WHERE table_schema = 'auth' AND table_name = 'history'
    ) THEN
      CREATE TABLE auth.history (
        id          SERIAL,
        author_id   INTEGER             NOT NULL REFERENCES auth.person(id),
        person_id   INTEGER             NOT NULL REFERENCES auth.person(id),
        role        VARCHAR,
        timestamp   timestamp,
        new_values  JSONB,
        old_values  JSONB
      );
 
    END IF;
END $$;

CREATE OR REPLACE FUNCTION jsonb_diff(new JSONB,old JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  v RECORD;
BEGIN
   result = new;
   FOR v IN SELECT * FROM jsonb_each(old) LOOP
     IF result @> jsonb_build_object(v.key,v.value)
        THEN result = result - v.key;
     ELSIF result ? v.key THEN CONTINUE;
     ELSE
        result = result || jsonb_build_object(v.key,'null');
     END IF;
   END LOOP;
   RETURN result;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION auth.change_trigger()
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

DROP TRIGGER IF EXISTS log_history on auth.person;
CREATE TRIGGER log_history
  BEFORE UPDATE
  ON auth.person
  FOR EACH ROW EXECUTE PROCEDURE 
  auth.change_trigger();

COMMIT;