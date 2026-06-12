import { App, TFile } from 'obsidian';
import { LinkEntry, Metadata } from '../types/LinkType';
import { FOLDER } from '../constants';

const LINKS_FILENAME = 'links.json';

function getLinksPath(): string {
  return `${FOLDER}/${LINKS_FILENAME}`;
}

async function ensureFolder(app: App): Promise<void> {
  if (!app.vault.getAbstractFileByPath(FOLDER)) {
    await app.vault.createFolder(FOLDER);
  }
}

export async function loadLinks(app: App): Promise<LinkEntry[]> {
  const path = getLinksPath();
  const file = app.vault.getAbstractFileByPath(path);
  if (!file || !(file instanceof TFile)) return [];

  try {
    const raw = await app.vault.read(file);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LinkEntry[];
  } catch {
    console.error('[localLinksStorage] Failed to parse links.json');
    return [];
  }
}

async function saveLinks(app: App, links: LinkEntry[]): Promise<void> {
  await ensureFolder(app);
  const path = getLinksPath();
  const file = app.vault.getAbstractFileByPath(path);
  const content = JSON.stringify(links, null, 2);

  if (file && file instanceof TFile) {
    await app.vault.modify(file, content);
  } else {
    await app.vault.create(path, content);
  }
}

export async function addLink(
  app: App,
  { url, title, metadata }: Pick<LinkEntry, 'url' | 'title'> & { metadata?: Metadata }
): Promise<LinkEntry> {
  const links = await loadLinks(app);
  const entry: LinkEntry = {
    id: Math.random().toString(36).substring(2) + Date.now().toString(36),
    url,
    title,
    savedAt: Date.now(),
    ...(metadata ? { metadata } : {}),
  };
  links.unshift(entry);
  await saveLinks(app, links);
  return entry;
}

export async function updateLink(
  app: App,
  id: string,
  updates: Partial<Pick<LinkEntry, 'url' | 'title' | 'metadata'>>
): Promise<void> {
  const links = await loadLinks(app);
  const idx = links.findIndex((l) => l.id === id);
  if (idx === -1) return;
  const { metadata, ...rest } = updates;
  links[idx] = {
    ...links[idx],
    ...rest,
    ...(metadata !== undefined ? { metadata: { ...links[idx].metadata, ...metadata } } : {}),
    updatedAt: Date.now(),
  };
  await saveLinks(app, links);
}

export async function deleteLink(app: App, id: string): Promise<void> {
  const links = await loadLinks(app);
  const filtered = links.filter((l) => l.id !== id);
  await saveLinks(app, filtered);
}

export async function patchLinkMetadata(app: App, id: string, patch: Partial<Metadata>): Promise<void> {
  const links = await loadLinks(app);
  const idx = links.findIndex((l) => l.id === id);
  if (idx === -1) return;
  links[idx] = {
    ...links[idx],
    metadata: { ...links[idx].metadata, ...patch },
    updatedAt: Date.now(),
  };
  await saveLinks(app, links);
}

export async function clearLinks(app: App): Promise<void> {
  await saveLinks(app, []);
}
