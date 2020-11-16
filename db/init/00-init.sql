\c members;
CREATE EXTENSION btree_gist;

BEGIN;

CREATE SCHEMA auth;

create type auth.jwt_token as (
  role text,
  exp integer,
  person_id integer,
  is_admin boolean,
  username varchar
);


CREATE TABLE auth.person (
  id                SERIAL,

  name              VARCHAR(255)        NOT NULL,
  email             VARCHAR(255)        UNIQUE,
  password          VARCHAR(1024)       ,
  firstname         VARCHAR(512)        ,
  lastname          VARCHAR(512)        ,
  phone             VARCHAR(255)        ,

  address           VARCHAR(1024)       ,
  zipcode           VARCHAR(255)        ,
  city              VARCHAR(255)        ,
  country           VARCHAR(255)        ,

  bankaccount       VARCHAR(80)         ,

  note              TEXT                ,

  -- student              BOOLEAN         ,
  -- birthdate              TIMESTAMPTZ         ,
  -- membersince              TIMESTAMPTZ         ,
  created           TIMESTAMPTZ         DEFAULT NOW(), -- Adding a created cause validity might have to be reset
  modified          TIMESTAMPTZ         DEFAULT NOW(),

  UNIQUE(id),

  CONSTRAINT is_email CHECK (email ~ '^[^@]+@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$')
  -- CONSTRAINT is_iban  CHECK (bankaccount ~ '^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$')
);
CREATE INDEX ON auth.person (id);
CREATE INDEX ON auth.person (email);

-- ALTER TABLE auth.person ENABLE ROW LEVEL SECURITY

-- GRANT
--   SELECT,
--   INSERT,
--   UPDATE,
--   DELETE
-- ON auth.person
-- TO graphql_role;
-- Users can edit their own data
-- Bestuur can edit all users

INSERT INTO auth.person (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  ('Charly', 'charly@example.com'),
  ('Dennis', NULL),
  ('Edward', NULL);


CREATE ROLE member;
CREATE ROLE admin;
CREATE ROLE board;

CREATE TABLE auth.person_role (
  person_id   INTEGER   NOT NULL REFERENCES auth.person(id),
  role        VARCHAR   NOT NULL, --     INTEGER   REFERENCES auth.role   (id),

  validity    TSTZRANGE           DEFAULT TSTZRANGE(now(),NULL),

  EXCLUDE USING gist (person_id WITH =, role WITH =, validity WITH &&)
);
CREATE INDEX ON auth.person_role(person_id);

CREATE FUNCTION
  auth.check_role_exists() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles AS r WHERE r.rolname = new.role) THEN
    RAISE foreign_key_violation USING message =
      'unknown database role: ' || new.role;
    RETURN NULL;
  END IF;
  RETURN new;
END
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER ensure_user_role_exists
  AFTER INSERT OR UPDATE ON auth.person_role
  FOR EACH ROW
  EXECUTE PROCEDURE auth.check_role_exists();


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