ALTER TABLE ONLY auth.person_role
    DROP CONSTRAINT person_role_person_id_fkey,
    ADD CONSTRAINT person_role_person_id_fkey
      FOREIGN KEY (person_id) REFERENCES auth.person(id)
      ON DELETE CASCADE;
