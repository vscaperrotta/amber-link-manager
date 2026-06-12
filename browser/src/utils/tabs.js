const chromeTabsAvailable = typeof chrome !== 'undefined' && !!chrome.tabs;

const INTERNAL_PROTOCOLS = ['chrome:', 'edge:', 'about:', 'moz-extension:', 'chrome-extension:'];

export function isInternalUrl(url) {
  if (!url) return true;
  try {
    return INTERNAL_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return true;
  }
}

export async function getCurrentTab() {
  console.log('[tabs] chromeTabsAvailable:', chromeTabsAvailable);
  if (!chromeTabsAvailable) {
    console.warn('[tabs] chrome.tabs not available — returning empty tab');
    return { url: '', title: '' };
  }
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      console.log('[tabs] query result:', tabs);
      const tab = tabs[0];
      if (!tab) {
        console.warn('[tabs] no active tab found');
        return resolve({ url: '', title: '', id: null });
      }
      console.log('[tabs] resolved tab — id:', tab.id, 'url:', tab.url);
      resolve({ url: tab.url || '', title: tab.title || '', id: tab.id ?? null });
    });
  });
}
