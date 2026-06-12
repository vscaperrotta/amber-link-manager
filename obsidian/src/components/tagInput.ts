import { t } from '../utils/i18n';

export default function renderTagInput(
  container: HTMLElement,
  allTags: string[],
  onSelect: (tag: string) => void,
  onCancel?: () => void
): HTMLElement {
  const wrapper = container.createDiv({ cls: 'obs-amber-tag-input-wrapper' });

  const input = wrapper.createEl('input', {
    type: 'text',
    cls: 'obs-amber-tag-input',
    placeholder: t('tagInput.placeholder'),
  });

  const suggestionsList = wrapper.createEl('ul', {
    cls: 'obs-amber-tag-suggestions hidden',
  });

  let focusedIndex = -1;

  const getSuggestionItems = (): HTMLElement[] =>
    Array.from(suggestionsList.querySelectorAll('li')) as HTMLElement[];

  const setFocus = (index: number) => {
    const items = getSuggestionItems();
    items.forEach((el, i) => el.toggleClass('is-focused', i === index));
    focusedIndex = index;
  };

  const updateSuggestions = (typed: string) => {
    suggestionsList.empty();
    focusedIndex = -1;

    const upper = typed.toUpperCase();
    const matches = typed.length > 0
      ? allTags.filter((t) => t.includes(upper))
      : allTags;

    if (matches.length === 0) {
      suggestionsList.addClass('hidden');
      return;
    }

    matches.forEach((tag) => {
      const li = suggestionsList.createEl('li', { text: tag });
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        dismiss();
        onSelect(tag);
      });
    });

    suggestionsList.removeClass('hidden');
  };

  const dismiss = () => {
    suggestionsList.addClass('hidden');
    document.removeEventListener('mousedown', onOutsideClick);
  };

  const cancel = () => {
    dismiss();
    onCancel?.();
  };

  const onOutsideClick = (e: MouseEvent) => {
    if (!wrapper.contains(e.target as Node)) {
      cancel();
    }
  };

  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
    updateSuggestions(input.value);
    document.addEventListener('mousedown', onOutsideClick);
  });

  input.addEventListener('keydown', (e) => {
    const items = getSuggestionItems();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocus(Math.min(focusedIndex + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocus(Math.max(focusedIndex - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && items[focusedIndex]) {
        const tag = items[focusedIndex].textContent ?? '';
        dismiss();
        onSelect(tag);
      } else if (input.value.trim()) {
        const tag = input.value.trim().toUpperCase();
        dismiss();
        onSelect(tag);
      }
    } else if (e.key === 'Escape') {
      cancel();
    }
  });

  input.focus();
  updateSuggestions('');
  document.addEventListener('mousedown', onOutsideClick);

  return wrapper;
}
