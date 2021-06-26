BEGIN;

CREATE TABLE auth.person (
  id                SERIAL PRIMARY KEY,

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
  key_code          VARCHAR(80)         ,

  note              TEXT                ,

  -- student              BOOLEAN         ,
  -- birthdate              TIMESTAMPTZ         ,
  -- membersince              TIMESTAMPTZ         ,
  created           TIMESTAMPTZ         DEFAULT NOW(), -- Adding a created cause validity might have to be reset
  modified          TIMESTAMPTZ         DEFAULT NOW(),

  UNIQUE(id),

  CONSTRAINT is_email CHECK (email ~ '^\S+?@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$')
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


CREATE TABLE auth.person_role (
  id          SERIAL PRIMARY KEY,

  person_id   INTEGER      NOT NULL REFERENCES auth.person(id),
  role        VARCHAR      NOT NULL, --     INTEGER   REFERENCES auth.role   (id),

  valid_from  TIMESTAMPTZ  DEFAULT NOW(),
  valid_till  TIMESTAMPTZ  DEFAULT NULL

  -- EXCLUDE USING gist (person_id WITH =, role WITH =, validity WITH &&)
);
CREATE INDEX ON auth.person_role(person_id);


CREATE TYPE mail.status AS ENUM ('new', 'sent', 'error');
CREATE TABLE mail.entries (
  -- Used for representing mail sent to a user and it's status
  id                SERIAL,
  status            mail.status         DEFAULT 'new',

  person_id         INTEGER             NOT NULL REFERENCES auth.person(id),
  template          VARCHAR(255)        NOT NULL,
  data              JSONB               DEFAULT '{}',

  created           TIMESTAMPTZ         DEFAULT NOW(),

  message_info      JSONB               DEFAULT '{}',

  PRIMARY KEY (id)
);


COMMIT;