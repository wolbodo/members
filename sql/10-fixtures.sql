
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
SELECT account.user.id, account.role.id, '[now,)' FROM
    (VALUES
        ('admin@example.org', array['user','admin']),
        ('dexter@example.org', array['user']),
        ('bwb@example.org', array['user'])
    ) alias (email, role_names)
    JOIN account.user ON account.user.validity @> NOW() AND account.user.email = alias.email
    JOIN account.role ON account.role.validity @> NOW() AND account.role.name IN (SELECT unnest(alias.role_names));

COMMIT;