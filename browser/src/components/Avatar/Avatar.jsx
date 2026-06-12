import PropTypes from 'prop-types';
import './Avatar.scss';

function getInitials(displayName, email) {
	if (displayName) {
		return displayName
			.split(' ')
			.map(n => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}
	return email?.[0]?.toUpperCase() ?? '?';
}

function Avatar({ photoURL, displayName, email, size }) {
	const style = { width: size, height: size, fontSize: Math.round(size * 0.38) };

	if (photoURL) {
		return (
			<div className="avatar" style={style}>
				<img src={photoURL} alt={displayName || email || 'Avatar'} className="avatar__img" />
			</div>
		);
	}

	return (
		<div className="avatar" style={style}>
			<span className="avatar__initials">{getInitials(displayName, email)}</span>
		</div>
	);
}

Avatar.propTypes = {
	photoURL: PropTypes.string,
	displayName: PropTypes.string,
	email: PropTypes.string,
	size: PropTypes.number,
};

Avatar.defaultProps = {
	photoURL: null,
	displayName: null,
	email: null,
	size: 36,
};

export default Avatar;
