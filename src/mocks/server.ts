import { setupServer, type SetupServer } from 'msw/node';
import { handlers } from './handlers';
import { browser, dev } from '$app/environment';
import { env } from '$env/dynamic/public'

let worker: SetupServer | null;
if (!browser && dev && !env.PUBLIC_DOCKER) {
	worker = setupServer(...handlers);
} else {
	worker = null;
}

export { worker };
