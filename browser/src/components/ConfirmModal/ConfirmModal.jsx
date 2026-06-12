import PropTypes from 'prop-types';
import BaseModal from '@components/BaseModal';
import { t } from '@utils/i18n';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
	return (
		<BaseModal
			isOpen={isOpen}
			title={title}
			onClose={onCancel}
			message={message}
			primaryAction={{ label: t('confirmModal.confirm'), variant: 'danger', onClick: onConfirm }}
			secondaryAction={{ label: t('common.cancel'), onClick: onCancel }}
		/>
	);
}

ConfirmModal.propTypes = {
	isOpen: PropTypes.bool,
	title: PropTypes.string,
	message: PropTypes.string.isRequired,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};

ConfirmModal.defaultProps = {
	isOpen: false,
	title: t('confirmModal.title'),
};

export default ConfirmModal;
