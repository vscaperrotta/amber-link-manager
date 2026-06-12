import { App } from 'obsidian';
import { onAuthStateChanged, Unsubscribe } from '@firebase/auth';
import { auth } from '../firebase';
import {
  loadLinks as localLoadLinks,
  addLink as localAddLink,
  updateLink as localUpdateLink,
  deleteLink as localDeleteLink,
  patchLinkMetadata as localPatchLinkMetadata,
  clearLinks as localClearLinks,
} from '../services/localLinksStorage';
import {
  addLink as fbAddLink,
  updateLink as fbUpdateLink,
  deleteLink as fbDeleteLink,
  patchLinkMetadata as fbPatchLinkMetadata,
  subscribeLinks,
} from './firebaseDb';
import { LinkEntry, Metadata } from '../types/LinkType';
import type MainPlugin from '../main';
import { generateAiDescription } from './openRouter';

export class LinksService {
  links: LinkEntry[] = [];
  loading: boolean = true;

  private app: App;
  private plugin: MainPlugin;
  private onChange: () => void;
  private unsubscribeAuth: Unsubscribe;
  private unsubscribeDb: Unsubscribe | null = null;
  private uid: string | null = null;

  constructor(app: App, plugin: MainPlugin, onChange: () => void) {
    this.app = app;
    this.plugin = plugin;
    this.onChange = onChange;

    this.unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (this.unsubscribeDb) {
        this.unsubscribeDb();
        this.unsubscribeDb = null;
      }

      const prevUid = this.uid;
      this.uid = user?.uid ?? null;
      this.loading = true;
      this.onChange();

      if (user) {
        if (!prevUid) {
          await this._migrateLocalToCloud(user.uid);
        }
        this.unsubscribeDb = subscribeLinks(user.uid, (fbLinks) => {
          this.links = fbLinks;
          this.loading = false;
          this.onChange();
        });
      } else {
        await this._loadLocalLinks();
      }
    });
  }

  private async _loadLocalLinks(): Promise<void> {
    this.links = await localLoadLinks(this.app);
    this.loading = false;
    this.onChange();
  }

  private async _migrateLocalToCloud(uid: string): Promise<void> {
    const localLinks = await localLoadLinks(this.app);
    if (localLinks.length === 0) return;
    for (const link of localLinks) {
      await fbAddLink(uid, { url: link.url, title: link.title, metadata: link.metadata });
    }
    await localClearLinks(this.app);
  }

  async addLink(url: string, title?: string, metadata?: Metadata): Promise<LinkEntry> {
    const resolvedTitle = title || url;
    let entry: LinkEntry;

    if (this.uid) {
      const docRef = await fbAddLink(this.uid, { url, title: resolvedTitle, metadata });
      entry = { id: docRef.id, url, title: resolvedTitle, savedAt: Date.now(), metadata };
    } else {
      entry = await localAddLink(this.app, { url, title: resolvedTitle, metadata });
      await this._loadLocalLinks();
    }

    this._tryGenerateAiDescription(entry);
    return entry;
  }

  private async _tryGenerateAiDescription(link: LinkEntry): Promise<void> {
    const apiKey = this.plugin.openrouterApiKey;
    if (!apiKey) return;
    try {
      const desc = await generateAiDescription({
        url: link.url,
        title: link.title,
        apiKey,
        model: this.plugin.openrouterModel,
      });
      if (desc) {
        await this.patchLinkMetadata(link.id, { aiDescription: desc });
      }
    } catch {
      // silent failure
    }
  }

  async patchLinkMetadata(id: string, patch: Partial<Metadata>): Promise<void> {
    if (this.uid) {
      await fbPatchLinkMetadata(this.uid, id, patch);
    } else {
      await localPatchLinkMetadata(this.app, id, patch);
      await this._loadLocalLinks();
    }
  }

  async updateLink(id: string, updates: Partial<Pick<LinkEntry, 'url' | 'title' | 'metadata'>>): Promise<void> {
    if (this.uid) {
      await fbUpdateLink(this.uid, id, updates);
    } else {
      await localUpdateLink(this.app, id, updates);
      await this._loadLocalLinks();
    }
  }

  async deleteLink(id: string): Promise<void> {
    if (this.uid) {
      await fbDeleteLink(this.uid, id);
    } else {
      await localDeleteLink(this.app, id);
      await this._loadLocalLinks();
    }
  }

  async toggleRead(id: string): Promise<void> {
    const link = this.links.find((l) => l.id === id);
    if (!link) return;
    await this.patchLinkMetadata(id, { isRead: !link.metadata?.isRead });
  }

  async toggleFavorite(id: string): Promise<void> {
    const link = this.links.find((l) => l.id === id);
    if (!link) return;
    await this.patchLinkMetadata(id, { isFavorite: !link.metadata?.isFavorite });
  }

  // ── Tag management ─────────────────────────────────────────────────────────

  async renameTag(oldTag: string, newTag: string): Promise<void> {
    const trimmed = newTag.trim().toUpperCase();
    if (!trimmed || trimmed === oldTag) return;
    const affected = this.links.filter((l) => l.metadata?.tags?.includes(oldTag));
    for (const link of affected) {
      const updated = (link.metadata?.tags ?? []).map((t) => (t === oldTag ? trimmed : t));
      await this.patchLinkMetadata(link.id, { tags: updated });
    }
  }

  async deleteTag(tag: string): Promise<void> {
    const affected = this.links.filter((l) => l.metadata?.tags?.includes(tag));
    for (const link of affected) {
      const updated = (link.metadata?.tags ?? []).filter((t) => t !== tag);
      await this.patchLinkMetadata(link.id, { tags: updated });
    }
  }

  async mergeTag(fromTag: string, toTag: string): Promise<void> {
    const target = toTag.trim().toUpperCase();
    if (!target || target === fromTag) return;
    const affected = this.links.filter((l) => l.metadata?.tags?.includes(fromTag));
    for (const link of affected) {
      const updated = [...new Set((link.metadata?.tags ?? []).map((t) => (t === fromTag ? target : t)))];
      await this.patchLinkMetadata(link.id, { tags: updated });
    }
  }

  // ── Batch AI descriptions ──────────────────────────────────────────────────

  async generateMissingDescriptions(
    onProgress: (done: number, total: number) => void
  ): Promise<number> {
    const apiKey = this.plugin.openrouterApiKey;
    if (!apiKey) return 0;
    const missing = this.links.filter((l) => !l.metadata?.aiDescription);
    let done = 0;
    for (const link of missing) {
      try {
        const desc = await generateAiDescription({
          url: link.url,
          title: link.title,
          apiKey,
          model: this.plugin.openrouterModel,
        });
        if (desc) {
          await this.patchLinkMetadata(link.id, { aiDescription: desc });
          done++;
        }
      } catch {
        // skip
      }
      onProgress(done, missing.length);
    }
    return done;
  }

  destroy(): void {
    this.unsubscribeAuth();
    if (this.unsubscribeDb) {
      this.unsubscribeDb();
      this.unsubscribeDb = null;
    }
  }
}
