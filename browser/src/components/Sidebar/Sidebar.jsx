import { useState } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.scss';
import { Home, Star, Tag, PanelRightOpen, Plus, Folder, FolderOpen, Pencil, Trash2, ChevronRight } from 'lucide-react';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import NavButton from '@components/NavButton';
import { t } from '@utils/i18n';

function CollectionItem({ collection, isActive, isOpen, onClick, onRename, onDelete, onToggle }) {
	const [hovering, setHovering] = useState(false);

	function handleRename(e) {
		e.stopPropagation();
		const name = window.prompt(t('sidebar.collectionRenamePrompt'), collection.name);
		if (name && name.trim() && name.trim() !== collection.name) {
			onRename(collection.id, name.trim());
		}
	}

	function handleDelete(e) {
		e.stopPropagation();
		if (window.confirm(t('sidebar.collectionDeleteConfirm', { name: collection.name }))) {
			onDelete(collection.id);
		}
	}

	return (
		<div
			className={`sidebar__collection-item${isActive ? ' is-active' : ''}`}
			onClick={onClick}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === 'Enter' && onClick()}
		>
			<span className="sidebar__collection-icon">
				{isActive ? <FolderOpen size={15} /> : <Folder size={15} />}
			</span>
			<span className="sidebar__collection-name">{collection.name}</span>
			{hovering && isOpen && (
				<span className="sidebar__collection-actions">
					<button
						className="sidebar__collection-action-btn"
						onClick={handleRename}
						title={t('sidebar.collectionRename')}
						aria-label={t('sidebar.collectionRename')}
					>
						<Pencil size={12} />
					</button>
					<button
						className="sidebar__collection-action-btn sidebar__collection-action-btn--delete"
						onClick={handleDelete}
						title={t('sidebar.collectionDelete')}
						aria-label={t('sidebar.collectionDelete')}
					>
						<Trash2 size={12} />
					</button>
				</span>
			)}
		</div>
	);
}

CollectionItem.propTypes = {
	collection: PropTypes.object.isRequired,
	isActive: PropTypes.bool,
	isOpen: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

CollectionItem.defaultProps = {
	isActive: false,
	isOpen: false,
};

export default function Sidebar({
	onAdd, isOpen, onToggle, activeView, onNavigate, linkCounts,
	collections, activeCollectionId, onCollectionSelect, onCollectionAdd,
	onCollectionRename, onCollectionDelete,
}) {
	function handleAddCollection() {
		const name = window.prompt(t('sidebar.collectionAddPrompt'));
		if (name && name.trim()) {
			onCollectionAdd({ name: name.trim(), parentId: null });
		}
	}

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
					isActive={activeView === 'home' && !activeCollectionId}
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
			</nav>

			<div className="sidebar__collections">
				<div className="sidebar__collections-header">
					<span className="sidebar__collections-label">{t('sidebar.collectionsLabel')}</span>
					<button
						className="sidebar__collections-add-btn"
						onClick={handleAddCollection}
						title={t('sidebar.collectionAdd')}
						aria-label={t('sidebar.collectionAdd')}
					>
						<Plus size={13} />
					</button>
				</div>
				{collections.length === 0 ? (
					<p className="sidebar__collections-empty">{t('sidebar.collectionsEmpty')}</p>
				) : (
					<div className="sidebar__collections-list">
						{collections.map(col => (
							<CollectionItem
								key={col.id}
								collection={col}
								isActive={activeCollectionId === col.id}
								isOpen={isOpen}
								onClick={() => onCollectionSelect(col.id)}
								onRename={onCollectionRename}
								onDelete={onCollectionDelete}
							/>
						))}
					</div>
				)}
			</div>
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
	collections: PropTypes.array,
	activeCollectionId: PropTypes.string,
	onCollectionSelect: PropTypes.func,
	onCollectionAdd: PropTypes.func,
	onCollectionRename: PropTypes.func,
	onCollectionDelete: PropTypes.func,
};

Sidebar.defaultProps = {
	onAdd: () => { },
	isOpen: true,
	onToggle: () => { },
	activeView: 'home',
	onNavigate: () => { },
	linkCounts: null,
	collections: [],
	activeCollectionId: null,
	onCollectionSelect: () => { },
	onCollectionAdd: () => { },
	onCollectionRename: () => { },
	onCollectionDelete: () => { },
};
