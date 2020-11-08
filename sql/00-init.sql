\c members;
CREATE EXTENSION btree_gist;

BEGIN;

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

  created           TIMESTAMPTZ         DEFAULT NOW(), -- Adding a created cause validity might have to be reset
  modified          TIMESTAMPTZ         DEFAULT NOW(),

  CONSTRAINT is_email CHECK (email ~ '^[^@]+@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$')
  -- CONSTRAINT is_iban  CHECK (bankaccount ~ '^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$')
);
CREATE INDEX ON auth.person (email);

ALTER TABLE auth.person ENABLE ROW LEVEL SECURITY
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

CREATE TABLE auth.role (
  id          SERIAL,
  name        VARCHAR(255)          UNIQUE NOT NULL
);
INSERT INTO auth.role (name) VALUES ('admin'), ('board');

CREATE TABLE auth.person_role (
  person_id   INTEGER   REFERENCES person (id),
  role_id    INTEGER   REFERENCES role   (id),

  validity    TSTZRANGE           DEFAULT TSTZRANGE(now(),NULL),

  EXCLUDE USING gist (person_id WITH =, role_id WITH =, validity WITH &&)
);
INSERT INTO auth.person_role (person_id, role_id)
  SELECT auth.person.id, auth.role.id FROM (
    VALUES
      ('Alice', 'admin'),
      ('Bob', 'board')
  ) ALIAS (name, role)
  JOIN auth.person ON auth.person.name = alias.name
  JOIN auth.role ON auth.role.name = alias.role
;

-- INSERT INTO public.member_role
--   (member_id, role_id, validity)
-- SELECT public.member.id, public.role.id, '[now,)' FROM
--     (VALUES
--         ('admin@example.org', array['member','admin']),
--         ('dexter@example.org', array['member', 'board']),
--         ('dj@example.org', array['member']),
--         ('bwb@example.org', array['member'])
--     ) alias (email, role_names)
--     JOIN public.member ON public.member.validity @> NOW() AND public.member.email = alias.email
--     JOIN public.role ON public.role.validity @> NOW() AND public.role.name IN (SELECT unnest(alias.role_names));




COMMIT;