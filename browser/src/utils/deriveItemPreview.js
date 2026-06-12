/**
 * Deriva la preview di un link salvato con fallback chain robusto.
 * Pattern adattato da deriveItemData() del REFERENCE (extension-save-to-pocket/src/common/helpers.js).
 *
 * @param {{ url: string, title: string, metadata?: object }} entry
 * @returns {{ title: string|null, thumbnail: string|null, publisher: string|null, author: string|null, readingTime: number }}
 */
export function deriveItemPreview({ url, title, metadata } = {}) {
	return {
		title:       deriveTitle({ url, title, metadata }),
		thumbnail:   metadata?.thumbnail    || null,
		publisher:   derivePublisher({ url, metadata }),
		author:      metadata?.author       || null,
		readingTime: metadata?.readingTime  || 0,
	};
}

function deriveTitle({ url, title, metadata }) {
	return (
		title                      ||
		metadata?.siteName         ||
		hostnameFor(url)           ||
		null
	);
}

function derivePublisher({ url, metadata }) {
	return (
		metadata?.siteName  ||
		hostnameFor(url)    ||
		null
	);
}

function hostnameFor(url) {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return null;
	}
}
