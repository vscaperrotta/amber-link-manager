import PropTypes from 'prop-types';
import './IconButton.scss';

function IconButton(props) {
	const classes = [
		'icon-button',
		props.variant !== 'default' ? `icon-button--${props.variant}` : '',
		props.disabled ? 'icon-button--disabled' : '',
		props.className || '',
	].filter(Boolean).join(' ');

	return (
		<button
			className={classes}
			type="button"
			onClick={props.onClick}
			aria-label={props.title}
			title={props.title}
			disabled={props.disabled}
		>
			{props.icon}
			{props.titleVisible ? (
				<span className="icon-button__title">
					{props.title}
				</span>
			) : null}
		</button>
	);
}

IconButton.propTypes = {
	onClick: PropTypes.func,
	icon: PropTypes.element,
	title: PropTypes.string,
	titleVisible: PropTypes.bool,
	variant: PropTypes.oneOf(['default', 'danger', 'info']),
	disabled: PropTypes.bool,
	className: PropTypes.string,
};

IconButton.defaultProps = {
	onClick: () => { },
	icon: null,
	title: '',
	titleVisible: false,
	variant: 'default',
	disabled: false,
	className: '',
};

export default IconButton;
