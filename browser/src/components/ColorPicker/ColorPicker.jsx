import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ColorPicker.scss';

const PRESETS = [
	'#F4A135', '#FB923C', '#F4C842', '#4ADE80', '#34D399',
	'#38BDF8', '#60A5FA', '#818CF8', '#A78BFA', '#E879F9',
	'#F472B6', '#F87171', '#E65050', '#50D282', '#5096F0',
	'#2DD4BF', '#FBBF24', '#F06090', '#B46EE6', '#94A3B8',
];

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

export default function ColorPicker(props) {
	const [open, setOpen] = useState(false);
	const [hex, setHex] = useState(props.value || '#000000');
	const rootRef = useRef(null);

	// Sync external value
	useEffect(() => {
		if (props.value && HEX_RE.test(props.value)) {
			setHex(props.value);
		}
	}, [props.value]);

	// Close on click outside
	useEffect(() => {
		if (!open) return;
		function handleDown(e) {
			if (rootRef.current && !rootRef.current.contains(e.target)) {
				setOpen(false);
			}
		}
		document.addEventListener('mousedown', handleDown);
		return () => document.removeEventListener('mousedown', handleDown);
	}, [open]);

	function selectColor(color) {
		setHex(color);
		props.onChange(color);
		setOpen(false);
	}

	function handleHexChange(e) {
		const val = e.target.value;
		setHex(val);
		if (HEX_RE.test(val)) {
			props.onChange(val);
		}
	}

	function handleHexKeyDown(e) {
		if (e.key === 'Enter') setOpen(false);
		if (e.key === 'Escape') setOpen(false);
	}

	return (
		<div className="color-picker" ref={rootRef}>
			<button
				type="button"
				className="color-picker__trigger"
				style={{ background: HEX_RE.test(hex) ? hex : '#000000' }}
				onClick={() => setOpen(prev => !prev)}
				aria-label={props.label ? `Color picker: ${props.label}` : 'Color picker'}
			/>
			{open && (
				<div className={`color-picker__popover${props.placement === 'up' ? ' color-picker__popover--up' : ''}`}>
					<div className="color-picker__presets">
						{PRESETS.map(color => (
							<button
								key={color}
								type="button"
								className={`color-picker__swatch${hex.toLowerCase() === color.toLowerCase() ? ' color-picker__swatch--active' : ''}`}
								style={{ background: color }}
								onClick={() => selectColor(color)}
								aria-label={color}
							/>
						))}
					</div>
					<div className="color-picker__hex-row">
						<span
							className="color-picker__hex-preview"
							style={{ background: HEX_RE.test(hex) ? hex : '#000000' }}
						/>
						<input
							className="color-picker__hex-input"
							type="text"
							value={hex}
							onChange={handleHexChange}
							onKeyDown={handleHexKeyDown}
							maxLength={7}
							spellCheck={false}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

ColorPicker.propTypes = {
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	placement: PropTypes.oneOf(['up', 'down']),
};

ColorPicker.defaultProps = {
	label: '',
	placement: 'down',
};
