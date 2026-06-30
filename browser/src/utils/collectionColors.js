export const COLLECTION_COLORS = [
	'#F5A623', // amber (brand)
	'#5096F0', // blue
	'#50D282', // green
	'#EE5555', // red
	'#A78BFA', // purple
	'#4ECDC4', // teal
	'#FF8C42', // orange
	'#F06292', // pink
];

export function getCollectionColor(index) {
	return COLLECTION_COLORS[index % COLLECTION_COLORS.length];
}
