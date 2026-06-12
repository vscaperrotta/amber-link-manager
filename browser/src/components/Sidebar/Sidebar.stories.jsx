import { useState } from 'react';
import Sidebar from './Sidebar';

export default {
	title: 'Components/Sidebar',
	component: Sidebar,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
};

export const Collapsed = {
	args: {
		isOpen: false,
		activeView: 'home',
		onAdd: () => {},
		onToggle: () => {},
		onNavigate: () => {},
	},
};

export const Expanded = {
	args: {
		isOpen: true,
		activeView: 'home',
		onAdd: () => {},
		onToggle: () => {},
		onNavigate: () => {},
	},
};

export const ActiveTags = {
	args: {
		isOpen: true,
		activeView: 'tags',
		onAdd: () => {},
		onToggle: () => {},
		onNavigate: () => {},
	},
};

export const Interactive = {
	render: () => {
		const [isOpen, setIsOpen] = useState(false);
		const [activeView, setActiveView] = useState('home');
		return (
			<div style={{ position: 'relative', height: '400px' }}>
				<Sidebar
					isOpen={isOpen}
					onToggle={() => setIsOpen(p => !p)}
					activeView={activeView}
					onNavigate={setActiveView}
					onAdd={() => {}}
				/>
			</div>
		);
	},
};
