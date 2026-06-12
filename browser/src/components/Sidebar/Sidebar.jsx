import PropTypes from 'prop-types';
import './Sidebar.scss';
import { Home, Star, Tag, Network, PanelRightOpen, Plus } from 'lucide-react';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import NavButton from '@components/NavButton';
import { t } from '@utils/i18n';

export default function Sidebar({ onAdd, isOpen, onToggle, activeView, onNavigate, linkCounts }) {

	return (
		<aside
			className={`sidebar${isOpen ? ' sidebar-open' : ''}`}
			aria-label={t('sidebar.ariaLabel')}
		>
			<div className='sidebar__header'>
				<div className="sidebar__toggle">
					<IconButton
						icon={<PanelRightOpen size={18} />}
						variant="text"
						onClick={onToggle}
						title={isOpen ? t('sidebar.collapse') : t('sidebar.expand')}
					/>
				</div>
			</div>
			<div className="sidebar__add-section">
				<Button
					text={t('sidebar.addManually')}
					icon={<Plus size={16} />}
					size="small"
					variant="primary"
					onClick={onAdd}
					className="sidebar__add-button"
				/>
			</div>
			<nav className="sidebar__navigation">
				<NavButton
					text={t('sidebar.navHome')}
					icon={<Home size={18} />}
					isActive={activeView === 'home'}
					onClick={() => onNavigate('home')}
					count={linkCounts?.home ?? null}
				/>
				<NavButton
					text={t('sidebar.navFavorites')}
					icon={<Star size={18} />}
					isActive={activeView === 'favorites'}
					onClick={() => onNavigate('favorites')}
					count={linkCounts?.favorites ?? null}
				/>
				<NavButton
					text={t('sidebar.navTags')}
					icon={<Tag size={18} />}
					isActive={activeView === 'tags'}
					onClick={() => onNavigate('tags')}
					count={linkCounts?.tags ?? null}
				/>
				<NavButton
					text={t('sidebar.navGraph')}
					icon={<Network size={18} />}
					isActive={activeView === 'graph'}
					onClick={() => onNavigate('graph')}
				/>
			</nav>
		</aside>
	);
}

Sidebar.propTypes = {
	onAdd: PropTypes.func,
	isOpen: PropTypes.bool,
	onToggle: PropTypes.func,
	activeView: PropTypes.string,
	onNavigate: PropTypes.func,
	linkCounts: PropTypes.shape({
		home: PropTypes.number,
		favorites: PropTypes.number,
		tags: PropTypes.number,
	}),
};

Sidebar.defaultProps = {
	onAdd: () => { },
	isOpen: true,
	onToggle: () => { },
	activeView: 'home',
	onNavigate: () => { },
	linkCounts: null,
};
