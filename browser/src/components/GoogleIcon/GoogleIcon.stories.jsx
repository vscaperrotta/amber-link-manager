import GoogleIcon from './GoogleIcon.jsx';

export default {
	title: 'Components/GoogleIcon',
	component: GoogleIcon,
	parameters: {
		backgrounds: { default: 'light' },
	},
};

export const Small = { args: { size: 16 } };
export const Default = { args: { size: 18 } };
export const Medium = { args: { size: 24 } };
export const Large = { args: { size: 32 } };
