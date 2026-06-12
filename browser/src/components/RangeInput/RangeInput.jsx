import PropTypes from 'prop-types';
import './RangeInput.scss';

function RangeInput(props) {
	const percent = ((props.value - props.min) / (props.max - props.min)) * 100;
	const displayValue = props.format ? props.format(props.value) : String(props.value);

	function handleChange(e) {
		if (props.onChange) props.onChange(parseFloat(e.target.value));
	}

	return (
		<div className={`range-input${props.disabled ? ' range-input--disabled' : ''}`}>
			<div className="range-input__header">
				{props.label && (
					<label className="range-input__label">{props.label}</label>
				)}
				<span className="range-input__value">{displayValue}</span>
			</div>
			<input
				type="range"
				className="range-input__track"
				min={props.min}
				max={props.max}
				step={props.step}
				value={props.value}
				disabled={props.disabled}
				onChange={handleChange}
				style={{ '--range-fill': `${percent}%` }}
			/>
		</div>
	);
}

RangeInput.propTypes = {
	label: PropTypes.string,
	value: PropTypes.number.isRequired,
	min: PropTypes.number.isRequired,
	max: PropTypes.number.isRequired,
	step: PropTypes.number,
	onChange: PropTypes.func,
	format: PropTypes.func,
	disabled: PropTypes.bool,
};

RangeInput.defaultProps = {
	label: '',
	step: 1,
	onChange: undefined,
	format: undefined,
	disabled: false,
};

export default RangeInput;
