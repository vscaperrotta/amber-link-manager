import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.scss';
import { Home, Star, Tag, PanelRightOpen, Plus, Folder, FolderOpen, Pencil, Trash2 } from 'lucide-react';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import NavButton from '@components/NavButton';
import BaseModal from '@components/BaseModal';
import Input from '@components/Input';
import { t } from '@utils/i18n';
import { getCollectionColor, COLLECTION_COLORS } from '@utils/collectionColors';

// ── Dialog types ────────────────────────────────────────────────────────────
// null | { type: 'add' } | { type: 'rename', collection } | { type: 'delete', collection }

function CollectionItem({ collection, isActive, isOpen, onSelect, onRename, onDelete, count, colorFallback }) {
	const [hovering, setHovering] = useState(false);
	const color = collection.color || colorFallback;

	return (
		<div
			className={`sidebar__collection-item${isActive ? ' is-active' : ''}`}
			style={{ '--col-color': color }}
			onClick={onSelect}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			role="button"
			tabIndex={0}
			title={collection.name}
			onKeyDown={(e) => e.key === 'Enter' && onSelect()}
		>
			<span className="sidebar__collection-dot" />
			<span className="sidebar__collection-icon">
				{isActive ? <FolderOpen size={15} /> : <Folder size={15} />}
			</span>
			<span
				className="sidebar__collection-name"
				onDoubleClick={(e) => { e.stopPropagation(); onRename(); }}
				title={t('sidebar.collectionRename')}
			>
				{collection.name}
			</span>
			{count > 0 && !hovering && (
				<span className="sidebar__collection-count">{count}</span>
			)}
			{hovering && isOpen && (
				<span className="sidebar__collection-actions">
					<button
						className="sidebar__collection-action-btn"
						onClick={(e) => { e.stopPropagation(); onRename(); }}
						title={t('sidebar.collectionRename')}
						aria-label={t('sidebar.collectionRename')}
					>
						<Pencil size={12} />
					</button>
					<button
						className="sidebar__collection-action-btn sidebar__collection-action-btn--delete"
						onClick={(e) => { e.stopPropagation(); onDelete(); }}
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
	onSelect: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	count: PropTypes.number,
	colorFallback: PropTypes.string,
};

CollectionItem.defaultProps = {
	isActive: false,
	isOpen: false,
	count: 0,
	colorFallback: null,
};

export default function Sidebar({
	onAdd, isOpen, onToggle, activeView, onNavigate, linkCounts,
	collections, activeCollectionId, onCollectionSelect, onCollectionAdd,
	onCollectionRename, onCollectionDelete, collectionCounts,
}) {
	const [dialog, setDialog] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [selectedColor, setSelectedColor] = useState(null);
	const inputRef = useRef(null);

	// Focus input when dialog opens
	useEffect(() => {
		if (dialog && dialog.type !== 'delete') {
			const id = requestAnimationFrame(() => inputRef.current?.focus());
			return () => cancelAnimationFrame(id);
		}
	}, [dialog]);

	function openAddDialog() {
		setInputValue('');
		setDialog({ type: 'add' });
	}

	function openRenameDialog(collection, colorFallback) {
		setInputValue(collection.name);
		setSelectedColor(collection.color || colorFallback || COLLECTION_COLORS[0]);
		setDialog({ type: 'rename', collection });
	}

	function openDeleteDialog(collection) {
		setDialog({ type: 'delete', collection });
	}

	function closeDialog() {
		setDialog(null);
		setInputValue('');
		setSelectedColor(null);
	}

	function handleAddConfirm() {
		const name = inputValue.trim();
		if (!name) return;
		onCollectionAdd({ name, parentId: null });
		closeDialog();
	}

	function handleRenameConfirm() {
		const name = inputValue.trim();
		if (!name) { closeDialog(); return; }
		const nameChanged = name !== dialog.collection.name;
		const colorChanged = selectedColor !== dialog.collection.color;
		if (!nameChanged && !colorChanged) { closeDialog(); return; }
		onCollectionRename(dialog.collection.id, name, selectedColor);
		closeDialog();
	}

	function handleDeleteConfirm() {
		onCollectionDelete(dialog.collection.id);
		closeDialog();
	}

	function handleInputKeyDown(e, onConfirm) {
		if (e.key === 'Enter') { e.preventDefault(); onConfirm(); }
		if (e.key === 'Escape') closeDialog();
	}

	return (
		<>
			<aside
				className={`sidebar${isOpen ? ' sidebar-open' : ''}`}
				aria-label={t('sidebar.ariaLabel')}
			>
				<div className='sidebar__header'>
					<p className='sidebar__header-menu'>Menu</p>
					<div className="sidebar__toggle">
						<IconButton
							icon={<PanelRightOpen size={18} />}
							variant="text"
							onClick={onToggle}
							title={t('sidebar.collapse')}
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
					<button
						className="sidebar__nav-toggle"
						onClick={onToggle}
						title={t('sidebar.expand')}
						aria-label={t('sidebar.expand')}
					>
						<PanelRightOpen size={18} />
					</button>
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
							onClick={openAddDialog}
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
							{collections.map((col, index) => (
								<CollectionItem
									key={col.id}
									collection={col}
									isActive={activeCollectionId === col.id}
									isOpen={isOpen}
									count={collectionCounts?.[col.id] ?? 0}
									colorFallback={getCollectionColor(index)}
									onSelect={() => onCollectionSelect(col.id)}
									onRename={() => openRenameDialog(col, getCollectionColor(index))}
									onDelete={() => openDeleteDialog(col)}
								/>
							))}
						</div>
					)}
				</div>
			</aside>

			{/* ── Add dialog ── */}
			<BaseModal
				isOpen={dialog?.type === 'add'}
				title={t('sidebar.collectionAdd')}
				onClose={closeDialog}
				primaryAction={{
					label: t('common.add'),
					onClick: handleAddConfirm,
					disabled: !inputValue.trim(),
				}}
				secondaryAction={{ label: t('common.cancel'), onClick: closeDialog }}
			>
				<Input
					ref={inputRef}
					id="sidebar-collection-name"
					type="text"
					placeholder={t('sidebar.collectionNamePlaceholder')}
					ariaLabel={t('sidebar.collectionNamePlaceholder')}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => handleInputKeyDown(e, handleAddConfirm)}
				/>
			</BaseModal>

			{/* ── Rename dialog ── */}
			<BaseModal
				isOpen={dialog?.type === 'rename'}
				title={t('sidebar.collectionRename')}
				onClose={closeDialog}
				primaryAction={{
					label: t('common.save'),
					onClick: handleRenameConfirm,
					disabled: !inputValue.trim(),
				}}
				secondaryAction={{ label: t('common.cancel'), onClick: closeDialog }}
			>
				<Input
					ref={inputRef}
					id="sidebar-collection-rename"
					type="text"
					placeholder={t('sidebar.collectionNamePlaceholder')}
					ariaLabel={t('sidebar.collectionNamePlaceholder')}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => handleInputKeyDown(e, handleRenameConfirm)}
				/>
				<div className="collection-color-swatches">
					{COLLECTION_COLORS.map(c => (
						<button
							key={c}
							type="button"
							className={`collection-color-swatch${selectedColor === c ? ' is-selected' : ''}`}
							style={{ '--swatch-color': c }}
							onClick={() => setSelectedColor(c)}
							aria-label={c}
						/>
					))}
				</div>
			</BaseModal>

			{/* ── Delete dialog ── */}
			<BaseModal
				isOpen={dialog?.type === 'delete'}
				title={t('sidebar.collectionDelete')}
				onClose={closeDialog}
				message={t('sidebar.collectionDeleteConfirm', { name: dialog?.collection?.name ?? '' })}
				primaryAction={{
					label: t('common.delete'),
					variant: 'danger',
					onClick: handleDeleteConfirm,
				}}
				secondaryAction={{ label: t('common.cancel'), onClick: closeDialog }}
			/>
		</>
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
	collectionCounts: PropTypes.object,
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
	collectionCounts: {},
};
