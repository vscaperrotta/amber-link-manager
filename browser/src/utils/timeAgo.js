export function timeAgo(value) {
	if (!value) return '';
	const date = new Date(typeof value === 'string' ? value : Number(value));
	if (isNaN(date.getTime())) return '';
	const diff = Date.now() - date.getTime();
	const m = Math.floor(diff / 60000);
	if (m < 1) return 'just now';
	if (m < 60) return `${m}m`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h`;
	const d = Math.floor(h / 24);
	if (d < 7) return `${d}d`;
	const w = Math.floor(d / 7);
	if (w < 52) return `${w}w`;
	return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}
