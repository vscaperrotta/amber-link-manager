import Pill from './Pill'

export default {
	title: 'Components/Pill',
	component: Pill,
	tags: ['autodocs'],
	argTypes: {
		onRemove: { action: 'removed' },
	},
}

export const Default = {
	args: {
		label: 'design',
	},
}

export const Removable = {
	args: {
		label: 'design',
		onRemove: () => { },
	},
}

export const LongLabel = {
	args: {
		label: 'very-long-tag-name',
		onRemove: () => { },
	},
}

export const Group = {
	render: () => (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
			{['design', 'development', 'ux', 'research', 'tools'].map(tag => (
				<Pill key={tag} label={tag} onRemove={() => { }} />
			))}
		</div>
	),
}

export const ReadOnly = {
	render: () => (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
			{['design', 'development', 'ux'].map(tag => (
				<Pill key={tag} label={tag} />
			))}
		</div>
	),
}
