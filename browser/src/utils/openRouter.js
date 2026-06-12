import Browser from 'webextension-polyfill';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const KEY_STORAGE = 'openrouterApiKey';
const MODEL_STORAGE = 'openrouterModel';

export const DEFAULT_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';

export const FREE_MODELS = [
	'meta-llama/llama-3.2-3b-instruct:free',
	'meta-llama/llama-3.2-1b-instruct:free',
	'google/gemma-2-9b-it:free',
	'google/gemma-3-4b-it:free',
	'mistralai/mistral-7b-instruct:free',
	'qwen/qwen-2-7b-instruct:free',
	'microsoft/phi-3-mini-128k-instruct:free',
];

export async function getOpenRouterApiKey() {
	const result = await Browser.storage.local.get(KEY_STORAGE);
	return result[KEY_STORAGE] ?? null;
}

export async function setOpenRouterApiKey(key) {
	const trimmed = key?.trim() ?? '';
	if (!trimmed) {
		await Browser.storage.local.remove(KEY_STORAGE);
	} else {
		await Browser.storage.local.set({ [KEY_STORAGE]: trimmed });
	}
}

export async function getOpenRouterModel() {
	const result = await Browser.storage.local.get(MODEL_STORAGE);
	return result[MODEL_STORAGE] ?? DEFAULT_MODEL;
}

export async function setOpenRouterModel(model) {
	const trimmed = model?.trim() ?? '';
	if (!trimmed || trimmed === DEFAULT_MODEL) {
		await Browser.storage.local.remove(MODEL_STORAGE);
	} else {
		await Browser.storage.local.set({ [MODEL_STORAGE]: trimmed });
	}
}

function stripHtml(html) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '')
		.replace(/<nav[\s\S]*?<\/nav>/gi, '')
		.replace(/<header[\s\S]*?<\/header>/gi, '')
		.replace(/<footer[\s\S]*?<\/footer>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&[a-zA-Z#0-9]+;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 3000);
}

export async function generateAiDescription({ url, title, html, apiKey, model }) {
	const pageText = stripHtml(html);
	const usedModel = model || DEFAULT_MODEL;
	const prompt = `Generate a concise 1-2 sentence description of this webpage for a bookmarking app. Be informative and specific. Reply with only the description, no quotes or preamble.\n\nTitle: ${title || url}\nURL: ${url}${pageText ? `\n\nContent excerpt:\n${pageText}` : ''}`;

	const res = await fetch(OPENROUTER_URL, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			'HTTP-Referer': 'https://amber.voidpocket.app',
			'X-Title': 'Amber',
		},
		body: JSON.stringify({
			model: usedModel,
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 150,
			temperature: 0.3,
		}),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`OpenRouter ${res.status}: ${text}`);
	}

	const data = await res.json();
	return data.choices?.[0]?.message?.content?.trim() ?? null;
}
