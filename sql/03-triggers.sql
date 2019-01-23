
CREATE TRIGGER update_modified
  BEFORE UPDATE
  ON public.member
  FOR EACH ROW EXECUTE PROCEDURE 
  public.update_modified();

CREATE TRIGGER hash_password
  BEFORE UPDATE OF password OR INSERT
  ON public.member
  FOR EACH ROW EXECUTE PROCEDURE 
  public.hash_password();

CREATE TRIGGER update_modified
  BEFORE UPDATE
  ON public.role
  FOR EACH ROW EXECUTE PROCEDURE 
  public.update_modified();

CREATE TRIGGER update_modified BEFORE UPDATE
  ON public.member_role FOR EACH ROW EXECUTE PROCEDURE 
  public.update_modified();

