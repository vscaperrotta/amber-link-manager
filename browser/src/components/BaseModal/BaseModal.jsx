import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import './BaseModal.scss';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import { t } from '@utils/i18n';

const TRANSITION_MS = 200;

function BaseModal({
	isOpen,
	title,
	onClose,
	children,
	message,
	primaryAction,
	secondaryAction,
}) {
	// State machine: 'closed' | 'entering' | 'open' | 'exiting'
	const [phase, setPhase] = useState(isOpen ? 'open' : 'closed');

	useEffect(() => {
		if (isOpen && (phase === 'closed' || phase === 'exiting')) {
			setPhase('entering');
			const raf = requestAnimationFrame(() => {
				requestAnimationFrame(() => setPhase('open'));
			});
			return () => cancelAnimationFrame(raf);
		}
		if (!isOpen && (phase === 'open' || phase === 'entering')) {
			setPhase('exiting');
			const timer = setTimeout(() => setPhase('closed'), TRANSITION_MS);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	const handleClose = useCallback(() => {
		if (onClose) onClose();
	}, [onClose]);

	if (phase === 'closed') return null;

	const overlayClass = `modal__overlay modal__overlay--${phase}`;

	return (
		<div
			className={overlayClass}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			onClick={handleClose}
		>
			<div
				className="modal__card"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="modal__header">
					<h3 id="modal-title" className="modal__title">{title}</h3>
					<IconButton
						icon={<X size={18} />}
						onClick={handleClose}
						title={t('baseModal.close')}
					/>
				</div>

				{message && (
					<p className="modal__message">{message}</p>
				)}

				{children && (
					<div className="modal__body">
						{children}
					</div>
				)}

				<div className="modal__footer">
					{secondaryAction && (
						<Button
							text={secondaryAction.label}
							variant="secondary"
							size="small"
							onClick={secondaryAction.onClick}
						/>
					)}
					{primaryAction && (
						<Button
							text={primaryAction.loading ? t('common.loading') : primaryAction.label}
							variant={primaryAction.variant ?? 'dark'}
							size="small"
							type={primaryAction.type ?? 'button'}
							form={primaryAction.form}
							onClick={primaryAction.onClick}
							disabled={primaryAction.disabled || primaryAction.loading}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

BaseModal.propTypes = {
	isOpen: PropTypes.bool,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node,
	message: PropTypes.string,
	primaryAction: PropTypes.shape({
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func,
		type: PropTypes.oneOf(['button', 'submit']),
		form: PropTypes.string,
		variant: PropTypes.oneOf(['primary', 'dark', 'danger']),
		loading: PropTypes.bool,
		disabled: PropTypes.bool,
	}),
	secondaryAction: PropTypes.shape({
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
	}),
};

BaseModal.defaultProps = {
	isOpen: false,
	children: null,
	message: null,
	primaryAction: null,
	secondaryAction: null,
};

export default BaseModal;
