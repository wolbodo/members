
create type auth.jwt_token as (
  role text,
  exp integer,
  person_id integer,
  is_admin boolean,
  username varchar
);