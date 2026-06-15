import fs from 'fs-extra';
import path from 'path';

export async function getManifest() {
  const pkg = await fs.readJSON(path.resolve('package.json'));

  const manifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_popup: "src/popup/index.html",
      default_icon: {
        16: "icons/icon16.png",
        32: "icons/icon32.png",
        48: "icons/icon48.png",
        128: "icons/icon128.png"
      }
    },
    icons: {
      16: "icons/icon16.png",
      32: "icons/icon32.png",
      48: "icons/icon48.png",
      128: "icons/icon128.png"
    },
    permissions: [
      'storage',
      'tabs',
      'activeTab',
      "cookies",
    ],
    host_permissions: [
      "<all_urls>"
    ],
    background: {
      "service_worker": "assets/background.js",
      "type": "module"
    },
    content_scripts: [
      {
        matches: [
          "<all_urls>"
        ],
        match_origin_as_fallback: true,
        run_at: 'document_idle',
        js: ['assets/content.js'],
        type: 'module',
      }
    ],
    chrome_url_overrides: {
      newtab: 'src/newtab/index.html'
    },
    options_ui: {
      page: "src/options/index.html",
      open_in_tab: true
    },
    content_security_policy: {
      extension_pages: [
        "script-src 'self'",
        "object-src 'self'",
        "connect-src https: wss: http://localhost:*",
      ].join('; ')
    }
  }

  return manifest
}
