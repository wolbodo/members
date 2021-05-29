
CREATE TRIGGER update_modified
  BEFORE UPDATE
  ON auth.person
  FOR EACH ROW EXECUTE PROCEDURE 
  auth.update_modified();

CREATE TRIGGER hash_password
  BEFORE UPDATE OF password OR INSERT
  ON auth.person
  FOR EACH ROW EXECUTE PROCEDURE 
  auth.hash_password();