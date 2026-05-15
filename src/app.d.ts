// See https://svelte.dev/docs/kit/types#app.d.ts
declare namespace App {
	interface Locals {
		user: {
			email?: string;
			name: string;
			id: string;
			roles: string[];
			pwh?: string;
			iat: number;
			exp: number;
			iss: string;
			sub: string;
			token: string;
		} | null;
	}
}
