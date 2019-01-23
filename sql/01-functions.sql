
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
