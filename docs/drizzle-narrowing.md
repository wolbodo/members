# Drizzle narrowing backlog

The Hasura → Drizzle baseline (`drizzle/0000_baseline.sql`) widened
`src/lib/server/schema.ts` to match the live Hasura-era database **exactly** —
zero destructive DDL, zero data risk. The cost: several columns are far wider
than the data needs, and a couple of types are looser than ideal.

Tightening each is a normal PR:

1. Edit `src/lib/server/schema.ts`.
2. `pnpm db:generate` — review the generated `drizzle/NNNN_*.sql`.
3. Merge; `pnpm db:migrate` runs it on deploy.

**Before narrowing a column, confirm no row exceeds the target width:**

```sql
SELECT max(char_length(address)) FROM auth.person;   -- replace column
```

## Width candidates

| Table.column          | Current          | Suggested    | Notes                                                                                                                     |
| --------------------- | ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| auth.person.firstname | varchar(512)     | varchar(100) | First names rarely exceed 100.                                                                                            |
| auth.person.lastname  | varchar(512)     | varchar(100) | Same.                                                                                                                     |
| auth.person.phone     | varchar(255)     | varchar(40)  | E.164 + formatting tops out near 20.                                                                                      |
| auth.person.address   | varchar(1024)    | varchar(255) | Single-line address.                                                                                                      |
| auth.person.zipcode   | varchar(255)     | varchar(20)  | NL `1234 AB` = 7; leave room for foreign.                                                                                 |
| auth.person.city      | varchar(255)     | varchar(100) |                                                                                                                           |
| auth.person.country   | varchar(255)     | varchar(100) | Consider ISO-3166 alpha-2/alpha-3 later.                                                                                  |
| auth.person.password  | varchar(1024)    | varchar(60)  | bcrypt output is fixed at 60. The `auth.hash_password` DB trigger always produces bcrypt — safe to narrow once confirmed. |
| auth.person.key_code  | varchar(80)      | integer      | App treats it as numeric. Audit non-numeric rows first; then convert + drop the string handling.                          |
| auth.history.role     | varchar (no len) | varchar(50)  | Role names are short.                                                                                                     |
| auth.person_role.role | varchar (no len) | varchar(50)  | Same.                                                                                                                     |
| mail.entries.template | varchar(255)     | varchar(100) | Template keys are short identifiers.                                                                                      |

## Type / constraint candidates

- **auth.application.secret** is `uuid` (`gen_random_uuid()` default). The app
  compares it as a string via `safeEqual` — fine, but a future change could
  switch to a hashed secret instead of a bare UUID.
- **auth.person.email — `is_email` CHECK**: the regex predates modern unicode
  TLDs and is fairly strict. Consider relaxing, or moving validation into the
  app with a schema validator.
- **auth.history.timestamp** is `timestamp` _without_ time zone (Hasura legacy).
  New code should always insert UTC; a future migration could convert it to
  `timestamptz`.
- **Constraint / FK names** differ between a fresh DB (Drizzle conventions:
  `person_email_unique`, `*_person_id_fk`) and the legacy prod DB (Hasura
  conventions: `person_email_key`, `*_fkey`). Harmless today — `drizzle-kit
generate` diffs against `drizzle/meta/*.json`, not the live DB — but a future
  migration that drops a constraint _by name_ must use the legacy name on prod.
