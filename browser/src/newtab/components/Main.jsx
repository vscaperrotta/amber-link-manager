import PropTypes from "prop-types";
import { useState, useMemo } from 'react';
import { useLinks } from '@utils/useLinks';
import Sidebar from '@components/Sidebar';
import EditModal from './EditModal.jsx';
import HomeView from '@newtab/views/HomeView.jsx';
import FavoritesView from '@newtab/views/FavoritesView.jsx';
import TagsView from '@newtab/views/TagsView.jsx';

export default function Main(props) {
	const { links, loading, deleteLink, updateLink, saveCustomLink } = useLinks();
	const [activeView, setActiveView] = useState('home');

	const linkCounts = useMemo(() => ({
		home: links.length,
		favorites: links.filter(l => l.metadata?.isFavorite).length,
		tags: new Set(links.flatMap(l => l.metadata?.tags || [])).size,
	}), [links]);
	const [editingLink, setEditingLink] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	function openEdit(link) {
		setEditingLink(link);
		setIsModalOpen(true);
	}

	function openAddModal() {
		setEditingLink(null);
		setIsModalOpen(true);
	}

	function closeModal() {
		setIsModalOpen(false);
		setEditingLink(null);
		setIsSaving(false);
		setSaveError(null);
	}

	async function handleUpdate(id, updates) {
		setIsSaving(true);
		setSaveError(null);
		try {
			await updateLink(id, updates);
			closeModal();
		} catch (err) {
			console.error('[Main] updateLink error', err);
			setIsSaving(false);
			setSaveError(true);
		}
	}

	async function handleAdd(updates) {
		setIsSaving(true);
		setSaveError(null);
		try {
			await saveCustomLink(updates);
			closeModal();
		} catch (err) {
			console.error('[Main] saveCustomLink error', err);
			setIsSaving(false);
			setSaveError(true);
		}
	}

	return (
		<main className={`newtab__main${isSidebarOpen ? ' sidebar-open' : ''}`}>
			<Sidebar
				onAdd={openAddModal}
				isOpen={isSidebarOpen}
				onToggle={() => setIsSidebarOpen(prev => !prev)}
				activeView={activeView}
				onNavigate={setActiveView}
				linkCounts={linkCounts}
			/>

			<section className="newtab__main-content">
				{activeView === 'home' && (
					<HomeView
						links={links}
						loading={loading}
						auth={props.auth}
						onEdit={openEdit}
						onDelete={deleteLink}
						updateLink={updateLink}
					/>
				)}
				{activeView === 'favorites' && (
					<FavoritesView
						links={links}
						loading={loading}
						auth={props.auth}
						onEdit={openEdit}
						onDelete={deleteLink}
						updateLink={updateLink}
					/>
				)}
				{activeView === 'tags' && (
					<TagsView
						links={links}
						updateLink={updateLink}
						onEdit={openEdit}
						onDelete={deleteLink}
					/>
				)}
				</section>

			{isModalOpen && (
				<EditModal
					isOpen={isModalOpen}
					link={editingLink}
					isSaving={isSaving}
					saveError={saveError}
					onClose={closeModal}
					onSubmit={(updates) => (editingLink ? handleUpdate(editingLink.id, updates) : handleAdd(updates))}
				/>
			)}
		</main>
	);
}

Main.propTypes = {
	auth: PropTypes.object
};

Main.defaultProps = {
	auth: null
};
