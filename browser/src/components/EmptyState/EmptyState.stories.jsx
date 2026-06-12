import { Bookmark, Search, Star, Tag } from 'lucide-react';
import EmptyState from './EmptyState';
import Button from '@components/Button';

export default {
	title: 'Components/EmptyState',
	component: EmptyState,
};

export const NoLinks = {
	args: {
		icon: <Bookmark size={32} />,
		title: 'Save your first link',
		description: 'Click Save this page or add a URL manually.',
		action: <Button text="Save this page" variant="primary" size="small" />,
	},
};

export const NoResults = {
	args: {
		icon: <Search size={32} />,
		title: 'No links match',
		description: 'Try a different search term.',
	},
};

export const NoFavorites = {
	args: {
		icon: <Star size={32} />,
		title: 'No favorites yet',
		description: 'Star a link to find it here.',
	},
};

export const NoTags = {
	args: {
		icon: <Tag size={32} />,
		title: 'No tags yet',
		description: 'Add tags to organize your links.',
	},
};
