import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import './Pill.scss';
import { t } from '@utils/i18n';

export default function Pill(props) {
	return (
		<span className="tag-pill">
			{props.label ?
				<span className="tag-pill__label">
					{props.label}
				</span>
				: null}
			{props.onRemove && (
				<button
					type="button"
					className="tag-pill__remove"
					onClick={() => props.onRemove(props.label)}
					aria-label={t('pill.removeAriaLabel', { label: props.label })}
				>
					<X size={10} />
				</button>
			)}
		</span>
	);
}

Pill.propTypes = {
	label: PropTypes.string.isRequired,
	onRemove: PropTypes.func,
};

Pill.defaultProps = {
	onRemove: null,
};
