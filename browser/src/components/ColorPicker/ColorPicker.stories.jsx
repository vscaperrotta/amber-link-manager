import { useState } from 'react';
import ColorPicker from './ColorPicker';

export default {
	title: 'Components/ColorPicker',
	component: ColorPicker,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
};

export const Default = {
	args: {
		value: '#F4A135',
		onChange: () => {},
	},
};

export const Blue = {
	args: {
		value: '#5096F0',
		label: 'Node color',
		onChange: () => {},
	},
};

export const Controlled = {
	render: () => {
		const [color, setColor] = useState('#50D282');
		return (
			<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
				<ColorPicker value={color} onChange={setColor} label="Pick a color" />
				<span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{color}</span>
			</div>
		);
	},
};

export const MultipleColors = {
	render: () => {
		const [colors, setColors] = useState({
			design: '#F4A135',
			dev: '#5096F0',
			ux: '#E879F9',
		});
		return (
			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				{Object.entries(colors).map(([tag, color]) => (
					<div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<ColorPicker
							value={color}
							label={tag}
							onChange={val => setColors(prev => ({ ...prev, [tag]: val }))}
						/>
						<span style={{ fontSize: '13px' }}>{tag}</span>
						<span style={{ fontFamily: 'monospace', fontSize: '11px', opacity: 0.6 }}>{color}</span>
					</div>
				))}
			</div>
		);
	},
};
