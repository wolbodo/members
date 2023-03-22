import { setupWorker, type SetupWorker } from 'msw';
import { handlers } from './handlers';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public'

let worker: SetupWorker | null;

if (browser && env.PUBLIC_MOCKED === 'true') {
	worker = setupWorker(...handlers);
} else {
	worker = null;
}

export { worker };
