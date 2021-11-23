SET check_function_bodies = false;
CREATE SCHEMA auth;
CREATE SCHEMA mail;
CREATE TYPE auth.jwt_token AS (
	role text,
	exp integer,
	person_id integer,
	is_admin boolean,
	username character varying
);
CREATE TYPE mail.status AS ENUM (
    'new',
    'sent',
    'error'
);
CREATE FUNCTION auth.change_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO auth.history (author_id, person_id, role, timestamp, new_values, old_values)
  VALUES (
    (current_setting('hasura.user', 't')::jsonb ->> 'x-hasura-user-id')::INTEGER,
    NEW.id,
    current_setting('hasura.user', 't')::jsonb ->> 'x-hasura-role',
    current_timestamp,                            -- action_tstamp_tx
    jsonb_diff(to_jsonb(row_to_json(NEW)), to_jsonb(row_to_json(OLD))),
    jsonb_diff(to_jsonb(row_to_json(OLD)), to_jsonb(row_to_json(NEW)))
  );
  RETURN NEW;
END; $$;
CREATE FUNCTION auth.hash_password() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.password = CRYPT(NEW.password, public.gen_salt('bf')); 
   RETURN NEW;
END;
$$;
CREATE FUNCTION auth.role_change_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO auth.history (author_id, person_id, role, timestamp, new_values, old_values)
  VALUES (
    (current_setting('hasura.user', 't')::jsonb ->> 'x-hasura-user-id')::INTEGER,
    NEW.id,
    current_setting('hasura.user', 't')::jsonb ->> 'x-hasura-role',
    current_timestamp,                            -- action_tstamp_tx
    jsonb_diff(to_jsonb(row_to_json(NEW)), to_jsonb(row_to_json(OLD))),
    jsonb_diff(to_jsonb(row_to_json(OLD)), to_jsonb(row_to_json(NEW)))
  );
  RETURN NEW;
END; $$;
CREATE FUNCTION auth.update_modified() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.modified = now(); 
   RETURN NEW;
END;
$$;
CREATE FUNCTION mail.notify_password_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO mail.entries
    (person_id, template)
  VALUES
    (NEW.id, 'password-change-notification');
  RETURN NEW;
END; $$;
CREATE TABLE auth.history (
    id integer NOT NULL,
    author_id integer,
    person_id integer NOT NULL,
    role character varying,
    "timestamp" timestamp without time zone,
    new_values jsonb,
    old_values jsonb
);
CREATE SEQUENCE auth.history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE auth.history_id_seq OWNED BY auth.history.id;
CREATE TABLE auth.person (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    password character varying(1024),
    firstname character varying(512),
    lastname character varying(512),
    phone character varying(255),
    address character varying(1024),
    zipcode character varying(255),
    city character varying(255),
    country character varying(255),
    bankaccount character varying(80),
    key_code character varying(80),
    note text,
    created timestamp with time zone DEFAULT now(),
    modified timestamp with time zone DEFAULT now(),
    CONSTRAINT is_email CHECK (((email)::text ~ '^\S+?@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$'::text))
);
CREATE SEQUENCE auth.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE auth.person_id_seq OWNED BY auth.person.id;
CREATE TABLE auth.person_role (
    id integer NOT NULL,
    person_id integer NOT NULL,
    role character varying NOT NULL,
    valid_from timestamp with time zone DEFAULT now(),
    valid_till timestamp with time zone
);
CREATE SEQUENCE auth.person_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE auth.person_role_id_seq OWNED BY auth.person_role.id;
CREATE TABLE mail.entries (
    id integer NOT NULL,
    status mail.status DEFAULT 'new'::mail.status,
    person_id integer NOT NULL,
    template character varying(255) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    created timestamp with time zone DEFAULT now(),
    message_info jsonb DEFAULT '{}'::jsonb
);
CREATE SEQUENCE mail.entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE mail.entries_id_seq OWNED BY mail.entries.id;
ALTER TABLE ONLY auth.history ALTER COLUMN id SET DEFAULT nextval('auth.history_id_seq'::regclass);
ALTER TABLE ONLY auth.person ALTER COLUMN id SET DEFAULT nextval('auth.person_id_seq'::regclass);
ALTER TABLE ONLY auth.person_role ALTER COLUMN id SET DEFAULT nextval('auth.person_role_id_seq'::regclass);
ALTER TABLE ONLY mail.entries ALTER COLUMN id SET DEFAULT nextval('mail.entries_id_seq'::regclass);
ALTER TABLE ONLY auth.person
    ADD CONSTRAINT person_email_key UNIQUE (email);
ALTER TABLE ONLY auth.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);
ALTER TABLE ONLY auth.person_role
    ADD CONSTRAINT person_role_pkey PRIMARY KEY (id);
ALTER TABLE ONLY mail.entries
    ADD CONSTRAINT entries_pkey PRIMARY KEY (id);
CREATE INDEX person_email_idx ON auth.person USING btree (email);
CREATE INDEX person_id_idx ON auth.person USING btree (id);
CREATE INDEX person_role_person_id_idx ON auth.person_role USING btree (person_id);
CREATE TRIGGER hash_password BEFORE INSERT OR UPDATE OF password ON auth.person FOR EACH ROW EXECUTE FUNCTION auth.hash_password();
CREATE TRIGGER log_history BEFORE UPDATE ON auth.person FOR EACH ROW EXECUTE FUNCTION auth.change_trigger();
CREATE TRIGGER log_role_history BEFORE UPDATE ON auth.person_role FOR EACH ROW EXECUTE FUNCTION auth.change_trigger();
CREATE TRIGGER notify_password_change AFTER UPDATE OF password ON auth.person FOR EACH ROW EXECUTE FUNCTION mail.notify_password_change();
CREATE TRIGGER update_modified BEFORE UPDATE ON auth.person FOR EACH ROW EXECUTE FUNCTION auth.update_modified();
ALTER TABLE ONLY auth.history
    ADD CONSTRAINT history_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.person(id);
ALTER TABLE ONLY auth.history
    ADD CONSTRAINT history_person_id_fkey FOREIGN KEY (person_id) REFERENCES auth.person(id);
ALTER TABLE ONLY auth.person_role
    ADD CONSTRAINT person_role_person_id_fkey FOREIGN KEY (person_id) REFERENCES auth.person(id);
ALTER TABLE ONLY mail.entries
    ADD CONSTRAINT entries_person_id_fkey FOREIGN KEY (person_id) REFERENCES auth.person(id);
