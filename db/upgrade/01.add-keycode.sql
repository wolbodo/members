\c members;
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS(
    	SELECT column_name
    	FROM information_schema.columns
    	WHERE table_schema = 'auth' AND table_name = 'person' AND column_name = 'key_code'
    ) THEN
        ALTER TABLE auth.person ADD COLUMN "key_code" TEXT;
    END IF;
END $$;


COMMIT;