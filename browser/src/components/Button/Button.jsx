import PropTypes from 'prop-types';
import './Button.scss';

function Button({ size, variant, text, icon, onClick, type, form, disabled, className }) {
	const classes = [
		'button',
		`button--${size}`,
		`button--${variant}`,
		disabled ? 'button--disabled' : '',
		className || '',
	].filter(Boolean).join(' ');

	return (
		<button
			className={classes}
			onClick={onClick}
			type={type}
			form={form}
			disabled={disabled}
		>
			{icon ? icon : null}
			{text ? <span className="button__text">{text}</span> : null}
		</button>
	);
}

Button.propTypes = {
	onClick: PropTypes.func,
	text: PropTypes.string,
	icon: PropTypes.element,
	type: PropTypes.string,
	form: PropTypes.string,
	size: PropTypes.oneOf(['small', 'medium']),
	variant: PropTypes.oneOf(['primary', 'secondary', 'dark', 'danger']),
	disabled: PropTypes.bool,
	className: PropTypes.string,
};

Button.defaultProps = {
	onClick: () => { },
	text: null,
	icon: null,
	type: 'button',
	form: undefined,
	size: 'medium',
	variant: 'primary',
	disabled: false,
	className: '',
};

export default Button;
