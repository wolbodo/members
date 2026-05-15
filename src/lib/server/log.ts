import { dev } from '$app/environment';

const fmt = (lvl: string, msg: string, meta?: object): string => {
	const t = new Date().toISOString();
	const extra = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
	return `${t} ${lvl} ${msg}${extra}`;
};

const serializeErr = (m?: object): object | undefined => {
	if (!m) return m;
	const x = m as Record<string, unknown>;
	if (x.err instanceof Error) x.err = { message: x.err.message, stack: x.err.stack };
	return x;
};

export const info = (msg: string, meta?: object) =>
	console.log(fmt('INF', msg, serializeErr(meta)));
export const warn = (msg: string, meta?: object) =>
	console.warn(fmt('WRN', msg, serializeErr(meta)));
export const error = (msg: string, meta?: object) =>
	console.error(fmt('ERR', msg, serializeErr(meta)));
export const debug = (msg: string, meta?: object) => {
	if (dev) console.log(fmt('DBG', msg, serializeErr(meta)));
};
