
BEGIN;

-- INSERT INTO public.member
--   (name, email, password, firstname, validity)
-- VALUES
--   ('Admin', 'admin@example.org', 'admin', 'Administrator', '[1970-01-01 00:00:01,)'),
--   ('Dexter', 'dexter@example.org', 'dexter', 'Dexter', '[2008-11-20 22:00:00,)'),
--   ('Benjamin', 'bwb@example.org', '4cvbxWUpiuFLTHrDbrKY0pa4Uj4uXHgHb9KpCYTRx/ZMD8tn', 'Benjamin W. Broersma', '[2009-02-19 22:00:00,)'),
--   ('Dirk Jan', 'dj@example.org', '4cvbxWUpiuFLTHrDbrKY0pa4Uj4uXHgHb9KpCYTRx/ZMD8tn', 'Dirk Jan Olbodo', '[2009-02-19 22:00:00,)'),
--   ('Old User', 'old@example.org', '4cvbxWUpiuFLTHrDbrKY0pa4Uj4uXHgHb9KpCYTRx/ZMD8tn', 'Oude user', '[2009-02-19 22:00:00,2010-02-19 22:00:00]')
-- ;

INSERT INTO public.role
  (name, description, validity)
VALUES
  ('admin', 'Can change all the data', '[now,)'),
  ('member', 'Can login', '[now,)'),
  ('board', 'User is able to edit other users', '[now,)')
;

-- INSERT INTO public.member_role
--   (member_id, role_id, validity)
-- SELECT public.member.id, public.role.id, '[now,)' FROM
--     (VALUES
--         ('admin@example.org', array['member','admin']),
--         ('dexter@example.org', array['member', 'board']),
--         ('dj@example.org', array['member']),
--         ('bwb@example.org', array['member'])
--     ) alias (email, role_names)
--     JOIN public.member ON public.member.validity @> NOW() AND public.member.email = alias.email
--     JOIN public.role ON public.role.validity @> NOW() AND public.role.name IN (SELECT unnest(alias.role_names));

-- -- Old membership
-- INSERT INTO public.member_role
--   (member_id, role_id, validity)
-- SELECT public.member.id, public.role.id, '[01-01-1880,01-12-1950)' FROM
--     (VALUES
--         ('old@example.org', array['member'])
--     ) alias (email, role_names)
--     JOIN public.member ON public.member.email = alias.email
--     JOIN public.role ON public.role.validity @> NOW() AND public.role.name IN (SELECT unnest(alias.role_names));


COMMIT;
