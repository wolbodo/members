CREATE TABLE public.member (
  id                SERIAL,
  name              VARCHAR(255)        NOT NULL,
  email             VARCHAR(255)        ,
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

  validity          TSTZRANGE           DEFAULT TSTZRANGE(now(),NULL),
  created           TIMESTAMPTZ         DEFAULT 'NOW', -- Adding a created cause validity might have to be reset
  modified          TIMESTAMPTZ         DEFAULT 'NOW',

  EXCLUDE USING gist (name WITH =, validity WITH &&),
  PRIMARY KEY (name, validity),
  UNIQUE (id),
  CONSTRAINT is_email CHECK (email ~ '^[^@]+@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$')
  -- CONSTRAINT is_iban  CHECK (bankaccount ~ '^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$')
);
CREATE INDEX ON public.member (email);
-- TODO: how to add EXCLUDE USING gist (email WITH =, validity WITH &&) ?

CREATE OR REPLACE VIEW public.active_member AS 
  SELECT * FROM public.member
  WHERE (validity @> now());

-- View function for use in hasura
CREATE FUNCTION find_member(slug text)
RETURNS SETOF member AS $$
    SELECT *
    FROM member
    WHERE
      slug = slugify(member.name, false)
$$ LANGUAGE sql STABLE;


CREATE TABLE public.role (
  id                SERIAL,
  name              VARCHAR(1024)       NOT NULL,
  description       TEXT                NOT NULL,
  validity          TSTZRANGE           DEFAULT TSTZRANGE(NULL,NULL),
  modified          TIMESTAMPTZ         DEFAULT 'NOW',

  EXCLUDE USING gist (name WITH =, validity WITH &&),
  PRIMARY KEY (name, validity), 
  UNIQUE (id)
);

CREATE TABLE public.member_role (
  member_id         INTEGER             NOT NULL REFERENCES public.member(id),
  role_id           INTEGER             NOT NULL REFERENCES public.role(id),
  note              TEXT                DEFAULT '',
  validity          TSTZRANGE           DEFAULT TSTZRANGE(now(),NULL),
  modified          TIMESTAMPTZ         DEFAULT 'NOW',

  EXCLUDE USING gist (member_id WITH =, role_id WITH =, validity WITH &&),
  PRIMARY KEY (member_id, role_id, validity)
);
CREATE RULE catch_member_role_delete AS ON DELETE TO public.member_role
  DO INSTEAD 
    UPDATE public.member_role
      SET
        validity = tstzrange(lower(validity), now())
      WHERE
        member_id = OLD.member_id AND role_id = OLD.role_id
        AND
        validity @> now()
    RETURNING
       OLD.*;

CREATE OR REPLACE VIEW public.active_member_role AS 
  SELECT mr.*
  FROM public.member_role mr
  WHERE (mr.validity @> now());

CREATE TYPE public.mail_status AS ENUM ('new', 'sent', 'error');
CREATE TABLE public.mail (
  -- Used for representing mail sent to a member and it's status
  id                SERIAL,
  status            mail_status         DEFAULT 'new',

  member_id         INTEGER             NOT NULL REFERENCES public.member(id),
  template          VARCHAR(255)           NOT NULL,
  data              JSONB               DEFAULT '{}',

  PRIMARY KEY (id)

);
