import * as d3 from 'd3';
import { setIcon } from 'obsidian';
import { LinkEntry } from '../types/LinkType';
import MainPlugin from '../main';
import { t } from '../utils/i18n';

// ── Types ──────────────────────────────────────────────────────────────────

export type GraphPhysicsSettings = {
  chargeStrength: number;
  linkDistance: number;
  velocityDecay: number;
  alphaDecay: number;
  centerStrength: number;
};

const PHYSICS_DEFAULTS: GraphPhysicsSettings = {
  chargeStrength: -250,
  linkDistance: 135,
  velocityDecay: 0.3,
  alphaDecay: 0.02,
  centerStrength: 0.9,
};

const TAG_COLORS = [
  '#F28B8B', '#FFB570', '#FFE066', '#8FD694',
  '#6FCF97', '#74C0FC', '#91A7FF', '#C77DFF',
  '#E599F7', '#B0B0B0',
];

const LINK_NODE_RADIUS = 8;
const TAG_NODE_RADIUS = 16;

type GraphNode = {
  id: string;
  type: 'link' | 'tag';
  label: string;
  url?: string;
  tags: string[];
  // D3 simulation datum fields (managed by D3 at runtime)
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

type GraphEdge = {
  source: string | GraphNode;
  target: string | GraphNode;
  index?: number;
};

// ── Main class ─────────────────────────────────────────────────────────────

export class LinksChart {
  private container: HTMLElement;
  private plugin: MainPlugin;

  private svgEl: SVGSVGElement | null = null;
  private tooltipEl: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private optionsPanelEl: HTMLElement | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private simulation: any | null = null;
  private resizeObserver: ResizeObserver | null = null;

  private currentLinks: LinkEntry[] = [];
  private searchQuery = '';
  private physics: GraphPhysicsSettings;
  private showOptionsPanel = false;
  private tagColorMap = new Map<string, string>();
  private customColors: Record<string, string> = {};

  constructor(container: HTMLElement, plugin: MainPlugin) {
    this.container = container;
    this.plugin = plugin;
    this.physics = plugin.graphPhysics ? { ...plugin.graphPhysics } : { ...PHYSICS_DEFAULTS };
    this.customColors = plugin.graphColors ? { ...plugin.graphColors } : {};
  }

  render(links: LinkEntry[]): void {
    this.currentLinks = links;
    this._populateTagColorMap();
    this.simulation?.stop();
    this.resizeObserver?.disconnect();
    this.container.empty();
    this._buildDOM();
    this._updateGraph();
  }

  private _populateTagColorMap(): void {
    const tags = new Set(this.currentLinks.flatMap(l => l.metadata?.tags ?? []));
    tags.forEach(tag => this._getTagColor(tag));
  }

  destroy(): void {
    this.simulation?.stop();
    this.simulation = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  // ── DOM Construction ─────────────────────────────────────────────────────

  private _buildDOM(): void {
    const wrapper = this.container.createDiv({ cls: 'obs-amber-graph-wrapper' });

    this._buildSearchBar(wrapper);
    this._buildOptionsToggleBtn(wrapper);

    this.optionsPanelEl = wrapper.createDiv({
      cls: 'obs-amber-graph-options-panel' +
        (this.showOptionsPanel ? '' : ' obs-amber-graph-options-panel--hidden'),
    });
    this._renderOptionsPanel(this.optionsPanelEl);

    const svgContainer = wrapper.createDiv({ cls: 'obs-amber-graph-svg-container' });
    this.svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
    this.svgEl.classList.add('obs-amber-graph-svg');
    svgContainer.appendChild(this.svgEl);

    this.tooltipEl = wrapper.createDiv({ cls: 'obs-amber-graph-tooltip obs-amber-graph-tooltip--hidden' });

    this.resizeObserver = new ResizeObserver(() => this._updateGraph());
    this.resizeObserver.observe(svgContainer);
  }

  private _buildSearchBar(wrapper: HTMLElement): void {
    const input = wrapper.createEl('input', {
      cls: 'obs-amber-graph-search',
    }) as HTMLInputElement;
    input.type = 'text';
    input.placeholder = t('graph.searchPlaceholder');
    input.value = this.searchQuery;
    input.addEventListener('input', () => {
      this.searchQuery = input.value;
      this._updateGraph();
    });
    this.searchInput = input;
  }

  private _buildOptionsToggleBtn(wrapper: HTMLElement): void {
    const btn = wrapper.createEl('button', {
      cls: 'obs-amber-graph-options-toggle',
      title: t('graph.optionsTitle'),
    });
    setIcon(btn, 'sliders-horizontal');
    if (this.showOptionsPanel) btn.addClass('is-active');
    btn.addEventListener('click', () => {
      this.showOptionsPanel = !this.showOptionsPanel;
      btn.toggleClass('is-active', this.showOptionsPanel);
      this.optionsPanelEl?.toggleClass('obs-amber-graph-options-panel--hidden', !this.showOptionsPanel);
    });
  }

  private _renderOptionsPanel(panel: HTMLElement): void {
    panel.empty();
    const body = panel.createDiv({ cls: 'obs-amber-graph-panel-body' });

    // ── Physics section ────────────────────────────────────────────────────
    const physicsHeader = body.createDiv({ cls: 'obs-amber-graph-panel-header' });
    physicsHeader.createSpan({ text: t('graph.physics'), cls: 'obs-amber-graph-panel-title' });
    const physicsReset = physicsHeader.createEl('button', {
      text: t('graph.resetPhysics'),
      cls: 'obs-amber-graph-panel-reset',
    });
    physicsReset.addEventListener('click', () => {
      this.physics = { ...PHYSICS_DEFAULTS };
      this.plugin.setGraphPhysics(this.physics);
      this._applyPhysicsToSimulation();
      if (this.optionsPanelEl) this._renderOptionsPanel(this.optionsPanelEl);
    });

    const slidersContainer = body.createDiv({ cls: 'obs-amber-graph-panel-sliders' });
    const sliders: Array<{
      key: keyof GraphPhysicsSettings;
      label: string;
      min: number;
      max: number;
      step: number;
    }> = [
      { key: 'chargeStrength', label: t('graph.slider.chargeStrength'), min: -500, max: -10, step: 10 },
      { key: 'linkDistance',   label: t('graph.slider.linkDistance'),   min: 20,   max: 300, step: 5  },
      { key: 'velocityDecay',  label: t('graph.slider.velocityDecay'),  min: 0.1,  max: 0.9, step: 0.05 },
      { key: 'alphaDecay',     label: t('graph.slider.alphaDecay'),     min: 0.01, max: 0.1, step: 0.005 },
      { key: 'centerStrength', label: t('graph.slider.centerStrength'), min: 0.0,  max: 2.0, step: 0.1 },
    ];
    sliders.forEach(({ key, label, min, max, step }) => {
      const row = slidersContainer.createDiv({ cls: 'obs-amber-graph-slider-row' });
      row.createEl('label', { text: label, cls: 'obs-amber-graph-slider-label' });
      const valueEl = row.createSpan({ text: String(this.physics[key]), cls: 'obs-amber-graph-slider-value' });
      const input = row.createEl('input', { cls: 'obs-amber-graph-slider' }) as HTMLInputElement;
      input.type = 'range';
      input.min = String(min);
      input.max = String(max);
      input.step = String(step);
      input.value = String(this.physics[key]);
      input.addEventListener('input', () => {
        const parsed = parseFloat(input.value);
        this.physics = { ...this.physics, [key]: parsed };
        valueEl.textContent = String(parsed);
        this._applyPhysicsToSimulation();
        this.plugin.setGraphPhysics(this.physics);
      });
    });

    // ── Divider ────────────────────────────────────────────────────────────
    body.createDiv({ cls: 'obs-amber-graph-panel-divider' });

    // ── Colors section ─────────────────────────────────────────────────────
    const colorsHeader = body.createDiv({ cls: 'obs-amber-graph-panel-header' });
    colorsHeader.createSpan({ text: t('graph.nodeColors'), cls: 'obs-amber-graph-panel-title' });
    const colorsReset = colorsHeader.createEl('button', {
      text: t('graph.resetColors'),
      cls: 'obs-amber-graph-panel-reset',
    });
    colorsReset.addEventListener('click', () => {
      this.customColors = {};
      this.plugin.setGraphColors({});
      this._refreshNodeColors();
      if (this.optionsPanelEl) this._renderOptionsPanel(this.optionsPanelEl);
    });

    const colorsList = body.createDiv({ cls: 'obs-amber-graph-panel-colors-list' });
    const tags = [...this.tagColorMap.keys()].sort();

    if (tags.length === 0) {
      colorsList.createEl('p', {
        text: t('graph.noTags'),
        cls: 'obs-amber-graph-panel-empty',
      });
    } else {
      tags.forEach(tag => {
        const row = colorsList.createDiv({ cls: 'obs-amber-graph-panel-row' });
        row.createSpan({ text: tag || t('graph.untagged'), cls: 'obs-amber-graph-panel-tag-name' });
        const colorInput = row.createEl('input', {
          cls: 'obs-amber-graph-panel-color-input',
        }) as HTMLInputElement;
        colorInput.type = 'color';
        colorInput.value = this._getTagColor(tag);
        colorInput.addEventListener('input', () => {
          this.customColors[tag] = colorInput.value;
          this.plugin.setGraphColors({ ...this.customColors });
          this._refreshNodeColors();
        });
      });
    }
  }

  // ── Graph Data ───────────────────────────────────────────────────────────

  private _buildGraphData(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const q = this.searchQuery.trim().toLowerCase();

    const linkNodes: GraphNode[] = this.currentLinks.map(l => ({
      id: l.id,
      type: 'link',
      label: l.title || l.url,
      url: l.url,
      tags: l.metadata?.tags ?? [],
    }));

    const tagSet = new Set(linkNodes.flatMap(n => n.tags));
    let tagNodes: GraphNode[] = [...tagSet].map(tag => ({
      id: `tag::${tag}`,
      type: 'tag',
      label: tag,
      tags: [],
    }));

    if (q) {
      tagNodes = tagNodes.filter(n => n.label.toLowerCase().includes(q));
      const matchingLinks = linkNodes.filter(n =>
        n.label.toLowerCase().includes(q) || (n.url ?? '').toLowerCase().includes(q)
      );
      const visibleTagIds = new Set(tagNodes.map(n => n.id));
      const edges: GraphEdge[] = matchingLinks.flatMap(n =>
        n.tags
          .filter(tag => visibleTagIds.has(`tag::${tag}`))
          .map(tag => ({ source: n.id, target: `tag::${tag}` }))
      );
      const nodesInEdges = new Set(edges.flatMap(e => [e.source as string, e.target as string]));
      const filteredLinks = matchingLinks.filter(n => nodesInEdges.has(n.id) || tagNodes.length === 0);
      return { nodes: [...filteredLinks, ...tagNodes], edges };
    }

    const nodes = [...linkNodes, ...tagNodes];
    const edges: GraphEdge[] = linkNodes.flatMap(n =>
      n.tags.map(tag => ({ source: n.id, target: `tag::${tag}` }))
    );
    return { nodes, edges };
  }

  // ── D3 Rendering ─────────────────────────────────────────────────────────

  private _updateGraph(): void {
    if (!this.svgEl) return;

    if (this.currentLinks.length === 0) {
      this._renderEmptyState();
      return;
    }

    const { nodes, edges } = this._buildGraphData();

    this.simulation?.stop();

    const svgContainer = this.svgEl.parentElement!;
    const width = svgContainer.clientWidth || 800;
    const height = svgContainer.clientHeight || 600;

    const svg = d3.select(this.svgEl)
      .attr('width', width)
      .attr('height', height);
    svg.selectAll('*').remove();

    if (nodes.length === 0) {
      svg.append('text')
        .attr('x', width / 2).attr('y', height / 2)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('class', 'obs-amber-graph-empty-text')
        .text(t('graph.noSearchResults'));
      return;
    }

    const g = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on('zoom', (event: { transform: string }) => g.attr('transform', event.transform));
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

    // Edges
    const edgeSel = g.append('g')
      .attr('class', 'obs-amber-graph-edges')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('class', 'obs-amber-graph-edge');

    // Nodes
    const nodeSel = g.append('g')
      .attr('class', 'obs-amber-graph-nodes')
      .selectAll('g')
      .data(nodes, (d: GraphNode) => d.id)
      .join('g')
      .attr('class', (d: GraphNode) => `obs-amber-graph-node obs-amber-graph-node--${d.type}`)
      .attr('cursor', 'pointer');

    nodeSel.append('circle')
      .attr('r', (d: GraphNode) => d.type === 'tag' ? TAG_NODE_RADIUS : LINK_NODE_RADIUS)
      .attr('fill', (d: GraphNode) => this._resolveNodeColor(d))
      .attr('fill-opacity', (d: GraphNode) => d.type === 'tag' ? 0.85 : 1)
      .attr('stroke', (d: GraphNode) => d.type === 'tag' ? 'rgba(255,255,255,0.15)' : 'none')
      .attr('stroke-width', (d: GraphNode) => d.type === 'tag' ? 2 : 0);

    nodeSel.append('text')
      .attr('dy', '1.4em')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('class', (d: GraphNode) => `obs-amber-graph-label obs-amber-graph-label--${d.type}`)
      .text((d: GraphNode) => {
        if (d.type === 'tag') return d.label;
        return d.label.length > 25 ? d.label.slice(0, 22) + '\u2026' : d.label;
      });

    nodeSel.append('title').text((d: GraphNode) => d.label + (d.url ? `\n${d.url}` : ''));

    nodeSel
      .on('mouseover', (event: MouseEvent, d: GraphNode) => this._showTooltip(event, d))
      .on('mousemove', (event: MouseEvent) => this._moveTooltip(event))
      .on('mouseout', () => this._hideTooltip());

    nodeSel.on('click', (event: MouseEvent, d: GraphNode) => {
      event.stopPropagation();
      if (d.type === 'link' && d.url) {
        window.open(d.url, '_blank', 'noopener,noreferrer');
      } else if (d.type === 'tag') {
        this.searchQuery = d.label;
        if (this.searchInput) this.searchInput.value = d.label;
        this._updateGraph();
      }
    });

    const drag = d3.drag()
      .on('start', (event: { active: boolean; x: number; y: number }, d: GraphNode) => {
        if (!event.active) this.simulation?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: { active: boolean; x: number; y: number }, d: GraphNode) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: { active: boolean; x: number; y: number }, d: GraphNode) => {
        if (!event.active) this.simulation?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    nodeSel.call(drag);

    this.simulation = d3.forceSimulation(nodes)
      .force('link',
        d3.forceLink(edges)
          .id((d: GraphNode) => d.id)
          .distance(this.physics.linkDistance * 0.7)
      )
      .force('charge',
        d3.forceManyBody()
          .strength((d: GraphNode) => d.type === 'tag'
            ? this.physics.chargeStrength * 1.5
            : this.physics.chargeStrength
          )
      )
      .force('x', d3.forceX(0).strength(this.physics.centerStrength * 0.05))
      .force('y', d3.forceY(0).strength(this.physics.centerStrength * 0.05))
      .force('collide', d3.forceCollide((d: GraphNode) => d.type === 'tag' ? 22 : 12))
      .alphaDecay(this.physics.alphaDecay)
      .velocityDecay(this.physics.velocityDecay)
      .on('tick', () => {
        edgeSel
          .attr('x1', (d: GraphEdge) => (d.source as GraphNode).x ?? 0)
          .attr('y1', (d: GraphEdge) => (d.source as GraphNode).y ?? 0)
          .attr('x2', (d: GraphEdge) => (d.target as GraphNode).x ?? 0)
          .attr('y2', (d: GraphEdge) => (d.target as GraphNode).y ?? 0);
        nodeSel.attr('transform', (d: GraphNode) => `translate(${d.x ?? 0},${d.y ?? 0})`);
      });
  }

  private _applyPhysicsToSimulation(): void {
    const sim = this.simulation;
    if (!sim) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const charge = sim.force('charge') as any;
    if (charge) charge.strength((d: GraphNode) => d.type === 'tag'
      ? this.physics.chargeStrength * 1.5
      : this.physics.chargeStrength
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const link = sim.force('link') as any;
    if (link) link.distance(this.physics.linkDistance * 0.7);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fx = sim.force('x') as any;
    if (fx) fx.strength(this.physics.centerStrength * 0.05);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fy = sim.force('y') as any;
    if (fy) fy.strength(this.physics.centerStrength * 0.05);
    sim.alphaDecay(this.physics.alphaDecay);
    sim.velocityDecay(this.physics.velocityDecay);
    sim.alpha(0.3).restart();
  }

  // ── Colors ───────────────────────────────────────────────────────────────

  private _resolveNodeColor(d: GraphNode): string {
    if (d.type === 'tag') return '#898994';
    if (d.tags.length > 0) return this._getTagColor(d.tags[0]);
    return '#64647A';
  }

  private _getTagColor(tag: string): string {
    if (this.customColors[tag]) return this.customColors[tag];
    if (!this.tagColorMap.has(tag)) {
      this.tagColorMap.set(tag, TAG_COLORS[this.tagColorMap.size % TAG_COLORS.length]);
    }
    return this.tagColorMap.get(tag)!;
  }

  private _refreshNodeColors(): void {
    if (!this.svgEl) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    d3.select(this.svgEl)
      .selectAll('circle')
      .attr('fill', (d: any) => this._resolveNodeColor(d as GraphNode));
  }

  // ── Tooltip ──────────────────────────────────────────────────────────────

  private _showTooltip(event: MouseEvent, d: GraphNode): void {
    if (!this.tooltipEl) return;
    this.tooltipEl.textContent = d.type === 'link' && d.url
      ? `${d.label}\n${d.url}`
      : d.label;
    this.tooltipEl.removeClass('obs-amber-graph-tooltip--hidden');
    this._moveTooltip(event);
  }

  private _moveTooltip(event: MouseEvent): void {
    if (!this.tooltipEl) return;
    const rect = this.container.getBoundingClientRect();
    this.tooltipEl.style.left = `${event.clientX - rect.left + 12}px`;
    this.tooltipEl.style.top = `${event.clientY - rect.top - 28}px`;
  }

  private _hideTooltip(): void {
    this.tooltipEl?.addClass('obs-amber-graph-tooltip--hidden');
  }

  // ── Empty state ──────────────────────────────────────────────────────────

  private _renderEmptyState(): void {
    if (!this.svgEl) return;
    const svgContainer = this.svgEl.parentElement!;
    const width = svgContainer.clientWidth || 800;
    const height = svgContainer.clientHeight || 600;
    const svg = d3.select(this.svgEl)
      .attr('width', width)
      .attr('height', height);
    svg.selectAll('*').remove();
    svg.append('text')
      .attr('x', width / 2).attr('y', height / 2)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('class', 'obs-amber-graph-empty-text')
      .text(t('graph.emptyState'));
  }
}
