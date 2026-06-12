import { useState } from 'react';
import RangeInput from './RangeInput';

export default {
	title: 'Components/RangeInput',
	component: RangeInput,
	tags: ['autodocs'],
	argTypes: {
		onChange: { action: 'changed' },
		format: { control: false },
	},
};

export const Default = {
	args: {
		label: 'Volume',
		value: 50,
		min: 0,
		max: 100,
		step: 1,
	},
};

export const WithFormat = {
	args: {
		label: 'Attrito',
		value: 0.4,
		min: 0.1,
		max: 0.9,
		step: 0.05,
		format: v => v.toFixed(2),
	},
};

export const NegativeRange = {
	args: {
		label: 'Repulsione',
		value: -150,
		min: -500,
		max: -10,
		step: 10,
	},
};

export const NoLabel = {
	args: {
		value: 30,
		min: 0,
		max: 100,
		step: 5,
	},
};

export const Disabled = {
	args: {
		label: 'Raffreddamento',
		value: 0.015,
		min: 0.001,
		max: 0.05,
		step: 0.001,
		format: v => v.toFixed(3),
		disabled: true,
	},
};

export const Controlled = {
	render: () => {
		const [value, setValue] = useState(60);
		return (
			<div style={{ width: 280 }}>
				<RangeInput
					label="Gravità"
					value={value}
					min={0}
					max={100}
					step={1}
					onChange={setValue}
				/>
			</div>
		);
	},
};

export const MultipleSliders = {
	render: () => {
		const [repulsion, setRepulsion] = useState(-150);
		const [friction, setFriction] = useState(0.4);
		const [gravity, setGravity] = useState(0.8);

		return (
			<div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
				<RangeInput
					label="Repulsione"
					value={repulsion}
					min={-500}
					max={-10}
					step={10}
					onChange={setRepulsion}
				/>
				<RangeInput
					label="Attrito"
					value={friction}
					min={0.1}
					max={0.9}
					step={0.05}
					format={v => v.toFixed(2)}
					onChange={setFriction}
				/>
				<RangeInput
					label="Gravità"
					value={gravity}
					min={0}
					max={2}
					step={0.1}
					format={v => v.toFixed(1)}
					onChange={setGravity}
				/>
			</div>
		);
	},
};
