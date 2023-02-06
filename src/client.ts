import { HoudiniClient } from '$houdini';

const url = 'http://graphql.wolbodo/v1/graphql';

export default new HoudiniClient({
	url,
	fetchParams({ session, metadata }) {
		return {
			headers: {
				Authorization: `Bearer ${session.user ? session.user.token : metadata.token}`
			}
		};
	}
});
