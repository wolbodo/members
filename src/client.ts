import { HoudiniClient } from '$houdini';

const url = 'http://graphql.wolbodo/v1/graphql';

export default new HoudiniClient({
	url,
	fetchParams({ session, metadata, variables }) {
		const headers: HeadersInit = {
			Authorization: `Bearer ${session?.user ? session?.user.token : metadata?.token}`
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
