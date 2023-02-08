/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		user: {
			email: string;
			name: string;
			id: string;
			roles: string[];
			iat: number;
			exp: number;
			iss: string;
			sub: string;
			token: string;
		};
	}

	// interface Platform {}

	// interface Session {}

	// interface Stuff {}
}
