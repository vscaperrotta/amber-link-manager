import { Settings, Trash2, Star, Pencil, ExternalLink } from 'lucide-react'
import IconButton from './IconButton'

export default {
	title: 'Components/IconButton',
	component: IconButton,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['default', 'danger'] },
		onClick: { action: 'clicked' },
	},
}

export const Default = {
	args: {
		icon: <Settings size={18} />,
		title: 'Settings',
	},
}

export const Danger = {
	args: {
		icon: <Trash2 size={18} />,
		title: 'Delete',
		variant: 'danger',
	},
}

export const WithVisibleTitle = {
	args: {
		icon: <Star size={18} />,
		title: 'Add to favourites',
		titleVisible: true,
	},
}

export const Disabled = {
	args: {
		icon: <Pencil size={18} />,
		title: 'Edit',
		disabled: true,
	},
}

export const ToolbarGroup = {
	render: () => (
		<div style={{ display: 'flex', gap: '4px' }}>
			<IconButton icon={<Pencil size={18} />} title="Edit" />
			<IconButton icon={<ExternalLink size={18} />} title="Open link" />
			<IconButton icon={<Star size={18} />} title="Favourite" />
			<IconButton icon={<Trash2 size={18} />} title="Delete" variant="danger" />
		</div>
	),
}
