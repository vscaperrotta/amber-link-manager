import { t } from '../utils/i18n';

export type TabId = 'grid' | 'list' | 'tags' | 'favorites';

const TABS: { id: TabId; key: string }[] = [
  { id: 'grid', key: 'tabs.grid' },
  { id: 'list', key: 'tabs.list' },
  { id: 'tags', key: 'tabs.tags' },
  { id: 'favorites', key: 'tabs.favorites' },
];

export default function renderLinksTabBar(
  container: HTMLElement,
  initialTab: TabId,
  onTabChange: (tab: TabId) => void
): HTMLElement {
  const nav = container.createEl('nav', { cls: 'obs-amber-tab-bar' });

  const buttons: Map<TabId, HTMLElement> = new Map();

  TABS.forEach(({ id, key }) => {
    const btn = nav.createEl('button', {
      text: t(key),
      cls: `obs-amber-tab-btn${id === initialTab ? ' is-active' : ''}`,
    });
    buttons.set(id, btn);

    btn.addEventListener('click', () => {
      buttons.forEach((b, bId) => b.toggleClass('is-active', bId === id));
      onTabChange(id);
    });
  });

  return nav;
}
