CREATE EXTENSION pgcrypto;
CREATE EXTENSION btree_gist;

CREATE SCHEMA public;
DROP TABLE IF EXISTS public.member CASCADE;
DROP TABLE IF EXISTS public.role CASCADE;
DROP TABLE IF EXISTS public.member_role CASCADE;
