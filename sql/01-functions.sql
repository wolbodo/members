
-- CREATE OR REPLACE FUNCTION public.create_jwt(payload JSONB)
--  RETURNS TEXT
--  LANGUAGE plpgsql
--  STABLE
-- AS $function$
-- DECLARE
--     header JSONB;
--     content TEXT;
--     signature TEXT;
-- BEGIN
--     --TODO: add (enforced) expire and type (login, passwordreset, etc.)
--     header = '{"type":"jwt", "alg":"hs256"}'::JSONB;
--     content = jsonb_base64url(header) || '.' || jsonb_base64url(payload);
--     signature = TRANSLATE(ENCODE(HMAC(content, 'token_sha256_key', 'sha256'), 'base64'), '+/=', '-_');
--     RETURN content || '.' || signature;
-- END
-- $function$;

CREATE OR REPLACE FUNCTION public.update_modified()
RETURNS TRIGGER AS $$
BEGIN
   NEW.modified = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION public.hash_password()
RETURNS TRIGGER AS $$
BEGIN
   NEW.password = CRYPT(NEW.password, public.gen_salt('bf')); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION public.notify_password_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO mail
    (member_id, template)
  VALUES
    (NEW.id, 'password-change');
  RETURN NEW;
END; $$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION public.synchronize_membership()
RETURNS TRIGGER AS $$
DECLARE
  membership TEXT;
BEGIN
  -- When update and role = 'member' and validity != now        -> validity :[...,now]
  -- When insert and role = 'member' and member.validity != now -> validity := [now,)
  IF NEW.role_id != (SELECT id FROM public.role WHERE name = 'member') THEN
    RETURN NULL;
  END IF;

  IF (NEW.validity @> now()) THEN
    UPDATE public.member
      SET validity = tstzrange(now(), NULL, '[)')
      WHERE id = NEW.member_id AND NOT (validity @> now());
  ELSE
    UPDATE public.member
      SET validity = tstzrange(lower(validity), now(), '[]')
      WHERE id = NEW.member_id AND (validity @> now());
  END IF;
  RETURN NULL;
END; $$ LANGUAGE 'plpgsql';



CREATE OR REPLACE FUNCTION slugify("value" TEXT, "allow_unicode" BOOLEAN)
RETURNS TEXT AS $$
  WITH "normalized" AS (
    SELECT CASE
      WHEN "allow_unicode" THEN "value"
      ELSE unaccent("value")
    END AS "value"
  ),
  "remove_chars" AS (
    SELECT regexp_replace("value", E'[^\\w\\s-]', '', 'gi') AS "value"
    FROM "normalized"
  ),
  "lowercase" AS (
    SELECT lower("value") AS "value"
    FROM "remove_chars"
  ),
  "trimmed" AS (
    SELECT trim("value") AS "value"
    FROM "lowercase"
  ),
  "hyphenated" AS (
    SELECT regexp_replace("value", E'[-\\s]+', '-', 'gi') AS "value"
    FROM "trimmed"
  )
  SELECT "value" FROM "hyphenated";
$$ LANGUAGE SQL STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION public.slugify_name()
RETURNS TRIGGER AS $$
BEGIN
   NEW.slug = slugify(NEW.name, false);
   RETURN NEW;
END;
$$ language 'plpgsql';

