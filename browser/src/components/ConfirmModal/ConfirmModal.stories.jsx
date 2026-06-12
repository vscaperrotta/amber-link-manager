import ConfirmModal from './ConfirmModal.jsx';

export default {
	title: 'Components/ConfirmModal',
	component: ConfirmModal,
	parameters: {
		layout: 'fullscreen',
	},
};

export const Visible = {
	args: {
		isOpen: true,
		message: 'Sei sicuro di voler eseguire questa azione?',
		onConfirm: () => alert('Confermato'),
		onCancel: () => alert('Annullato'),
	},
};

export const Hidden = {
	args: {
		isOpen: false,
		message: 'Sei sicuro di voler eseguire questa azione?',
		onConfirm: () => {},
		onCancel: () => {},
	},
};

export const LogoutConfirm = {
	args: {
		isOpen: true,
		message: 'Sei sicuro di voler uscire?',
		onConfirm: () => alert('Disconnesso'),
		onCancel: () => alert('Annullato'),
	},
};
