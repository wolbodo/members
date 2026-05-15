const ALLOWED_HOST = 'wolbodo.nl';

export const safeRedirect = (raw: string | null | undefined, fallback = '/'): string => {
	if (!raw) return fallback;

	if (raw.startsWith('/') && !raw.startsWith('//')) return raw;

	let url: URL;
	try {
		url = new URL(raw);
	} catch {
		return fallback;
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') return fallback;

	const host = url.host;
	if (host === ALLOWED_HOST || host.endsWith(`.${ALLOWED_HOST}`)) return raw;

	return fallback;
};
