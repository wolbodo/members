# Members

Wolbodo members-management app. SvelteKit + Houdini over Hasura + Postgres.

## Stack

- Node 22, pnpm 11 (via corepack)
- SvelteKit + Svelte 4 (frontend)
- Houdini (GraphQL client)
- Hasura v2 (GraphQL over Postgres)
- Postgres 15
- oxlint + oxfmt (linter + formatter)

## Local development

### Prerequisites

1. Enable corepack and install pnpm 11:

   ```sh
   corepack enable
   corepack prepare pnpm@11 --activate
   ```

2. Copy `.env.template` to `.env` and fill in the values.
   - `AUTH_JWT_SECRET.key` must be at least 32 characters.

3. Create the shared Docker network once:
   ```sh
   docker network create wolbodo
   ```

### Start the backend

```sh
docker compose up -d db graphql
```

Hasura console: http://localhost:8080/console

### Run the app

```sh
pnpm install
pnpm dev
```

## Commands

```sh
pnpm dev             # start dev server
pnpm build           # production build
pnpm preview         # preview production build
pnpm check           # svelte-check + tsc
pnpm lint            # oxlint + oxfmt --check
pnpm format          # oxfmt --write
pnpm test            # Playwright e2e tests
pnpm test:unit       # Vitest unit tests

pnpm exec hasura metadata apply   # apply Hasura metadata
pnpm exec houdini generate        # regenerate Houdini stores from schema
```

> **Note:** oxlint does not parse `.svelte` files. Svelte-specific checks are
> covered by `svelte-check` (run via `pnpm check`).
