const TRACKING_PARAMS = [
	'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
	'fbclid', 'gclid', 'igshid', 'si', 'ref',
];

/**
 * Normalizes a URL for duplicate comparison: strips www., trailing slash,
 * and known tracking query params, lowercases the result. Not for display —
 * comparison only.
 */
export function normalizeUrl(rawUrl) {
	try {
		const u = new URL(rawUrl);
		const host = u.hostname.replace(/^www\./, '');
		const path = u.pathname.replace(/\/+$/, '') || '/';
		const params = new URLSearchParams(u.search);
		TRACKING_PARAMS.forEach((p) => params.delete(p));
		const sorted = new URLSearchParams([...params.entries()].sort());
		const query = sorted.toString();
		return `${host}${path}${query ? `?${query}` : ''}`.toLowerCase();
	} catch {
		return (rawUrl || '').trim().toLowerCase();
	}
}
