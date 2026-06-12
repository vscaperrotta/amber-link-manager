import PropTypes from 'prop-types';
import './NavButton.scss';

function NavButton({ text, icon, onClick, isActive, className, count }) {
	const classes = [
		'nav-button',
		isActive ? 'nav-button--active' : '',
		className || '',
	].filter(Boolean).join(' ');

	return (
		<button
			className={classes}
			type="button"
			onClick={onClick}
			aria-label={text}
			aria-current={isActive ? 'page' : undefined}
		>
			{icon ? icon : null}
			<span data-text={text}>{text}</span>
			{count != null && count > 0 ? (
				<span className="nav-button__counter" aria-hidden="true">{count > 999 ? '999+' : count}</span>
			) : null}
		</button>
	);
}

NavButton.propTypes = {
	text: PropTypes.string.isRequired,
	icon: PropTypes.element,
	onClick: PropTypes.func,
	isActive: PropTypes.bool,
	className: PropTypes.string,
	count: PropTypes.number,
};

NavButton.defaultProps = {
	icon: null,
	onClick: () => { },
	isActive: false,
	className: '',
	count: null,
};

export default NavButton;
