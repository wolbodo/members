import { setupWorker, type SetupWorker } from 'msw';
import { handlers } from './handlers';
import { browser, dev } from '$app/environment';
import { PUBLIC_DOCKER } from '$env/static/public'

let worker: SetupWorker | null;

if (browser && dev && !PUBLIC_DOCKER) {
	worker = setupWorker(...handlers);
} else {
	worker = null;
}

export { worker };
