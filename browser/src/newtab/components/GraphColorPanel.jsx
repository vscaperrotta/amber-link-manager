import PropTypes from 'prop-types';
import { RotateCcw } from 'lucide-react';
import ColorPicker from '@components/ColorPicker';
import { t } from '@utils/i18n';

export default function GraphColorPanel({ tags, customColors, resolveColor, onChange, onReset }) {
	return (
		<>
			<div className="newtab__graph-panel-header">
				<span className="newtab__graph-panel-title">{t('graph.nodeColors')}</span>
				<button
					className="newtab__graph-panel-reset"
					onClick={onReset}
					title={t('graph.resetColors')}
				>
					<RotateCcw size={13} />
					{t('graph.reset')}
				</button>
			</div>
			<div className="newtab__graph-panel-colors-list">
				{tags.length === 0 && (
					<p className="newtab__graph-panel-empty">{t('graph.noTags')}</p>
				)}
				{tags.map(tag => {
					const color = resolveColor(tag);
					return (
						<div key={tag} className="newtab__graph-panel-row">
							<span className="newtab__graph-panel-tag-name">{tag || t('graph.untagged')}</span>
							<ColorPicker
								value={customColors[tag] || color}
								onChange={val => onChange(tag, val)}
								label={tag || t('graph.untaggedLabel')}
								placement="up"
							/>
						</div>
					);
				})}
			</div>
		</>
	);
}

GraphColorPanel.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.string).isRequired,
	customColors: PropTypes.object.isRequired,
	resolveColor: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onReset: PropTypes.func.isRequired,
};
