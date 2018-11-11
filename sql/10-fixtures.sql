
BEGIN;

INSERT INTO account.user
  (name, email, password, fullname, validity)
VALUES
  ('admin', 'admin@example.org', 'admin', 'Administrator', '[1970-01-01 00:00:01,)'),
  ('dexter', 'dexter@example.org', 'dexter', 'Dexter', '[2008-11-20 22:00:00,)'),
  ('benjamin', 'bwb@example.org', '4cvbxWUpiuFLTHrDbrKY0pa4Uj4uXHgHb9KpCYTRx/ZMD8tn', 'Benjamin W. Broersma', '[2009-02-19 22:00:00,)')
;

INSERT INTO account.role
  (name, description, validity)
VALUES
  ('admin', 'Can change all the data', '[now,)'),
  ('user', 'User is able to perform login', '[now,)')
;

INSERT INTO account.user_role
  (user_id, role_id, validity)
VALUES
  (1, 1, '[now,)'),
  (2, 2, '[now,)'),
  (3, 2, '[now,)')
;

COMMIT;