# Members

Wolbodo members-management app and SSO gateway.

## Stack

- Node 22, pnpm 11 (via corepack)
- SvelteKit 2 + Svelte 5 (runes)
- Drizzle ORM over Postgres 15
- Vite 8, TypeScript 6
- Storybook 10 (with svelte-csf) for the component sandbox
- oxlint + oxfmt
- Vitest 4 for unit tests; Playwright for end-to-end

## Local development

### Prerequisites

1. Enable corepack and install pnpm 11:

   ```sh
   corepack enable
   corepack prepare pnpm@11 --activate
   ```

2. Copy `.env.example` to `.env` and fill in the values.
   - `JWT_SECRET` must be at least 32 characters.

3. Create the shared Docker network once:
   ```sh
   docker network create wolbodo
   ```

### Start the database

```sh
docker compose up -d db
```

### Apply schema

```sh
pnpm install
pnpm db:migrate   # runs every migration in drizzle/; builds a fresh DB or
                  # upgrades the existing one with the same command
```

### Run the app

```sh
pnpm dev
```

## Commands

```sh
pnpm dev               # SvelteKit dev server
pnpm build             # Production build
pnpm preview           # Preview production build
pnpm check             # svelte-check + tsc
pnpm lint              # oxlint + oxfmt --check
pnpm format            # oxfmt --write
pnpm test              # Playwright end-to-end
pnpm test:unit         # Vitest unit tests
pnpm storybook         # Storybook dev server (:6006)
pnpm build-storybook   # Static Storybook build
pnpm db:generate       # Generate a migration from schema.ts changes
pnpm db:migrate        # Apply pending migrations in drizzle/
pnpm db:studio         # Drizzle Studio
pnpm db:push           # Dev-only: push schema.ts straight to the DB (no migration file)
```

## Database

Drizzle owns the schema. `src/lib/server/schema.ts` is the source of truth;
SQL migrations live in `drizzle/`.

- **Changing the schema** — edit `schema.ts`, run `pnpm db:generate`, review the
  generated `drizzle/NNNN_*.sql`, commit it. Deploys run `pnpm db:migrate`.
- **Setting up a database** — `pnpm db:migrate`. The baseline migration
  (`0000_baseline.sql`) builds a fresh database; on the legacy Hasura-era
  database it is a guarded no-op, and `0001_hasura_cleanup.sql` does the
  Hasura→Drizzle transition. The same command works for both.
- **Narrowing the schema** — the baseline deliberately kept the wide
  Hasura-era column types. Tightening candidates are tracked in
  [docs/drizzle-narrowing.md](docs/drizzle-narrowing.md).

### DB-side logic (do not duplicate in app code)

Several triggers live in the database and the app must not re-implement them:

- `auth.hash_password` — bcrypts `auth.person.password` on INSERT/UPDATE. App
  code submits **plaintext**; never pre-hash.
- `auth.notify_password_change` — enqueues the `password-change-notification`
  email when a password changes. Never enqueue it manually.
- `auth.update_modified` — stamps `auth.person.modified`.
- `auth.change_trigger` / `auth.role_change_trigger` — write the `auth.history`
  audit log. They read the `app.user_id` / `app.user_role` Postgres GUCs.

### Audit attribution

Any write that should be attributed to a user must go through
`withAuditContext(event, fn)` ([src/lib/server/audit.ts](src/lib/server/audit.ts)),
which opens a transaction and sets the `app.user_id` / `app.user_role` GUCs that
the audit triggers read. Plain `db.update(...)` outside that helper still works
but records a NULL author.

## Architecture notes

- **SSO** — `/auth/verify` is the endpoint nginx calls via `auth_request`. It
  returns `X-User`, `X-User-Id`, `X-Roles`, and `X-Email` headers so downstream
  apps can authorise without re-verifying the JWT.
- **Application tokens** — devices/services can exchange a shared secret for a
  cookie via `/auth/application?name=<app>` with `Secret: <secret>` header.
  The `/keycodes` endpoint uses the same `auth.application` table via
  `Authorization: Bearer <secret>` for device access.
- **Mail dispatch** — `lib/mail.send()` inserts a row into `mail.entries`; the
  `mail_entry_notify` trigger emits `NOTIFY mail_entries_new`, and the
  in-process worker in [src/lib/server/mail-worker.ts](src/lib/server/mail-worker.ts)
  (started from `hooks.server.ts`) renders the Svelte template and dispatches
  via nodemailer. A catch-up sweep runs on startup so mails enqueued while the
  worker was down still go out.
- **Audit log** — `auth.history` is populated by Postgres triggers (see above)
  and surfaced at `/changes`.
