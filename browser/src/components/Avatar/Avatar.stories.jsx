import Avatar from './Avatar.jsx';

export default {
	title: 'Components/Avatar',
	component: Avatar,
	parameters: {
		backgrounds: {
			default: 'light',
		},
	},
};

export const WithPhoto = {
	args: {
		photoURL: 'https://i.pravatar.cc/150?img=3',
		displayName: 'Mario Rossi',
		email: 'mario@example.com',
		size: 36,
	},
};

export const WithDisplayName = {
	args: {
		photoURL: null,
		displayName: 'Mario Rossi',
		email: 'mario@example.com',
		size: 36,
	},
};

export const WithEmailOnly = {
	args: {
		photoURL: null,
		displayName: null,
		email: 'mario@example.com',
		size: 36,
	},
};

export const Large = {
	args: {
		photoURL: null,
		displayName: 'Anna Verdi',
		email: 'anna@example.com',
		size: 56,
	},
};

export const Small = {
	args: {
		photoURL: null,
		displayName: 'Luigi Bianchi',
		email: 'luigi@example.com',
		size: 24,
	},
};
