
CREATE OR REPLACE FUNCTION auth.update_modified()
RETURNS TRIGGER AS $$
BEGIN
   NEW.modified = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION auth.hash_password()
RETURNS TRIGGER AS $$
BEGIN
   NEW.password = CRYPT(NEW.password, public.gen_salt('bf')); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION mail.notify_password_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO mail.entries
    (person_id, template)
  VALUES
    (NEW.id, 'password-change-notification');
  RETURN NEW;
END; $$ LANGUAGE 'plpgsql';
