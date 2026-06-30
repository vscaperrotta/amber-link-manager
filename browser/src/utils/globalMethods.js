import Browser from 'webextension-polyfill';

export function goToSettings() {
	const url = Browser.runtime.getURL('src/options/index.html');
	Browser.tabs.create({ url });
}
