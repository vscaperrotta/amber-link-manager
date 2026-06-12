import { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { SlidersHorizontal } from 'lucide-react';
import Input from '@components/Input';
import GraphOptionsPanel from '@newtab/components/GraphOptionsPanel.jsx';
import { PHYSICS_DEFAULTS } from '../../common/constants';
import { t } from '@utils/i18n';
import { useGraphCommon } from '../hooks/useGraphCommon.js';

export default function GraphView({ links }) {
	const {
		containerRef, svgRef,
		dimensions,
		searchQuery, setSearchQuery,
		filteredLinks,
		physics, setPhysics, handlePhysicsChange,
		customColors, setCustomColors, handleColorChange,
		showOptions, setShowOptions,
		resolveColor, resolveColorRef,
		uniqueTags,
	} = useGraphCommon(links, 'amber-a');

	const simulationRef = useRef(null);

	const graphData = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();

		const linkNodes = filteredLinks.map(l => ({
			id: l.id,
			type: 'link',
			label: l.title || l.url,
			url: l.url,
			tags: l.metadata?.tags || [],
		}));

		const tagSet = new Set(linkNodes.flatMap(n => n.tags));
		let tagNodes = [...tagSet].map(tag => ({
			id: `tag::${tag}`,
			type: 'tag',
			label: tag,
			tags: [],
		}));

		// Tag search: show only matching tag nodes, no link nodes, no edges
		if (q) {
			tagNodes = tagNodes.filter(n => n.label.toLowerCase().includes(q));
			return { nodes: tagNodes, links: [] };
		}

		const nodes = [...linkNodes, ...tagNodes];
		const edges = linkNodes.flatMap(n =>
			n.tags.map(tag => ({ source: n.id, target: `tag::${tag}` }))
		);

		return { nodes, links: edges };
	}, [filteredLinks, searchQuery]);

	useEffect(() => {
		if (!svgRef.current || graphData.nodes.length === 0) return;

		if (simulationRef.current) simulationRef.current.stop();

		const nodes = graphData.nodes.map(d => ({ ...d }));
		const edgeLinks = graphData.links.map(d => ({ ...d }));

		const { width, height } = dimensions;
		const cx = width / 2;
		const cy = height / 2;

		const svg = d3.select(svgRef.current)
			.attr('width', width)
			.attr('height', height);

		svg.selectAll('*').remove();

		const g = svg.append('g');

		const zoom = d3.zoom()
			.scaleExtent([0.1, 8])
			.on('zoom', event => g.attr('transform', event.transform));
		svg.call(zoom);
		svg.call(zoom.transform, d3.zoomIdentity.translate(cx, cy));

		const link = g.append('g')
			.attr('stroke', 'rgba(160, 160, 180, 0.25)')
			.attr('stroke-width', 1)
			.selectAll('line')
			.data(edgeLinks)
			.join('line');

		const node = g.append('g')
			.selectAll('g')
			.data(nodes)
			.join('g')
			.attr('cursor', 'pointer')
			.on('click', (event, d) => {
				event.stopPropagation();
				if (d.type === 'link') {
					window.open(d.url, '_blank', 'noopener,noreferrer');
				}
			});

		node.append('circle')
			.attr('r', 6)
			.attr('fill', d => {
				if (d.type === 'tag') return '#898994';
				return d.tags.length ? resolveColorRef.current(d.tags[0]) : '#64647A';
			})
			.attr('fill-opacity', 1);

		node.append('text')
			.attr('dy', '1.4em')
			.attr('text-anchor', 'middle')
			.attr('font-size', '10px')
			.attr('font-weight', d => d.type === 'tag' ? '600' : '400')
			.attr('fill', d => d.type === 'tag' ? '#A0A0B4' : '#A0A0B4')
			.attr('pointer-events', 'none')
			.text(d => {
				if (d.type === 'tag') return d.label;
				return d.label.length > 25 ? d.label.slice(0, 22) + '\u2026' : d.label;
			});

		node.append('title').text(d => d.label);

		const simulation = d3.forceSimulation(nodes)
			.force('link', d3.forceLink(edgeLinks).id(d => d.id).distance(physics.linkDistance * 0.7))
			.force('charge', d3.forceManyBody()
				.strength(d => d.type === 'tag' ? physics.chargeStrength * 1.5 : physics.chargeStrength)
			)
			.force('x', d3.forceX(0).strength(physics.centerStrength * 0.05))
			.force('y', d3.forceY(0).strength(physics.centerStrength * 0.05))
			.force('collide', d3.forceCollide(d => d.type === 'tag' ? 18 : 10))
			.alphaDecay(physics.alphaDecay)
			.velocityDecay(physics.velocityDecay)
			.on('tick', () => {
				link
					.attr('x1', d => d.source.x)
					.attr('y1', d => d.source.y)
					.attr('x2', d => d.target.x)
					.attr('y2', d => d.target.y);
				node.attr('transform', d => `translate(${d.x},${d.y})`);
			});

		const drag = d3.drag()
			.on('start', (event, d) => {
				if (!event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			})
			.on('drag', (event, d) => {
				d.fx = event.x;
				d.fy = event.y;
			})
			.on('end', (event, d) => {
				if (!event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			});
		node.call(drag);

		simulationRef.current = simulation;

		return () => simulation.stop();
	}, [graphData, dimensions]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const sim = simulationRef.current;
		if (!sim) return;
		sim.force('charge')?.strength(d => d.type === 'tag' ? physics.chargeStrength * 1.5 : physics.chargeStrength);
		sim.force('link')?.distance(physics.linkDistance * 0.7);
		sim.force('x')?.strength(physics.centerStrength * 0.05);
		sim.force('y')?.strength(physics.centerStrength * 0.05);
		sim.alphaDecay(physics.alphaDecay);
		sim.velocityDecay(physics.velocityDecay);
		sim.alpha(0.3).restart();
	}, [physics]);

	useEffect(() => {
		if (!svgRef.current) return;
		d3.select(svgRef.current)
			.selectAll('circle')
			.attr('fill', d => {
				if (d.type === 'tag') return '#898994';
				return d.tags.length ? resolveColor(d.tags[0]) : '#898994';
			});
	}, [customColors, resolveColor]);

	if (links.length === 0) {
		return (
			<div className="newtab__graph-empty">
				<p>{t('graph.emptyState')}</p>
			</div>
		);
	}

	return (
		<div className="newtab__graph-view" ref={containerRef}>
			<div className="newtab__graph-search-overlay">
				<Input
					type="text"
					placeholder={t('graph.searchPlaceholder')}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<button
				className={`newtab__graph-panel-toggle newtab__graph-panel-toggle--options${showOptions ? ' newtab__graph-panel-toggle--active' : ''}`}
				onClick={() => setShowOptions(v => !v)}
				title={t('graph.optionsTitle')}
			>
				<SlidersHorizontal size={14} />
			</button>

			{showOptions && (
				<GraphOptionsPanel
					physics={physics}
					onPhysicsChange={handlePhysicsChange}
					onPhysicsReset={() => setPhysics(PHYSICS_DEFAULTS)}
					tags={uniqueTags}
					customColors={customColors}
					resolveColor={resolveColor}
					onColorChange={handleColorChange}
					onColorReset={() => setCustomColors({})}
				/>
			)}

			{(searchQuery.trim() ? graphData.nodes.length === 0 : filteredLinks.length === 0) ? (
				<div className="newtab__graph-empty">
					<p>{t('graph.noSearchResults')}</p>
				</div>
			) : (
				<svg ref={svgRef} className="newtab__graph-svg" />
			)}
		</div>
	);
}

GraphView.propTypes = { links: PropTypes.array };
GraphView.defaultProps = { links: [] };
