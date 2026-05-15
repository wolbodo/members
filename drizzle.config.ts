import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	migrations: { table: '__drizzle_migrations' },
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
});
