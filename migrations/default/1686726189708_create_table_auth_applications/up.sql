CREATE TABLE "auth"."application" ("name" text NOT NULL, "secret" uuid NOT NULL DEFAULT gen_random_uuid(), "role" text NOT NULL, PRIMARY KEY ("name") );COMMENT ON TABLE "auth"."applications" IS E'Storing application secrets';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
