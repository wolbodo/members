import { HoudiniClient } from '$houdini';

const url = 'http://graphql.wolbodo/v1/graphql';

export default new HoudiniClient({
	url,
	fetchParams({ session, metadata, variables }) {
		console.log('variables', variables);
		const role = variables.isBoard ? 'board' : variables.isSelf && 'self';
		return {
			headers: {
				Authorization: `Bearer ${session.user ? session.user.token : metadata.token}`,
				...(role && {
					'X-Hasura-Role': role
				})
			}
		};
	}
});
