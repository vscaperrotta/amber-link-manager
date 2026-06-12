import { useState } from 'react';
import Toggle from './Toggle';

export default {
	title: 'Components/Toggle',
	component: Toggle,
	tags: ['autodocs'],
	argTypes: {
		onChange: { action: 'changed' },
	},
};

export const Default = {
	args: {
		checked: false,
		label: 'Enable feature',
	},
};

export const Checked = {
	args: {
		checked: true,
		label: 'Feature enabled',
	},
};

export const NoLabel = {
	args: {
		checked: false,
	},
};

export const Disabled = {
	args: {
		checked: false,
		label: 'Disabled toggle',
		disabled: true,
	},
};

export const DisabledChecked = {
	args: {
		checked: true,
		label: 'Disabled and on',
		disabled: true,
	},
};

export const Controlled = {
	render: () => {
		const [checked, setChecked] = useState(false);
		return (
			<Toggle
				checked={checked}
				onChange={setChecked}
				label={checked ? 'On' : 'Off'}
			/>
		);
	},
};
