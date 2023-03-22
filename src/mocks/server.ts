import { setupServer, type SetupServer } from 'msw/node';
import { handlers } from './handlers';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public'

let worker: SetupServer | null;

if (!browser && env.PUBLIC_MOCKED === 'true') {
	worker = setupServer(...handlers);
} else {
	worker = null;
}

export { worker };
