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
pnpm db:push                                            # Drizzle schema
psql "$DATABASE_URL" -f migrations/0001_mail_notify.sql # Mail notify trigger
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
pnpm db:push           # Apply schema.ts to the database
pnpm db:studio         # Drizzle Studio
```

## Architecture notes

- **SSO** — `/auth/verify` is the endpoint nginx calls via `auth_request`. It
  returns `X-User`, `X-User-Id`, `X-Roles`, and `X-Email` headers so downstream
  apps can authorise without re-verifying the JWT.
- **Application tokens** — devices/services can exchange a shared secret for a
  cookie via `/auth/application?name=<app>` with `Secret: <secret>` header.
  The `/keycodes` endpoint uses the same `application` table via
  `Authorization: Bearer <secret>` for device access.
- **Mail dispatch** — `lib/mail.send()` inserts a row into `mail.entries`; a
  Postgres trigger emits `NOTIFY mail_entries_new`, and the in-process worker
  in [src/lib/server/mail-worker.ts](src/lib/server/mail-worker.ts) (started
  from `hooks.server.ts`) renders the Svelte template and dispatches via
  nodemailer. A catch-up sweep runs on startup so mails enqueued while the
  worker was down still go out.
- **Audit log** — `auth.history` is populated by a Postgres trigger (separate
  from this repo's schema management) and surfaced at `/changes`.
