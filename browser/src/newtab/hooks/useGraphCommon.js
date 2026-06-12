import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { TAG_COLORS, PHYSICS_DEFAULTS } from '../../common/constants';

function loadFromStorage(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

export function useGraphCommon(links, storagePrefix = 'amber') {
	const containerRef = useRef(null);
	const svgRef = useRef(null);
	const tagColorMap = useRef(new Map());

	const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

	useEffect(() => {
		if (!containerRef.current) return;
		const obs = new ResizeObserver(entries => {
			const { width, height } = entries[0].contentRect;
			setDimensions({ width, height });
		});
		obs.observe(containerRef.current);
		return () => obs.disconnect();
	}, []);

	const [searchQuery, setSearchQuery] = useState('');

	const filteredLinks = useMemo(() => links, [links]);

	const [physics, setPhysics] = useState(() =>
		loadFromStorage(`${storagePrefix}-graph-physics`, PHYSICS_DEFAULTS)
	);
	useEffect(() => {
		localStorage.setItem(`${storagePrefix}-graph-physics`, JSON.stringify(physics));
	}, [physics, storagePrefix]);

	const [customColors, setCustomColors] = useState(() =>
		loadFromStorage(`${storagePrefix}-graph-colors`, {})
	);
	useEffect(() => {
		localStorage.setItem(`${storagePrefix}-graph-colors`, JSON.stringify(customColors));
	}, [customColors, storagePrefix]);

	const [showOptions, setShowOptions] = useState(false);
	useEffect(() => {
		if (!showOptions) return;
		function onKeyDown(e) {
			if (e.key === 'Escape') setShowOptions(false);
		}
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [showOptions]);

	const resolveColor = useCallback(tag => {
		if (!tag) return '#64647A';
		if (customColors[tag]) return customColors[tag];
		if (!tagColorMap.current.has(tag)) {
			tagColorMap.current.set(tag, TAG_COLORS[tagColorMap.current.size % TAG_COLORS.length]);
		}
		return tagColorMap.current.get(tag);
	}, [customColors]);

	const resolveColorRef = useRef(resolveColor);
	useEffect(() => {
		resolveColorRef.current = resolveColor;
	}, [resolveColor]);

	const uniqueTags = useMemo(() =>
		[...new Set(filteredLinks.flatMap(l => l.metadata?.tags || []))].sort(),
		[filteredLinks]
	);

	const handlePhysicsChange = useCallback((key, value) =>
		setPhysics(prev => ({ ...prev, [key]: value })), []);

	const handleColorChange = useCallback((tag, color) =>
		setCustomColors(prev => ({ ...prev, [tag]: color })), []);

	return {
		containerRef,
		svgRef,
		dimensions,
		searchQuery,
		setSearchQuery,
		filteredLinks,
		physics,
		setPhysics,
		handlePhysicsChange,
		customColors,
		setCustomColors,
		handleColorChange,
		showOptions,
		setShowOptions,
		resolveColor,
		resolveColorRef,
		uniqueTags,
	};
}
