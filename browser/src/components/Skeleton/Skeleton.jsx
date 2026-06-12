import PropTypes from 'prop-types';
import './Skeleton.scss';

function Skeleton({ variant, width, height, count }) {
	if (count > 1) {
		return (
			<div className="skeleton__group">
				{Array.from({ length: count }).map((_, i) => (
					<Skeleton key={i} variant={variant} width={width} height={height} />
				))}
			</div>
		);
	}

	const className = `skeleton skeleton--${variant}`;
	const style = {};
	if (width) style.width = width;
	if (height) style.height = height;

	return <div className={className} style={style} />;
}

Skeleton.propTypes = {
	variant: PropTypes.oneOf(['text', 'circle', 'rect']),
	width: PropTypes.string,
	height: PropTypes.string,
	count: PropTypes.number,
};

Skeleton.defaultProps = {
	variant: 'text',
	width: '100%',
	height: undefined,
	count: 1,
};

/** Mimics a popup link row: small circle + two text lines */
function SkeletonLinkRow({ count }) {
	return (
		<div className="skeleton-link-rows">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="skeleton-link-row">
					<Skeleton variant="circle" width="14px" height="14px" />
					<div className="skeleton-link-row__text">
						<Skeleton variant="text" width="60%" height="12px" />
						<Skeleton variant="text" width="30%" height="10px" />
					</div>
				</div>
			))}
		</div>
	);
}

SkeletonLinkRow.propTypes = {
	count: PropTypes.number,
};

SkeletonLinkRow.defaultProps = {
	count: 3,
};

/** Mimics a newtab grid card: rect image + text lines */
function SkeletonLinkCard() {
	return (
		<div className="skeleton-link-card">
			<Skeleton variant="rect" width="100%" height="120px" />
			<div className="skeleton-link-card__body">
				<Skeleton variant="text" width="80%" height="14px" />
				<Skeleton variant="text" width="50%" height="12px" />
				<Skeleton variant="text" width="35%" height="10px" />
			</div>
		</div>
	);
}

export default Skeleton;
export { Skeleton, SkeletonLinkRow, SkeletonLinkCard };
