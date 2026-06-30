export type Metadata = {
  description?: string;
  thumbnail?: string;
  favicon?: string;
  siteName?: string;
  tags?: string[];
  isFavorite?: boolean;
  isRead?: boolean;
  canonicalUrl?: string;
  author?: string;
  publishedDate?: string;
  readingTime?: number;
};

export type LinkEntry = {
  id: string;
  url: string;
  title: string;
  savedAt: number;
  updatedAt?: number;
  metadata?: Metadata;
};
