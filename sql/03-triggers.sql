
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

CREATE TRIGGER synchronize_membership
  AFTER UPDATE OR INSERT
  ON public.member_role
  FOR EACH ROW EXECUTE PROCEDURE 
  public.synchronize_membership();

CREATE TRIGGER notify_password_change
  AFTER UPDATE OF password
  ON public.member
  FOR EACH ROW EXECUTE PROCEDURE 
  public.notify_password_change();

CREATE TRIGGER update_modified
  BEFORE UPDATE
  ON public.role
  FOR EACH ROW EXECUTE PROCEDURE 
  public.update_modified();

CREATE TRIGGER update_modified BEFORE UPDATE
  ON public.member_role FOR EACH ROW EXECUTE PROCEDURE 
  public.update_modified();

