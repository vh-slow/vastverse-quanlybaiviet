'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiBook } from '@/src/services/book';
import { apiComment } from '@/src/services/comment';
import { Book } from '@/src/types';
import { apiFavorite, BASE_URL } from '@/src/services';
import { formatDate, formatDateTime } from '@/src/utils/formatters';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/src/context/AuthContext';
import PageHeader from '@/src/components/site/PageHeader';

export default function PostDetailClient() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { user } = useAuth();

    const [book, setBook] = useState<Book | null>(null);
    const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProcessingFav, setIsProcessingFav] = useState(false);

    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null
    );
    const [editCommentText, setEditCommentText] = useState('');

    const fetchComments = async (bookId: number) => {
        try {
            const data = await apiComment.getCommentsByBook(bookId);
            setComments(data);
        } catch (error) {
            console.error('Lỗi tải bình luận:', error);
        }
    };

    useEffect(() => {
        const loadPageData = async () => {
            setLoading(true);
            try {
                const bookData = await apiBook.getPublicBookBySlug(slug);
                setBook(bookData);

                if (bookData && bookData.id) {
                    Promise.all([
                        apiBook.getRelatedBooks(bookData.id),
                        apiBook.incrementView(bookData.id),
                        fetchComments(bookData.id),
                    ]).then(([relatedData]) => {
                        setRelatedBooks(relatedData);
                    });
                }
            } catch (error) {
                console.error('Error loading post:', error);
                toast.error('Không tìm thấy bài viết!');
            } finally {
                setLoading(false);
            }
        };

        if (slug) loadPageData();
    }, [slug]);

    const handleToggleFavorite = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để sử dụng tính năng này!');
            router.push('/login');
            return;
        }
        if (isProcessingFav || !book) return;

        setIsProcessingFav(true);
        try {
            const result = await apiFavorite.toggleFavorite(book.id);
            setBook({
                ...book,
                isFavorited: result.isFavorited,
                favoriteCount: result.favoriteCount,
            });
            if (result.isFavorited) {
                toast.success('Đã thêm vào danh sách yêu thích');
            }
        } catch (error) {
            toast.error('Thao tác thất bại, vui lòng thử lại!');
        } finally {
            setIsProcessingFav(false);
        }
    };

    const handlePostComment = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để bình luận!');
            router.push('/login');
            return;
        }
        if (!newComment.trim() || !book) return;

        setIsSubmittingComment(true);
        try {
            await apiComment.createComment({
                bookId: book.id,
                content: newComment.trim(),
            });
            setNewComment('');
            toast.success('Đã đăng bình luận!');
            fetchComments(book.id);
        } catch (error) {
            toast.error('Không thể đăng bình luận lúc này.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
        try {
            await apiComment.deleteComment(commentId);
            toast.success('Đã xóa bình luận!');
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (error) {
            toast.error('Xóa bình luận thất bại!');
        }
    };

    const handleStartEdit = (comment: any) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.content);
    };

    const handleUpdateComment = async (commentId: number) => {
        if (!editCommentText.trim()) return;
        try {
            await apiComment.updateComment(commentId, {
                content: editCommentText.trim(),
            });
            toast.success('Đã cập nhật bình luận!');
            setEditingCommentId(null);
            fetchComments(book!.id);
        } catch (error) {
            toast.error('Cập nhật thất bại!');
        }
    };
    const handleShare = (platform: string) => {
        const currentUrl = encodeURIComponent(window.location.href);
        const postTitle = encodeURIComponent(
            book?.title || 'Bài viết cực hay trên VastVerse'
        );

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${postTitle}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
                break;
            default:
                return;
        }

        window.open(
            shareUrl,
            '_blank',
            'width=600,height=400,left=200,top=200'
        );
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Đã sao chép đường dẫn bài viết!');
        } catch (err) {
            toast.error('Không thể sao chép đường dẫn!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600"></i>
                    <p className="text-gray-500 font-medium">
                        Đang tải nội dung bài viết...
                    </p>
                </div>
            </div>
        );
    }

    if (!book) return null;

    const imageUrl = book.thumbnail
        ? `${BASE_URL.replace('/api/', '')}${book.thumbnail}`
        : 'https://placehold.co/800x450/f1f5f9/334155?text=Thumbnail';

    const breadcrumbs = [
        { name: 'Trang chủ', href: '/' },
        { name: loading ? 'Loading...' : book ? book.title : 'Book Not Found' },
    ];

    return (
        <>
            <PageHeader
                title={book?.title || 'Book Not Found'}
                breadcrumbs={breadcrumbs}
            />

            <section className="py-12 lg:py-16 bg-gray-50 animate-fade-in-up">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* --- MAIN ARTICLE COLUMN --- */}
                    <article className="col-span-12 lg:col-span-8">
                        <div className="bg-white p-6 md:p-10 rounded-2xl border border-gray-200 shadow-sm mb-8">
                            {/* Thumbnail */}
                            <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-sm border border-gray-100">
                                <img
                                    src={imageUrl}
                                    alt={book.title}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            'https://placehold.co/800x450/f1f5f9/334155?text=Thumbnail';
                                    }}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <header className="mb-8 border-b border-gray-100 pb-6">
                                <Link
                                    href={`/?categoryId=${book.category?.id}`}
                                    className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg mb-4 hover:bg-blue-100 transition-colors"
                                >
                                    {book.category?.name || 'Chưa phân loại'}
                                </Link>

                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight flex-1">
                                        {book.title}
                                    </h1>
                                    <button
                                        type="button"
                                        onClick={handleToggleFavorite}
                                        disabled={isProcessingFav}
                                        className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all group shadow-sm
                                        ${
                                            book.isFavorited
                                                ? 'bg-pink-50 text-pink-600 border-pink-200'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200'
                                        }`}
                                    >
                                        <i
                                            className={`fa-heart group-hover:scale-110 transition-transform ${book.isFavorited ? 'fa-solid' : 'fa-regular'}`}
                                        ></i>
                                        <span>
                                            Yêu thích ({book.favoriteCount || 0}
                                            )
                                        </span>
                                    </button>
                                </div>

                                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/u/${book.user?.username}`}
                                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                            title={`Xem hồ sơ của ${book.user?.fullName}`}
                                        >
                                            <img
                                                src={
                                                    book.user?.avatar
                                                        ? `${BASE_URL.replace('/api/', '')}${book.user.avatar}`
                                                        : `https://placehold.co/32x32/e0e7ff/3730a3?text=${book.user?.fullName?.charAt(0) || 'U'}`
                                                }
                                                alt={book.user?.fullName}
                                                className="w-7 h-7 rounded-full object-cover border border-gray-200"
                                            />
                                            <span className="font-bold text-gray-700 hover:text-blue-600 transition-colors">
                                                {book.user?.fullName ||
                                                    'Tác giả'}
                                            </span>
                                        </Link>
                                    </div>
                                    <span className="hidden sm:inline text-gray-300">
                                        |
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <i className="fa-regular fa-calendar"></i>
                                        <span className="font-medium">
                                            {formatDate(book.createdAt)}
                                        </span>
                                    </div>
                                    <span className="hidden sm:inline text-gray-300">
                                        |
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <i className="fa-regular fa-eye"></i>
                                        <span className="font-medium">
                                            {book.viewCount.toLocaleString()}{' '}
                                            lượt xem
                                        </span>
                                    </div>
                                </div>
                            </header>

                            {/* Main Content */}
                            <div
                                className="prose prose-lg prose-blue max-w-none prose-img:rounded-xl prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-p:my-2 prose-headings:my-4 prose-ul:my-2"
                                dangerouslySetInnerHTML={{
                                    __html: book.content || '',
                                }}
                            ></div>

                            <footer className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-bold text-gray-700 mr-1">
                                        <i className="fa-solid fa-tags text-gray-400"></i>{' '}
                                        Thẻ:
                                    </span>
                                    <Link
                                        href={`/?categoryId=${book.category?.id}`}
                                        className="text-xs bg-gray-100 font-medium text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        {book.category?.name}
                                    </Link>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-700 mr-1">
                                        Chia sẻ:
                                    </span>

                                    <button
                                        onClick={() => handleShare('facebook')}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                                        title="Chia sẻ lên Facebook"
                                    >
                                        <i className="fab fa-facebook-f"></i>
                                    </button>

                                    <button
                                        onClick={() => handleShare('twitter')}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
                                        title="Chia sẻ lên Twitter"
                                    >
                                        <i className="fab fa-twitter"></i>
                                    </button>

                                    <button
                                        onClick={() => handleShare('linkedin')}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white transition-colors"
                                        title="Chia sẻ lên LinkedIn"
                                    >
                                        <i className="fab fa-linkedin-in"></i>
                                    </button>

                                    <button
                                        onClick={handleCopyLink}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-white transition-colors ml-1"
                                        title="Sao chép đường dẫn bài viết"
                                    >
                                        <i className="fa-solid fa-link text-sm"></i>
                                    </button>
                                </div>
                            </footer>
                        </div>

                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-extrabold text-gray-900 mb-6">
                                Bình luận ({comments.length})
                            </h3>

                            <div className="flex gap-4 mb-10">
                                <img
                                    src={
                                        user?.avatar
                                            ? `${BASE_URL.replace('/api/', '')}${user.avatar}`
                                            : `https://placehold.co/48x48/e0e7ff/3730a3?text=${user?.fullName?.charAt(0) || 'U'}`
                                    }
                                    alt="My Avatar"
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 border border-gray-200 shadow-sm"
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) =>
                                            setNewComment(e.target.value)
                                        }
                                        placeholder={
                                            user
                                                ? 'Thêm bình luận của bạn...'
                                                : 'Vui lòng đăng nhập để bình luận'
                                        }
                                        disabled={!user || isSubmittingComment}
                                        className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none min-h-[100px] text-sm"
                                    />
                                    <div className="flex justify-end mt-3">
                                        <button
                                            onClick={handlePostComment}
                                            disabled={
                                                !user ||
                                                !newComment.trim() ||
                                                isSubmittingComment
                                            }
                                            className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
                                        >
                                            {isSubmittingComment ? (
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                            ) : (
                                                'Đăng bình luận'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {comments.length === 0 ? (
                                    <p className="text-center text-gray-400 italic py-4 border-t border-gray-50">
                                        Chưa có bình luận nào. Hãy là người đầu
                                        tiên chia sẻ suy nghĩ!
                                    </p>
                                ) : (
                                    comments.map((comment) => {
                                        const isMyComment =
                                            user && user.id === comment.user.id;
                                        const isEditing =
                                            editingCommentId === comment.id;

                                        return (
                                            <div
                                                key={comment.id}
                                                className="flex gap-3 sm:gap-4 border-t border-gray-50 pt-6 group"
                                            >
                                                <Link
                                                    href={`/author/${comment.user.id}`}
                                                    className="shrink-0 hover:opacity-80 transition-opacity"
                                                >
                                                    <img
                                                        src={
                                                            comment.user.avatar
                                                                ? `${BASE_URL.replace('/api/', '')}${comment.user.avatar}`
                                                                : `https://placehold.co/48x48/f3f4f6/6b7280?text=${comment.user.fullName.charAt(0)}`
                                                        }
                                                        alt={
                                                            comment.user
                                                                .fullName
                                                        }
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200"
                                                    />
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-sm">
                                                        <div className="flex justify-between items-start gap-2 mb-2">
                                                            <div>
                                                                <Link
                                                                    href={`/u/${comment?.user?.username}`}
                                                                    className="font-bold text-gray-900 text-sm"
                                                                >
                                                                    {
                                                                        comment
                                                                            .user
                                                                            .fullName
                                                                    }
                                                                </Link>
                                                                <p className="text-[11px] text-gray-500 mt-0.5">
                                                                    @
                                                                    {
                                                                        comment
                                                                            .user
                                                                            .username
                                                                    }
                                                                </p>
                                                            </div>
                                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                                {formatDateTime(
                                                                    comment.createdAt
                                                                )}
                                                            </span>
                                                        </div>

                                                        {isEditing ? (
                                                            <div className="mt-2">
                                                                <textarea
                                                                    value={
                                                                        editCommentText
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setEditCommentText(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none min-h-[80px]"
                                                                />
                                                                <div className="flex justify-end gap-2 mt-3">
                                                                    <button
                                                                        onClick={() =>
                                                                            setEditingCommentId(
                                                                                null
                                                                            )
                                                                        }
                                                                        className="px-4 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-300"
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleUpdateComment(
                                                                                comment.id
                                                                            )
                                                                        }
                                                                        className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700"
                                                                    >
                                                                        Lưu
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                                                                {
                                                                    comment.content
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {!isEditing && (
                                                        <div className="flex items-center gap-4 mt-2 ml-2 text-xs font-bold text-gray-500">
                                                            <button className="hover:text-blue-600 transition-colors">
                                                                Thích
                                                            </button>
                                                            <button className="hover:text-blue-600 transition-colors">
                                                                Phản hồi
                                                            </button>

                                                            {isMyComment && (
                                                                <>
                                                                    <span className="text-gray-300 opacity-0 group-hover:opacity-100">
                                                                        •
                                                                    </span>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleStartEdit(
                                                                                comment
                                                                            )
                                                                        }
                                                                        className="hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        Sửa
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDeleteComment(
                                                                                comment.id
                                                                            )
                                                                        }
                                                                        className="hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        Xóa
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </article>

                    {/* --- SIDEBAR --- */}
                    <aside className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        {/* Related Posts */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-5 uppercase tracking-wider">
                                Có thể bạn cũng thích
                            </h3>
                            <ul className="space-y-5">
                                {relatedBooks.length > 0 ? (
                                    relatedBooks.map((rel) => (
                                        <li key={rel.id}>
                                            <Link
                                                href={`/post/${rel.slug}`}
                                                className="flex items-center gap-4 group"
                                            >
                                                <img
                                                    src={
                                                        rel.thumbnail
                                                            ? `${BASE_URL.replace('/api/', '')}${rel.thumbnail}`
                                                            : 'https://placehold.co/80x80/f1f5f9/334155?text=Img'
                                                    }
                                                    alt={rel.title}
                                                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-100 group-hover:shadow-md transition-shadow"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-1">
                                                        {rel.title}
                                                    </h4>
                                                    <p className="text-xs font-medium text-gray-400">
                                                        {formatDate(
                                                            rel.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        Không có bài viết liên quan
                                    </p>
                                )}
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-extrabold text-gray-900 mb-5 uppercase tracking-wider">
                                Danh mục liên quan
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href="/?categoryId=1"
                                    className="text-xs font-bold bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Lập trình Web
                                </Link>
                                <Link
                                    href="/?categoryId=2"
                                    className="text-xs font-bold bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Technology
                                </Link>
                                <Link
                                    href="/?categoryId=3"
                                    className="text-xs font-bold bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Guides
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}
