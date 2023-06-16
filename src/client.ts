import { HoudiniClient } from '$houdini';
import { env } from '$env/dynamic/public';

export default new HoudiniClient({
	url: env.PUBLIC_GRAPHQL_ENDPOINT,
	fetchParams({ session, metadata, variables }) {
		const headers: HeadersInit = {
			Authorization: `Bearer ${metadata?.token || session?.user.token}`
		};

		// set hasura role
		if (variables?.isBoard || metadata?.isBoard) {
			headers['X-Hasura-Role'] = 'board';
		} else if (variables?.isSelf || metadata?.isSelf) {
			headers['X-Hasura-Role'] = 'self';
		}

		return {
			headers
		};
	}
});
