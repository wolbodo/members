\c members;
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS(
      SELECT t.relname
      FROM pg_class t
      JOIN pg_attribute a ON a.attrelid = t.oid
      JOIN pg_index ix    ON t.oid = ix.indrelid AND a.attnum = ANY(ix.indkey)
      JOIN pg_class i     ON i.oid = ix.indexrelid
      WHERE t.relkind = 'r' AND t.relname = 'person' AND a.attname = 'id' AND i.relname = 'pk'
    ) THEN
      ALTER TABLE auth.person
        ADD CONSTRAINT pk PRIMARY KEY (id);
    END IF;
END $$;


COMMIT;
