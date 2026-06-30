import { useState, useRef, useCallback, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';
import Pill from '@components/Pill';
import { t } from '@utils/i18n';

export default function TagEditor(props) {
	const [inputValue, setInputValue] = useState('');
	const [isAdding, setIsAdding] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [dropdownPos, setDropdownPos] = useState({});
	const inputRef = useRef(null);
	const wrapperRef = useRef(null);
	const listId = useId();

	const computeSuggestions = useCallback((value) => {
		const needle = value.toUpperCase().trim();
		return props.allTags.filter(tag =>
			!props.tags.includes(tag) &&
			(needle === '' || tag.includes(needle))
		);
	}, [props.allTags, props.tags]);

	const updateDropdownPos = useCallback(() => {
		if (!wrapperRef.current) return;
		const rect = wrapperRef.current.getBoundingClientRect();
		const spaceBelow = window.innerHeight - rect.bottom;
		const openUpward = spaceBelow < 160 && rect.top > spaceBelow;

		setDropdownPos(openUpward
			? { bottom: window.innerHeight - rect.top + 4, top: undefined, left: rect.left, minWidth: Math.max(rect.width, 120) }
			: { top: rect.bottom + 4, bottom: undefined, left: rect.left, minWidth: Math.max(rect.width, 120) }
		);
	}, []);

	// Reposition on scroll / resize while open
	useEffect(() => {
		if (!isAdding) return;
		window.addEventListener('scroll', updateDropdownPos, true);
		window.addEventListener('resize', updateDropdownPos);
		return () => {
			window.removeEventListener('scroll', updateDropdownPos, true);
			window.removeEventListener('resize', updateDropdownPos);
		};
	}, [isAdding, updateDropdownPos]);

	// Scroll active suggestion into view
	useEffect(() => {
		if (activeIndex < 0) return;
		document.getElementById(`${listId}-opt-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
	}, [activeIndex, listId]);

	function removeTag(tag) {
		props.onSave(props.tags.filter(t => t !== tag));
	}

	function commitTag(value = inputValue) {
		const newTag = value.trim().toUpperCase();
		if (newTag && !props.tags.includes(newTag)) {
			props.onSave([...props.tags, newTag]);
		}
		setInputValue('');
		setSuggestions([]);
		setActiveIndex(-1);
		setIsAdding(false);
	}

	function cancel() {
		setInputValue('');
		setSuggestions([]);
		setActiveIndex(-1);
		setIsAdding(false);
	}

	function handleChange(e) {
		const value = e.target.value;
		setInputValue(value);
		setActiveIndex(-1);
		setSuggestions(computeSuggestions(value));
		updateDropdownPos();
	}

	function handleKeyDown(e) {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setActiveIndex(prev => Math.max(prev - 1, -1));
				break;
			case 'Enter':
				e.preventDefault();
				if (activeIndex >= 0 && activeIndex < suggestions.length) {
					commitTag(suggestions[activeIndex]);
				} else {
					commitTag();
				}
				break;
			case 'Escape':
				e.preventDefault();
				e.stopPropagation();
				cancel();
				break;
			default:
				break;
		}
	}

	function startAdding() {
		setIsAdding(true);
		setTimeout(() => {
			inputRef.current?.focus();
			const sugg = computeSuggestions('');
			setSuggestions(sugg);
			updateDropdownPos();
		}, 0);
	}

	return (
		<div className="tag-editor">
			{props.tags.map(tag => (
				<Pill key={tag} label={tag} onRemove={removeTag} />
			))}
			{isAdding ? (
				<div ref={wrapperRef} className="tag-editor__input-wrapper">
					<input
						ref={inputRef}
						id={`${listId}-input`}
						className="tag-editor__input"
						type="text"
						value={inputValue}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						onBlur={commitTag}
						placeholder={t('tagEditor.placeholder')}
						role="combobox"
						aria-autocomplete="list"
						aria-expanded={suggestions.length > 0}
						aria-haspopup="listbox"
						aria-controls={`${listId}-list`}
						aria-activedescendant={activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
						autoComplete="off"
					/>
					{suggestions.length > 0 && createPortal(
						<div
							id={`${listId}-list`}
							className="tag-editor__suggestions"
							style={{
								top: dropdownPos.top,
								bottom: dropdownPos.bottom,
								left: dropdownPos.left,
								minWidth: dropdownPos.minWidth,
							}}
							role="listbox"
						>
							{suggestions.map((s, i) => (
								<button
									key={s}
									id={`${listId}-opt-${i}`}
									type="button"
									className={`tag-editor__suggestion${i === activeIndex ? ' tag-editor__suggestion--active' : ''}`}
									onMouseDown={(e) => { e.preventDefault(); commitTag(s); }}
									role="option"
									aria-selected={i === activeIndex}
								>
									{s}
								</button>
							))}
						</div>,
						document.body
					)}
				</div>
			) : (
				<button
					type="button"
					className="tag-editor__add"
					onClick={startAdding}
					aria-label={t('tagEditor.addAriaLabel')}
				>
					<Plus size={10} />
				</button>
			)}
		</div>
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
	onSave: () => {},
};
