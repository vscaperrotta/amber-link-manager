import { Plus, Save, Trash2 } from 'lucide-react'
import Button from './Button'

export default {
	title: 'Components/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'select', options: ['small', 'medium'] },
		variant: { control: 'select', options: ['primary', 'secondary'] },
		onClick: { action: 'clicked' },
	},
}

export const Primary = {
	args: {
		text: 'Save link',
		variant: 'primary',
		size: 'medium',
	},
}

export const Secondary = {
	args: {
		text: 'Cancel',
		variant: 'secondary',
		size: 'medium',
	},
}

export const Small = {
	args: {
		text: 'Small',
		size: 'small',
		variant: 'primary',
	},
}

export const WithIcon = {
	args: {
		text: 'Add link',
		icon: <Plus size={16} />,
		variant: 'primary',
		size: 'medium',
	},
}

export const Danger = {
	args: {
		text: 'Delete',
		icon: <Trash2 size={16} />,
		variant: 'secondary',
		size: 'medium',
	},
}

export const Disabled = {
	args: {
		text: 'Save link',
		icon: <Save size={16} />,
		disabled: true,
	},
}
