import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

const Input = forwardRef(function Input(
	{ id, label, ariaLabel, value, onChange, onKeyDown, placeholder, type, error, disabled, required },
	ref
) {
	return (
		<div className={`input${error ? ' input--error' : ''}`}>
			{label ? (
				<label className="input__label" htmlFor={id}>{label}</label>
			) : null}
			<input
				ref={ref}
				name={id}
				id={id}
				aria-label={ariaLabel || undefined}
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				className="input__field"
				placeholder={placeholder}
				type={type}
				disabled={disabled}
				required={required}
				rows={type === 'textarea' ? 4 : undefined}
			/>
			{error ? <span className="input__error">{error}</span> : null}
		</div>
	);
});

Input.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	ariaLabel: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	onKeyDown: PropTypes.func,
	placeholder: PropTypes.string,
	type: PropTypes.string,
	error: PropTypes.string,
	disabled: PropTypes.bool,
	required: PropTypes.bool,
};

Input.defaultProps = {
	id: '',
	label: '',
	ariaLabel: '',
	value: '',
	onChange: () => { },
	onKeyDown: undefined,
	placeholder: '',
	type: 'text',
	error: '',
	disabled: false,
	required: false,
};

export default Input;
