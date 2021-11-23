\c members;
BEGIN;

ALTER TABLE auth.history ALTER COLUMN author_id DROP NOT NULL;


COMMIT;