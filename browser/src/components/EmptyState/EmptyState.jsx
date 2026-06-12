import PropTypes from 'prop-types';
import './EmptyState.scss';

function EmptyState({ icon, title, description, action }) {
	return (
		<div className="empty-state">
			{icon && <div className="empty-state__icon">{icon}</div>}
			<p className="empty-state__title">{title}</p>
			{description && <p className="empty-state__description">{description}</p>}
			{action && <div className="empty-state__action">{action}</div>}
		</div>
	);
}

EmptyState.propTypes = {
	icon: PropTypes.node,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	action: PropTypes.node,
};

EmptyState.defaultProps = {
	icon: null,
	description: null,
	action: null,
};

export default EmptyState;
