import PropTypes from 'prop-types';
import './Toggle.scss';

function Toggle(props) {
	function handleChange(e) {
		if (props.onChange) props.onChange(e.target.checked);
	}

	return (
		<label className={`toggle${props.disabled ? ' toggle--disabled' : ''}`}>
			<input
				type="checkbox"
				className="toggle__input"
				checked={props.checked}
				onChange={handleChange}
				disabled={props.disabled}
			/>
			<span className="toggle__track">
				<span className="toggle__thumb" />
			</span>
			{props.label && <span className="toggle__label">{props.label}</span>}
		</label>
	);
}

Toggle.propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	label: PropTypes.string,
};

Toggle.defaultProps = {
	checked: false,
	onChange: undefined,
	disabled: false,
	label: '',
};

export default Toggle;
