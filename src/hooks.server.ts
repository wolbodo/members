import type { Handle, RequestEvent, HandleFetch } from '@sveltejs/kit';
import { redirect, error as httpError } from '@sveltejs/kit';
import { dev } from '$app/environment';

import { verifyToken } from '$lib/jwt';
import { startMailWorker } from '$lib/server/mail-worker';
import { debug, warn, error } from '$lib/server/log';

void startMailWorker().catch((err) => error('mail-worker: failed to start', { err }));

const PUBLIC_ROUTES = new Set(['/keycodes']);
const isPublic = (id: string | null | undefined): boolean =>
	!!id && (PUBLIC_ROUTES.has(id) || id.startsWith('/auth'));

const ALLOWED_HOST = 'wolbodo.nl';
const isAllowedOrigin = (origin: string): boolean => {
	let url: URL;
	try {
		url = new URL(origin);
	} catch {
		return false;
	}
	if (dev && url.hostname === 'localhost')
		return url.protocol === 'http:' || url.protocol === 'https:';
	if (url.protocol !== 'https:') return false;
	return url.host === ALLOWED_HOST || url.host.endsWith(`.${ALLOWED_HOST}`);
};

// Rate limit auth surfaces: 10 attempts / minute / IP.
const RATE_LIMITED = new Set(['/auth/login', '/auth/forgot', '/auth/reset', '/auth/application']);
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 10;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const rateLimit = (ip: string): boolean => {
	const now = Date.now();
	const bucket = rateBuckets.get(ip);
	if (!bucket || bucket.resetAt < now) {
		rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
		return true;
	}
	bucket.count += 1;
	return bucket.count <= RATE_LIMIT;
};

const authenticateUser = async (event: RequestEvent) => {
	const token = event.cookies.get('token');
	if (!token) return null;
	try {
		const user = await verifyToken(token);
		return { ...user, token };
	} catch {
		return null;
	}
};

export const handle: Handle = async ({ event, resolve }) => {
	if (event.route.id && RATE_LIMITED.has(event.route.id)) {
		const ip = event.getClientAddress();
		if (!rateLimit(ip)) {
			warn('http: rate limited', { ip, route: event.route.id });
			return httpError(429, 'Too many requests');
		}
	}

	const user = await authenticateUser(event);

	if (!user) {
		if (!isPublic(event.route.id)) {
			debug('http: unauth redirect', { route: event.route.id });
			return redirect(302, '/auth/login');
		}
	} else {
		if (event.route.id === '/auth/login') {
			return redirect(302, '/');
		}
		event.locals.user = user;
	}

	const response = await resolve(event);

	const originHeader = event.request.headers.get('origin');
	if (originHeader && isAllowedOrigin(originHeader)) {
		response.headers.append('Access-Control-Allow-Origin', originHeader);
		response.headers.append('Access-Control-Allow-Credentials', 'true');
	}

	// Vite HMR injects inline scripts and uses eval; relax script-src in dev only.
	response.headers.set(
		'Content-Security-Policy',
		`default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; script-src 'self' ${
			dev ? "'unsafe-inline' 'unsafe-eval'" : ''
		}; base-uri 'self'; frame-ancestors 'none'`
	);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	if (!dev) {
		response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
	}

	return response;
};

export const handleFetch = (async ({ request, fetch }) => {
	try {
		return await fetch(request);
	} catch (err) {
		error('http: fetch failed', { url: request.url, method: request.method, err });
		throw err;
	}
}) satisfies HandleFetch;
