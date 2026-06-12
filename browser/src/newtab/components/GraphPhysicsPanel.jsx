import PropTypes from 'prop-types';
import { RotateCcw } from 'lucide-react';
import RangeInput from '@components/RangeInput';
import { SLIDERS } from '../../common/constants';
import { t } from '@utils/i18n';

export default function GraphPhysicsPanel({ physics, onChange, onReset }) {
	return (
		<>
			<div className="newtab__graph-panel-header">
				<span className="newtab__graph-panel-title">
					{t('graph.physics')}
				</span>
				<button
					className="newtab__graph-panel-reset"
					onClick={onReset}
					title={t('graph.resetPhysics')}
				>
					<RotateCcw size={13} />
					{t('graph.reset')}
				</button>
			</div>
			<div className="newtab__graph-panel-sliders">
				{SLIDERS.map(({ key, label, min, max, step, format }) => (
					<RangeInput
						key={key}
						label={t(label)}
						value={physics[key]}
						min={min}
						max={max}
						step={step}
						format={format}
						onChange={v => onChange(key, v)}
					/>
				))}
			</div>
		</>
	);
}

GraphPhysicsPanel.propTypes = {
	physics: PropTypes.shape({
		chargeStrength: PropTypes.number.isRequired,
		linkDistance: PropTypes.number.isRequired,
		velocityDecay: PropTypes.number.isRequired,
		alphaDecay: PropTypes.number.isRequired,
		centerStrength: PropTypes.number.isRequired,
	}).isRequired,
	onChange: PropTypes.func.isRequired,
	onReset: PropTypes.func.isRequired,
};
