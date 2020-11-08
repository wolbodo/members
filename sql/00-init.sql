\c members;
CREATE EXTENSION btree_gist;

BEGIN;

create type jwt_token as (
  role text,
  exp integer,
  person_id integer,
  is_admin boolean,
  username varchar
);

CREATE ROLE admin
CREATE ROLE member
CREATE ROLE board

CREATE TABLE person (
  id                SERIAL,
  
  name              VARCHAR(255)        NOT NULL,
  email             VARCHAR(255)        UNIQUE NOT NULL,
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

  UNIQUE (email),
  UNIQUE (id),
  CONSTRAINT is_email CHECK (email ~ '^[^@]+@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$')
  -- CONSTRAINT is_iban  CHECK (bankaccount ~ '^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$')
);
CREATE INDEX ON person (email);

ALTER TABLE person ENABLE ROW LEVEL SECURITY
-- Users can edit their own data
-- Bestuur can edit all users

INSERT INTO person (name, email) VALUES ('Bob', 'bob@example.com'), ('Alice', 'alice@example.com');



CREATE TABLE role (
  id      SERIAL,
  name    VARCHAR(255)          UNIQUE NOT NULL
)
CREATE TABLE person_role (

)



COMMIT;