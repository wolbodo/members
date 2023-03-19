import { serverToken } from '$lib/jwt';
import { SendMailStore } from '$houdini';
import type { RequestEvent } from '@sveltejs/kit';

export { default as templates } from './templates';

const store = new SendMailStore();

export const send = async (event: RequestEvent, personId, template, data) => {
	await store.mutate({
		personId,
		template,
		data
	}, {
		event,
		metadata: { token: serverToken('send-mail') }
	});
};
