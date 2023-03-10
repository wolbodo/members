import type { LayoutServerLoad } from './$types';
import { worker as browserWorker } from '../mocks/browser';

export const load = (({}) => {
	browserWorker?.start();
	return {};
}) satisfies LayoutServerLoad;
