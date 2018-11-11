
INSERT INTO public.user
  (name, password)
VALUES
  ('login', NULL),
  ('admin', 'admin'),
  ('dexter', 'dexter')
;

INSERT INTO public.role
  (name)
VALUES
  ('login'),
  ('admin'),
  ('user')
;

INSERT INTO public.user_role
  (user_id, role_id)
VALUES
  (1, 1),
  (2, 2),
  (3, 3)
;