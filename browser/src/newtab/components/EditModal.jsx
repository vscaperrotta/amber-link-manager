import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '@components/Input';
import BaseModal from '@components/BaseModal';
import TagEditor from './TagEditor.jsx';
import { t } from '@utils/i18n';

const FORM_ID = 'edit-modal-form';

export default function EditModal({ isOpen, link, isSaving, saveError, allTags, collections, onClose, onSubmit }) {
	const [url, setUrl] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [note, setNote] = useState('');
	const [tags, setTags] = useState([]);
	const [collectionId, setCollectionId] = useState('');

	useEffect(() => {
		if (isOpen && link) {
			setUrl(link.url || '');
			setTitle(link.title || '');
			setDescription(link.metadata?.description || '');
			setNote(link.metadata?.note || '');
			setTags((link.metadata?.tags || []).map(tag => tag.toUpperCase()));
			setCollectionId(link.metadata?.collectionId || '');
		} else if (isOpen && !link) {
			setUrl('');
			setTitle('');
			setDescription('');
			setNote('');
			setTags([]);
			setCollectionId('');
		}
	}, [link, isOpen]);

	function handleSubmit(e) {
		e.preventDefault();
		if (!url) return;
		const metadata = {
			...(link?.metadata || {}),
			description,
			note: note || undefined,
			tags,
			collectionId: collectionId || null,
		};
		onSubmit({ url, title, metadata });
	}

	const isEditing = Boolean(link);

	return (
		<BaseModal
			isOpen={isOpen}
			title={isEditing ? t('editModal.titleEdit') : t('editModal.titleAdd')}
			onClose={onClose}
			primaryAction={{
				label: isEditing ? t('common.save') : t('common.add'),
				type: 'submit',
				form: FORM_ID,
				loading: isSaving,
			}}
			secondaryAction={{ label: t('common.cancel'), onClick: onClose }}
		>
			{saveError && (
				<p className="user-modal__error" role="alert">
					{saveError === 'duplicate' ? t('editModal.duplicateError') : t('editModal.saveError')}
				</p>
			)}
			<form id={FORM_ID} className="modal__form" onSubmit={handleSubmit}>
				<Input
					id="edit-modal-title"
					type="text"
					placeholder={t('editModal.fieldTitle')}
					ariaLabel={t('editModal.fieldTitle')}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<Input
					id="edit-modal-url"
					type="url"
					placeholder={t('editModal.fieldUrl')}
					ariaLabel={t('editModal.fieldUrl')}
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
				<div className="input">
					<textarea
						id="edit-modal-description"
						className="input__field"
						placeholder={t('editModal.fieldDescription')}
						aria-label={t('editModal.fieldDescription')}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={3}
					/>
				</div>
				<div className="input">
					<textarea
						id="edit-modal-note"
						className="input__field input__field--note"
						placeholder={t('editModal.fieldNotePlaceholder')}
						aria-label={t('editModal.fieldNote')}
						value={note}
						onChange={(e) => setNote(e.target.value)}
						rows={3}
					/>
				</div>
				{collections.length > 0 && (
					<div className="input">
						<select
							id="edit-modal-collection"
							className="input__field input__field--select"
							aria-label={t('editModal.fieldCollection')}
							value={collectionId}
							onChange={(e) => setCollectionId(e.target.value)}
						>
							<option value="">{t('editModal.collectionNone')}</option>
							{collections.map(col => (
								<option key={col.id} value={col.id}>{col.name}</option>
							))}
						</select>
					</div>
				)}
				<div className="modal__tags-row">
					<TagEditor
						tags={tags}
						allTags={allTags}
						onSave={setTags}
					/>
				</div>
			</form>
		</BaseModal>
	);
}

EditModal.propTypes = {
	isOpen: PropTypes.bool,
	link: PropTypes.object,
	isSaving: PropTypes.bool,
	saveError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	allTags: PropTypes.arrayOf(PropTypes.string),
	collections: PropTypes.array,
	onClose: PropTypes.func,
	onSubmit: PropTypes.func,
};

EditModal.defaultProps = {
	isOpen: false,
	link: null,
	isSaving: false,
	saveError: false,
	allTags: [],
	collections: [],
	onClose: () => {},
	onSubmit: () => {},
};
