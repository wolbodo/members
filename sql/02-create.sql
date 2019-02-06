CREATE TABLE public.member (
  id                SERIAL,
  name              VARCHAR(255)        NOT NULL,
  email             VARCHAR(255)       ,
  password          VARCHAR(1024)       ,
  fullname          VARCHAR(1024)       NOT NULL,
  phone             VARCHAR(255)        ,

  address           VARCHAR(1024)       ,
  zipcode           VARCHAR(255)        ,
  city              VARCHAR(255)        ,
  country           VARCHAR(255)        ,

  validity          TSTZRANGE           DEFAULT '[NOW,)',
  created           TIMESTAMPTZ         DEFAULT 'NOW', -- Adding a created cause validity might have to be reset
  modified          TIMESTAMPTZ         DEFAULT 'NOW',

  EXCLUDE USING gist (name WITH =, validity WITH &&),
  PRIMARY KEY (name, validity),
  UNIQUE (id),
  CONSTRAINT is_email CHECK (email ~ '^[^@]+@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$')
);
CREATE INDEX ON public.member (email);
-- TODO: how to add EXCLUDE USING gist (email WITH =, validity WITH &&) ?

CREATE OR REPLACE VIEW public.active_member AS 
  SELECT id, name, email, password, fullname, phone,
    address, zipcode, city, country, modified
  FROM public.member
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
  validity          TSTZRANGE           NOT NULL,
  modified          TIMESTAMPTZ         DEFAULT 'NOW',

  EXCLUDE USING gist (name WITH =, validity WITH &&),
  PRIMARY KEY (name, validity), 
  UNIQUE (id)
);

CREATE TABLE public.member_role (
  member_id         INTEGER             NOT NULL REFERENCES public.member(id),
  role_id           INTEGER             NOT NULL REFERENCES public.role(id),
  note              TEXT                NOT NULL DEFAULT '',
  validity          TSTZRANGE           NOT NULL,
  modified          TIMESTAMPTZ         DEFAULT 'NOW',

  EXCLUDE USING gist (member_id WITH =, role_id WITH =, validity WITH &&),
  PRIMARY KEY (member_id, role_id, validity)
);

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
