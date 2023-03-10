import { setupWorker, type SetupWorker } from 'msw';
import { handlers } from './handlers';
import { browser } from '$app/environment';
import { PUBLIC_MOCKED } from '$env/static/public'

let worker: SetupWorker | null;

if (browser && PUBLIC_MOCKED === 'true') {
	worker = setupWorker(...handlers);
} else {
	worker = null;
}

export { worker };
