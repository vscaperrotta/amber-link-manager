import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '@components/Input';
import BaseModal from '@components/BaseModal';
import { t } from '@utils/i18n';

const FORM_ID = 'edit-modal-form';

export default function EditModal({ isOpen, link, isSaving, saveError, onClose, onSubmit }) {
	const [url, setUrl] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [tags, setTags] = useState('');

	useEffect(() => {
		if (isOpen && link) {
			setUrl(link.url || '');
			setTitle(link.title || '');
			setDescription(link.metadata?.description || '');
			setTags((link.metadata?.tags || []).map(tag => tag.toUpperCase()).join(', '));
		} else if (isOpen && !link) {
			setUrl('');
			setTitle('');
			setDescription('');
			setTags('');
		}
	}, [link, isOpen]);

	function handleSubmit(e) {
		e.preventDefault();
		if (!url) return;
		const parsedTags = tags
			.split(',')
			.map((t) => t.trim().toUpperCase())
			.filter(Boolean);
		const metadata = {
			...(link?.metadata || {}),
			description,
			tags: parsedTags,
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
				<p className="user-modal__error" role="alert">{t('editModal.saveError')}</p>
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
				<Input
					id="edit-modal-tags"
					type="text"
					placeholder={t('editModal.fieldTags')}
					ariaLabel={t('editModal.fieldTags')}
					value={tags}
					onChange={(e) => setTags(e.target.value)}
				/>
			</form>
		</BaseModal>
	);
}

EditModal.propTypes = {
	isOpen: PropTypes.bool,
	link: PropTypes.object,
	isSaving: PropTypes.bool,
	saveError: PropTypes.bool,
	onClose: PropTypes.func,
	onSubmit: PropTypes.func,
};

EditModal.defaultProps = {
	isOpen: false,
	link: null,
	isSaving: false,
	saveError: false,
	onClose: () => {},
	onSubmit: () => {},
};
