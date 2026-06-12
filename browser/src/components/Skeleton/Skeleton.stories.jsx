import Skeleton, { SkeletonLinkRow, SkeletonLinkCard } from './Skeleton';

export default {
	title: 'Components/Skeleton',
	component: Skeleton,
};

export const Text = {
	args: { variant: 'text', width: '80%' },
};

export const Circle = {
	args: { variant: 'circle', width: '32px', height: '32px' },
};

export const Rect = {
	args: { variant: 'rect', width: '100%', height: '120px' },
};

export const MultipleLines = {
	args: { variant: 'text', count: 4, width: '90%' },
};

export const LinkRow = {
	render: () => <SkeletonLinkRow count={5} />,
};

export const LinkCard = {
	render: () => (
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: '16px' }}>
			<SkeletonLinkCard />
			<SkeletonLinkCard />
			<SkeletonLinkCard />
		</div>
	),
};
