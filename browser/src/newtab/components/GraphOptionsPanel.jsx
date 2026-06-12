import PropTypes from 'prop-types';
import GraphPhysicsPanel from '@newtab/components/GraphPhysicsPanel.jsx';
import GraphColorPanel from '@newtab/components/GraphColorPanel.jsx';

function GraphOptionsPanel(props) {
	return (
		<div className="newtab__graph-panel newtab__graph-panel--options">
			<div className="newtab__graph-panel-body">
				{props.withPhysics !== false && (
					<>
						<GraphPhysicsPanel
							physics={props.physics}
							onChange={props.onPhysicsChange}
							onReset={props.onPhysicsReset}
						/>
						<div className="newtab__graph-panel-divider" />
					</>
				)}
				<GraphColorPanel
					tags={props.tags}
					customColors={props.customColors}
					resolveColor={props.resolveColor}
					onChange={props.onColorChange}
					onReset={props.onColorReset}
				/>
			</div>
		</div>
	);
}

GraphOptionsPanel.propTypes = {
	physics: PropTypes.object,
	onPhysicsChange: PropTypes.func,
	onPhysicsReset: PropTypes.func,
	tags: PropTypes.arrayOf(PropTypes.string),
	customColors: PropTypes.object,
	resolveColor: PropTypes.func,
	onColorChange: PropTypes.func,
	onColorReset: PropTypes.func,
	withPhysics: PropTypes.bool,
};

GraphOptionsPanel.defaultProps = {
	physics: {},
	onPhysicsChange: undefined,
	onPhysicsReset: undefined,
	tags: [],
	customColors: {},
	resolveColor: undefined,
	onColorChange: undefined,
	onColorReset: undefined,
	withPhysics: true,
};

export default GraphOptionsPanel;
