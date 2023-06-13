alter table "auth"."person" add column "allow_register" boolean
 not null default 'false';
