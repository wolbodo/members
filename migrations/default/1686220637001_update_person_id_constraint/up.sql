ALTER TABLE ONLY auth.history
    ALTER COLUMN person_id DROP NOT NULL,
    DROP CONSTRAINT history_person_id_fkey;

ALTER TABLE ONLY auth.history
    ADD CONSTRAINT history_person_id_fkey
      FOREIGN KEY (person_id) REFERENCES auth.person(id)
      ON DELETE SET NULL;
