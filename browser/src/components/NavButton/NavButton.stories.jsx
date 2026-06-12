import { Home, Star, Link2, Settings, Clock } from 'lucide-react'
import NavButton from './NavButton'

export default {
	title: 'Components/NavButton',
	component: NavButton,
	tags: ['autodocs'],
	argTypes: {
		onClick: { action: 'clicked' },
	},
}

export const Default = {
	args: {
		text: 'Home',
		icon: <Home size={20} />,
	},
}

export const Active = {
	args: {
		text: 'Favourites',
		icon: <Star size={20} />,
		isActive: true,
	},
}

export const WithoutIcon = {
	args: {
		text: 'All Links',
	},
}

export const Sidebar = {
	render: () => (
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '220px', padding: '8px' }}>
			<NavButton text="Home" icon={<Home size={20} />} isActive />
			<NavButton text="Recent" icon={<Clock size={20} />} />
			<NavButton text="Favourites" icon={<Star size={20} />} />
			<NavButton text="All Links" icon={<Link2 size={20} />} />
			<NavButton text="Settings" icon={<Settings size={20} />} />
		</nav>
	),
}
