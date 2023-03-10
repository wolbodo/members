import { setupWorker, type SetupWorker } from 'msw';
import { handlers } from './handlers';
import { browser, dev } from '$app/environment';
import { env } from '$env/dynamic/public'

let worker: SetupWorker | null;

if (browser && dev && !env.PUBLIC_DOCKER) {
	worker = setupWorker(...handlers);
} else {
	worker = null;
}

export { worker };
