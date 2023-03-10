import { setupServer, type SetupServer } from 'msw/node';
import { handlers } from './handlers';
import { browser } from '$app/environment';
import { PUBLIC_MOCKED } from '$env/static/public'

let worker: SetupServer | null;

if (!browser && PUBLIC_MOCKED === 'true') {
	worker = setupServer(...handlers);
} else {
	worker = null;
}

export { worker };
