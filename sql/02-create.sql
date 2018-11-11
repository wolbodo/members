

CREATE TABLE public.user (
  id          SERIAL            PRIMARY KEY,
  name        TEXT              NOT NULL,
  created     TIMESTAMPTZ       DEFAULT 'NOW',
  modified    TIMESTAMPTZ       DEFAULT 'NOW',
  password    TEXT
);

CREATE TABLE public.role (
  id          SERIAL            PRIMARY KEY,
  name        TEXT              NOT NULL,
  created     TIMESTAMPTZ       DEFAULT 'NOW',
  modified    TIMESTAMPTZ       DEFAULT 'NOW'
);

CREATE TABLE public.user_role (
  user_id INT references public.user(id),
  role_id INT references public.role(id),
  note    TEXT DEFAULT '',
  created     TIMESTAMPTZ       DEFAULT 'NOW',
  modified    TIMESTAMPTZ       DEFAULT 'NOW',
  PRIMARY KEY(user_id,role_id)
);
