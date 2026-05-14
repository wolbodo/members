-- Baseline schema.
--
-- On a fresh database this builds the whole schema. On the existing
-- Hasura-era production database (where auth.person already exists) the
-- guard makes this a no-op marker -- the real Hasura->Drizzle transition
-- lives in 0001_hasura_cleanup.sql, which runs everywhere.
--
-- Net effect: `pnpm db:migrate` sets up any database, new or legacy, with
-- the same single command.
DO $$
BEGIN
	IF to_regclass('auth.person') IS NOT NULL THEN
		RAISE NOTICE 'auth.person already exists - baseline skipped (existing database)';
		RETURN;
	END IF;

	CREATE SCHEMA IF NOT EXISTS "auth";
	CREATE SCHEMA IF NOT EXISTS "mail";

	CREATE TYPE "mail"."status" AS ENUM('new', 'sent', 'error', 'sending');

	CREATE TABLE "auth"."application" (
		"name" text PRIMARY KEY NOT NULL,
		"role" text NOT NULL,
		"secret" uuid DEFAULT gen_random_uuid() NOT NULL
	);

	CREATE TABLE "auth"."person" (
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

	CREATE TABLE "auth"."history" (
		"id" serial PRIMARY KEY NOT NULL,
		"timestamp" timestamp,
		"old_values" jsonb,
		"new_values" jsonb,
		"role" varchar,
		"author_id" integer REFERENCES "auth"."person"("id"),
		"person_id" integer REFERENCES "auth"."person"("id") ON DELETE SET NULL
	);

	CREATE TABLE "auth"."person_role" (
		"id" serial PRIMARY KEY NOT NULL,
		"person_id" integer REFERENCES "auth"."person"("id") ON DELETE CASCADE,
		"role" varchar NOT NULL,
		"valid_from" timestamp with time zone DEFAULT now(),
		"valid_till" timestamp with time zone
	);

	CREATE TABLE "mail"."entries" (
		"id" serial PRIMARY KEY NOT NULL,
		"person_id" integer NOT NULL REFERENCES "auth"."person"("id"),
		"status" "mail"."status" DEFAULT 'new',
		"template" varchar(255) NOT NULL,
		"created" timestamp with time zone DEFAULT now(),
		"data" jsonb DEFAULT '{}'::jsonb,
		"message_info" jsonb DEFAULT '{}'::jsonb
	);

	CREATE INDEX "person_email_idx" ON "auth"."person" USING btree ("email");
	CREATE INDEX "person_id_idx" ON "auth"."person" USING btree ("id");
	CREATE INDEX "person_role_person_id_idx" ON "auth"."person_role" USING btree ("person_id");
END $$;
