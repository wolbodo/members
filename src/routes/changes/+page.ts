import { load_History } from '$houdini';

export const csr = false;

/* @type { import('./$houdini').PageLoad } */
export const load = async (event) => {
	return {
		...(await load_History({ event, metadata: { isBoard: true } }))
	};
};
