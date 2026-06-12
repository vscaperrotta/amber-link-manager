import Header from './Header';

export default {
	title: 'Components/Header',
	component: Header,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
};

export const LoggedOut = {
	args: {
		auth: null,
	},
};

export const LoggedInWithPhoto = {
	args: {
		auth: {
			photoURL: 'https://i.pravatar.cc/150?img=3',
			displayName: 'Mario Rossi',
			email: 'mario@example.com',
		},
	},
};

export const LoggedInNoPhoto = {
	args: {
		auth: {
			photoURL: null,
			displayName: 'Mario Rossi',
			email: 'mario@example.com',
		},
	},
};

export const LoggedInEmailOnly = {
	args: {
		auth: {
			photoURL: null,
			displayName: null,
			email: 'mario@example.com',
		},
	},
};
