import BaseModal from './BaseModal.jsx';
import Input from '@components/Input/Input.jsx';

export default {
	title: 'Components/BaseModal',
	component: BaseModal,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<div style={{ minHeight: '400px', position: 'relative' }}>
				<Story />
			</div>
		),
	],
};

// Caso conferma: solo messaggio + 2 CTA (nessun children)
export const ConfirmUseCase = {
	args: {
		isOpen: true,
		title: 'Esci dal tuo account',
		message: 'Sei sicuro di voler uscire? Dovrai accedere di nuovo.',
		onClose: () => {},
		primaryAction: {
			label: 'Esci',
			variant: 'danger',
			onClick: () => {},
		},
		secondaryAction: {
			label: 'Annulla',
			onClick: () => {},
		},
	},
};

// Caso form: children con un form, submit via form attribute
export const FormUseCase = {
	args: {
		isOpen: true,
		title: 'Modifica link',
		onClose: () => {},
		primaryAction: {
			label: 'Salva',
			type: 'submit',
			form: 'story-modal-form',
		},
		secondaryAction: {
			label: 'Annulla',
			onClick: () => {},
		},
	},
	render: (args) => (
		<BaseModal {...args}>
			<form id="story-modal-form" onSubmit={(e) => e.preventDefault()}>
				<Input placeholder="Titolo" />
				<Input placeholder="URL" type="url" />
			</form>
		</BaseModal>
	),
};

// Caso informativa: solo titolo + X, nessun footer action
export const InfoUseCase = {
	args: {
		isOpen: true,
		title: 'Informazione',
		message: 'Questo è un messaggio informativo che non richiede azioni specifiche.',
		onClose: () => {},
	},
};

// Stato loading sul primaryAction
export const LoadingState = {
	args: {
		isOpen: true,
		title: 'Salvataggio in corso',
		message: 'Attendi mentre salviamo le modifiche...',
		onClose: () => {},
		primaryAction: {
			label: 'Salva',
			loading: true,
		},
		secondaryAction: {
			label: 'Annulla',
			onClick: () => {},
		},
	},
};
