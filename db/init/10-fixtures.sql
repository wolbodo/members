BEGIN;

INSERT INTO auth.person (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  ('Charly', 'charly@example.com'),
  ('Dennis', NULL),
  ('Edward', NULL);


CREATE ROLE member;
CREATE ROLE admin;
CREATE ROLE board;


INSERT INTO auth.person_role (person_id, role)
  SELECT auth.person.id, alias.role FROM (
    VALUES
      ('Alice', 'admin'),
      ('Alice', 'member'),
      ('Bob', 'board'),
      ('Bob', 'member'),
      ('Charly', 'member'),
      ('Dennis', 'member'),
      ('Edward', 'member')
  ) ALIAS (name, role)
  JOIN auth.person ON auth.person.name = alias.name
;

COMMIT;