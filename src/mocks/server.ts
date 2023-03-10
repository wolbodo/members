import { setupServer, type SetupServer } from 'msw/node';
import { handlers } from './handlers';
import { browser, dev } from '$app/environment';
import { PUBLIC_DOCKER } from '$env/static/public'

let worker: SetupServer | null;
if (!browser && dev && !PUBLIC_DOCKER) {
	worker = setupServer(...handlers);
} else {
	worker = null;
}

export { worker };
