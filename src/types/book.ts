import { Category } from './category';
import { User } from './user';

export interface Book {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string | null;
    summary?: string | null;
    content?: string;
    viewCount: number;
    status: number;
    createdAt: string;
    isFavorited?: boolean;
    favoriteCount?: number;
    isDeleted?: boolean;

    category?: Partial<Category>;
    user?: Partial<User>;
}
