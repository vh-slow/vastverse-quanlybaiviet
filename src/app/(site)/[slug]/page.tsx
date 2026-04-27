import { Metadata, ResolvingMetadata } from 'next';
import PostDetailClient from './PostDetailClient';

type Props = {
    params: { slug: string };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    try {
        const API_URL =
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const res = await fetch(`${API_URL}/api/books/${params.slug}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return { title: 'Không tìm thấy bài viết | VastVerse' };
        }

        const book = await res.json();

        const imageUrl = book.thumbnail
            ? `${API_URL.replace('/api', '')}${book.thumbnail}`
            : 'https://placehold.co/1200x630/e0e7ff/3730a3?text=VastVerse';

        return {
            title: `${book.title} | VastVerse`,
            description:
                book.summary || 'Đọc bài viết cực hay trên nền tảng VastVerse.',
            openGraph: {
                title: book.title,
                description: book.summary || '',
                images: [{ url: imageUrl, width: 1200, height: 630 }],
            },
        };
    } catch (error) {
        console.error('Lỗi lấy Metadata SEO:', error);

        return {
            title: 'Lỗi tải trang | VastVerse',
        };
    }
}

export default function PostPage({ params }: Props) {
    return <PostDetailClient />;
}
