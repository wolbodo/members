-- Baseline schema using standard idempotent DDL.
CREATE SCHEMA IF NOT EXISTS "auth";
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "mail";
--> statement-breakpoint

DO $$ BEGIN
    CREATE TYPE "mail"."status" AS ENUM('new', 'sent', 'error', 'sending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "auth"."application" (
	"name" text PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"secret" uuid DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "auth"."person" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"firstname" varchar(512),
	"lastname" varchar(512),
	"email" varchar(255),
	"phone" varchar(255),
	"address" varchar(1024),
	"zipcode" varchar(255),
	"city" varchar(255),
	"country" varchar(255),
	"bankaccount" varchar(80),
	"key_code" varchar(80),
	"allow_register" boolean DEFAULT false NOT NULL,
	"allow_door" boolean DEFAULT false NOT NULL,
	"password" varchar(1024),
	"note" text,
	"created" timestamp with time zone DEFAULT now(),
	"modified" timestamp with time zone DEFAULT now(),
	CONSTRAINT "person_email_unique" UNIQUE("email"),
	CONSTRAINT "is_email" CHECK ("auth"."person"."email" ~ '^\S+?@([a-zA-Z0-9][a-zA-Z0-9-]*\.)+(xn--[a-zA-Z0-9-]{4,}|[a-zA-Z]{2,})$')
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "auth"."history" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp,
	"old_values" jsonb,
	"new_values" jsonb,
	"role" varchar,
	"author_id" integer REFERENCES "auth"."person"("id"),
	"person_id" integer REFERENCES "auth"."person"("id") ON DELETE SET NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "auth"."person_role" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer REFERENCES "auth"."person"("id") ON DELETE CASCADE,
	"role" varchar NOT NULL,
	"valid_from" timestamp with time zone DEFAULT now(),
	"valid_till" timestamp with time zone
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "mail"."entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL REFERENCES "auth"."person"("id"),
	"status" "mail"."status" DEFAULT 'new',
	"template" varchar(255) NOT NULL,
	"created" timestamp with time zone DEFAULT now(),
	"data" jsonb DEFAULT '{}'::jsonb,
	"message_info" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "person_email_idx" ON "auth"."person" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "person_id_idx" ON "auth"."person" USING btree ("id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "person_role_person_id_idx" ON "auth"."person_role" USING btree ("person_id");
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.jsonb_diff(new jsonb, old jsonb) RETURNS jsonb
	LANGUAGE plpgsql AS $$
DECLARE
	result JSONB;
	v RECORD;
BEGIN
	result = new;
	FOR v IN SELECT * FROM jsonb_each(old) LOOP
		IF result @> jsonb_build_object(v.key,v.value) THEN 
			result = result - v.key;
		ELSIF result ? v.key THEN 
			CONTINUE;
		ELSE
			result = result || jsonb_build_object(v.key,'null');
		END IF;
	END LOOP;
	RETURN result;
END; $$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION auth.update_modified() RETURNS trigger
	LANGUAGE plpgsql AS $$
BEGIN
	NEW.modified = now(); 
	RETURN NEW;
END; $$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION auth.hash_password() RETURNS trigger
	LANGUAGE plpgsql AS $$
BEGIN
	IF NEW.password IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.password <> OLD.password) THEN
		NEW.password = crypt(NEW.password, gen_salt('bf')); 
	END IF;
	RETURN NEW;
EXCEPTION WHEN OTHERS THEN
	RETURN NEW;
END; $$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION mail.notify_password_change() RETURNS trigger
	LANGUAGE plpgsql AS $$
BEGIN
	INSERT INTO mail.entries (person_id, template)
	VALUES (NEW.id, 'password-change-notification');
	RETURN NEW;
END; $$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION auth.change_trigger() RETURNS trigger
	LANGUAGE plpgsql AS $$
BEGIN
	INSERT INTO auth.history (author_id, person_id, role, timestamp, new_values, old_values)
	VALUES (
		NULLIF(current_setting('app.user_id', true), '')::INTEGER,
		NEW.id,
		NULLIF(current_setting('app.user_role', true), ''),
		current_timestamp,
		public.jsonb_diff(to_jsonb(row_to_json(NEW)), CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END),
		public.jsonb_diff(CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END, to_jsonb(row_to_json(NEW)))
	);
	RETURN NEW;
END; $$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION auth.role_change_trigger() RETURNS trigger
	LANGUAGE plpgsql AS $$
BEGIN
	INSERT INTO auth.history (author_id, person_id, role, timestamp, new_values, old_values)
	VALUES (
		NULLIF(current_setting('app.user_id', true), '')::INTEGER,
		NEW.person_id,
		NULLIF(current_setting('app.user_role', true), ''),
		current_timestamp,
		public.jsonb_diff(to_jsonb(row_to_json(NEW)), CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END),
		public.jsonb_diff(CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(row_to_json(OLD)) END, to_jsonb(row_to_json(NEW)))
	);
	RETURN NEW;
END; $$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS update_modified ON auth.person;
CREATE TRIGGER update_modified BEFORE UPDATE ON auth.person FOR EACH ROW EXECUTE FUNCTION auth.update_modified();
--> statement-breakpoint

DROP TRIGGER IF EXISTS hash_password ON auth.person;
CREATE TRIGGER hash_password BEFORE INSERT OR UPDATE OF password ON auth.person FOR EACH ROW EXECUTE FUNCTION auth.hash_password();
--> statement-breakpoint

DROP TRIGGER IF EXISTS notify_password_change ON auth.person;
CREATE TRIGGER notify_password_change AFTER UPDATE OF password ON auth.person FOR EACH ROW EXECUTE FUNCTION mail.notify_password_change();
--> statement-breakpoint

DROP TRIGGER IF EXISTS log_history ON auth.person;
CREATE TRIGGER log_history AFTER INSERT OR UPDATE ON auth.person FOR EACH ROW EXECUTE FUNCTION auth.change_trigger();
--> statement-breakpoint

DROP TRIGGER IF EXISTS log_role_history ON auth.person_role;
CREATE TRIGGER log_role_history AFTER INSERT OR UPDATE ON auth.person_role FOR EACH ROW EXECUTE FUNCTION auth.role_change_trigger();
