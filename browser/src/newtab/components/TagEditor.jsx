import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';
import Pill from '@components/Pill';
import { t } from '@utils/i18n';

export default function TagEditor(props) {
	const [inputValue, setInputValue] = useState('');
	const [isAdding, setIsAdding] = useState(false);
	const [suggestedTags, setSuggestedTags] = useState(props.allTags);
	const inputRef = useRef(null);

	function removeTag(tag) {
		props.onSave(props.tags.filter(t => t !== tag));
	}

	function addTag(value = inputValue) {
		const newTag = value.trim().toUpperCase();
		if (newTag && !props.tags.includes(newTag)) {
			props.onSave([...props.tags, newTag]);
		}
		setInputValue('');
		setIsAdding(false);
	}

	function handleKeyDown(e) {
		setSuggestedTags(props.allTags.filter(t => t.toUpperCase().includes(inputValue.toUpperCase())));

		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			setInputValue('');
			setIsAdding(false);
		}
	}

	function startAdding() {
		setIsAdding(true);
		setTimeout(() => inputRef.current?.focus(), 0);
	}

	return (
		<div className="tag-editor">
			{props.tags.map(tag => (
				<Pill key={tag} label={tag} onRemove={removeTag} />
			))}
			{isAdding ? (
				<div className="tag-editor__input-wrapper">
					<input
						ref={inputRef}
						className="tag-editor__input"
						type="text"
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
						onClick={() => setSuggestedTags(props.allTags)}
						onKeyDown={handleKeyDown}
						onBlur={addTag}
						placeholder={t('tagEditor.placeholder')}
					/>
					{suggestedTags.length > 0 && (
						<div className="tag-editor__suggestions">
							{suggestedTags.map(s => (
								<button
									key={s}
									type="button"
									className="tag-editor__suggestion"
									onMouseDown={() => addTag(s)}
								>
									{s}
								</button>
							))}
						</div>
					)}
				</div>
			) : (
				<button type="button" className="tag-editor__add" onClick={startAdding} aria-label={t('tagEditor.addAriaLabel')}>
					<Plus size={10} />
				</button>
			)}
		</div >
	);
}

TagEditor.propTypes = {
	allTags: PropTypes.arrayOf(PropTypes.string),
	tags: PropTypes.arrayOf(PropTypes.string),
	onSave: PropTypes.func,
};

TagEditor.defaultProps = {
	allTags: [],
	tags: [],
	onSave: () => { },
};