const NOISE_SELECTORS = 'nav, footer, header, aside, script, style, noscript, [role="banner"], [role="navigation"], [role="complementary"]';

/**
 * Estrae il testo principale da un Document, rimuovendo elementi di navigazione e rumore.
 * Funziona sia con il DOM live del content script che con un Document DOMParser del background.
 *
 * @param {Document} doc
 * @returns {string} Testo pulito, troncato a 5000 caratteri
 */
export function extractBodyText(doc) {
	if (!doc?.body) return '';

	const clone = doc.body.cloneNode(true);
	clone.querySelectorAll(NOISE_SELECTORS).forEach(el => el.remove());

	// Preferisce il contenuto semantico principale se presente
	const main = clone.querySelector('article, main, [role="main"]');
	const source = main || clone;

	return (source.innerText ?? source.textContent ?? '').trim().slice(0, 5000);
}
