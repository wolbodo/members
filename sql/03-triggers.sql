
CREATE TRIGGER update_modified
  BEFORE UPDATE
  ON account.user
  FOR EACH ROW EXECUTE PROCEDURE 
  account.update_modified();

CREATE TRIGGER hash_password
  BEFORE UPDATE OF password OR INSERT
  ON account.user
  FOR EACH ROW EXECUTE PROCEDURE 
  account.hash_password();

CREATE TRIGGER update_modified
  BEFORE UPDATE
  ON account.role
  FOR EACH ROW EXECUTE PROCEDURE 
  account.update_modified();

CREATE TRIGGER update_modified BEFORE UPDATE
  ON account.user_role FOR EACH ROW EXECUTE PROCEDURE 
  account.update_modified();

