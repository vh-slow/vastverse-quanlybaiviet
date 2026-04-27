export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string | null;
    description?: string | null;
    createdAt: string;
    isDeleted: boolean;
}
