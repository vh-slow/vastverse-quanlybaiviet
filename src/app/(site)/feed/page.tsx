'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { apiBook } from '@/src/services/book';
import {
    apiUser,
    apiFavorite,
    apiComment,
    apiTag,
    BASE_URL,
} from '@/src/services';
import { formatDate, formatDateTime } from '@/src/utils/formatters';
import toast from 'react-hot-toast';

export default function FeedPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [feedBooks, setFeedBooks] = useState<any[]>([]);
    const [followingUsers, setFollowingUsers] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalBook, setModalBook] = useState<any>(null);
    const [modalComments, setModalComments] = useState<any[]>([]);
    const [modalTags, setModalTags] = useState<any[]>([]);

    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null
    );
    const [editCommentText, setEditCommentText] = useState('');

    const fetchFeedData = useCallback(
        async (page: number) => {
            if (!user) return;
            setLoadingData(true);
            try {
                const [booksRes, followingRes] = await Promise.all([
                    apiBook.getFeedBooks({ pageNumber: page, pageSize }),
                    apiUser.getFollowing(user.username),
                ]);

                setFeedBooks(booksRes.data || booksRes.content || []);
                setFollowingUsers(followingRes || []);

                const totalRecords = booksRes.totalRecords || 0;
                setTotalPages(Math.ceil(totalRecords / pageSize) || 1);
            } catch (error) {
                console.error('Lỗi khi tải bảng tin:', error);
            } finally {
                setLoadingData(false);
            }
        },
        [user]
    );

    useEffect(() => {
        if (user) fetchFeedData(1);
    }, [user, fetchFeedData]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchFeedData(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleToggleFavorite = async (
        bookId: number,
        indexInFeed?: number
    ) => {
        try {
            const result = await apiFavorite.toggleFavorite(bookId);

            if (indexInFeed !== undefined) {
                const newFeed = [...feedBooks];
                newFeed[indexInFeed].isFavorited = result.isFavorited;
                newFeed[indexInFeed].favoriteCount = result.favoriteCount;
                setFeedBooks(newFeed);
            } else {
                const idx = feedBooks.findIndex((b) => b.id === bookId);
                if (idx !== -1) {
                    const newFeed = [...feedBooks];
                    newFeed[idx].isFavorited = result.isFavorited;
                    newFeed[idx].favoriteCount = result.favoriteCount;
                    setFeedBooks(newFeed);
                }
            }

            if (modalBook && modalBook.id === bookId) {
                setModalBook((prev: any) => ({
                    ...prev,
                    isFavorited: result.isFavorited,
                    favoriteCount: result.favoriteCount,
                }));
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thả tim!');
        }
    };

    const openPostModal = async (slug: string) => {
        setIsModalOpen(true);
        setModalLoading(true);
        document.body.style.overflow = 'hidden';
        try {
            const bookData = await apiBook.getPublicBookBySlug(slug);
            setModalBook(bookData);
            if (bookData) {
                const [commentsData, tagsData] = await Promise.all([
                    apiComment.getCommentsByBook(bookData.id),
                    apiTag.getRelatedTags(bookData.id),
                ]);
                setModalComments(commentsData);
                setModalTags(tagsData);
            }
        } catch (error) {
            toast.error('Lỗi khi tải chi tiết bài viết!');
            setIsModalOpen(false);
            document.body.style.overflow = 'auto';
        } finally {
            setModalLoading(false);
        }
    };

    const closePostModal = () => {
        setIsModalOpen(false);
        setModalBook(null);
        document.body.style.overflow = 'auto';
    };

    const fetchModalComments = async (bookId: number) => {
        try {
            const data = await apiComment.getCommentsByBook(bookId);
            setModalComments(data);
        } catch (error) {}
    };

    const handlePostComment = async () => {
        if (!newComment.trim() || !modalBook) return;
        setIsSubmittingComment(true);
        try {
            await apiComment.createComment({
                bookId: modalBook.id,
                content: newComment.trim(),
            });
            setNewComment('');
            fetchModalComments(modalBook.id);
        } catch (error) {
            toast.error('Lỗi đăng bình luận.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await apiComment.deleteComment(commentId);
            setModalComments(modalComments.filter((c) => c.id !== commentId));
        } catch (error) {
            toast.error('Xóa thất bại!');
        }
    };

    const handleUpdateComment = async (commentId: number) => {
        if (!editCommentText.trim()) return;
        try {
            await apiComment.updateComment(commentId, {
                content: editCommentText.trim(),
            });
            setEditingCommentId(null);
            fetchModalComments(modalBook.id);
        } catch (error) {
            toast.error('Cập nhật thất bại!');
        }
    };

    const handleCopyLink = (slug: string) => {
        const url = `${window.location.origin}/${slug}`;
        navigator.clipboard.writeText(url);
        toast.success('Đã sao chép link bài viết!');
    };

    if (isLoading) return null;

    if (!user) {
        return (
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gray-50">
                <div className="absolute inset-0 pointer-events-none flex justify-center gap-6 opacity-[0.15] blur-md select-none -z-10">
                    <div className="w-[300px] space-y-6 pt-12 animate-pulse hidden md:block">
                        <div className="h-[400px] bg-gray-400 rounded-3xl"></div>
                        <div className="h-[300px] bg-gray-400 rounded-3xl"></div>
                    </div>
                    <div className="w-[300px] space-y-6 -mt-10 animate-pulse">
                        <div className="h-[350px] bg-gray-400 rounded-3xl"></div>
                        <div className="h-[500px] bg-gray-400 rounded-3xl"></div>
                    </div>
                    <div className="w-[300px] space-y-6 pt-24 animate-pulse hidden lg:block">
                        <div className="h-[450px] bg-gray-400 rounded-3xl"></div>
                        <div className="h-[250px] bg-gray-400 rounded-3xl"></div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/40 via-gray-50/80 to-gray-50 pointer-events-none -z-10"></div>

                <div className="relative z-10 flex flex-col items-center px-4 max-w-2xl text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/10 text-blue-600 text-3xl">
                        <i className="fa-solid fa-infinity"></i>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
                        Trải nghiệm{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            vô tận
                        </span>
                    </h2>

                    <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
                        Khám phá hàng ngàn bài viết chất lượng, theo dõi những
                        tác giả xuất sắc và xây dựng một bảng tin mang đậm dấu
                        ấn của riêng bạn.
                    </p>

                    <Link
                        href="/login"
                        className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-blue-600 transition-all duration-300 shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1"
                    >
                        Đăng nhập để bắt đầu
                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </Link>

                    <p className="mt-8 text-sm text-gray-400 font-medium">
                        Chưa có tài khoản?{' '}
                        <Link
                            href="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Tham gia ngay
                        </Link>
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    <div className="lg:col-span-8 flex flex-col items-center">
                        {loadingData ? (
                            <div className="py-20">
                                <i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-3xl"></i>
                            </div>
                        ) : feedBooks.length > 0 ? (
                            <div className="w-full max-w-[520px] space-y-8 pb-10">
                                {feedBooks.map((book, index) => (
                                    <article
                                        key={book.id}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                                    >
                                        <div className="flex items-center p-3 border-b border-gray-50">
                                            <Link
                                                href={`/u/${book.user.username}`}
                                                className="shrink-0 mr-3"
                                            >
                                                <img
                                                    src={
                                                        book.user.avatar
                                                            ? `${BASE_URL.replace('/api/', '')}${book.user.avatar}`
                                                            : `https://placehold.co/40x40/e0e7ff/3730a3?text=${book.user.fullName.charAt(0)}`
                                                    }
                                                    alt={book.user.fullName}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/u/${book.user.username}`}
                                                    className="font-bold text-sm text-gray-900 leading-tight hover:underline flex items-center gap-1 truncate"
                                                >
                                                    {book.user.fullName}
                                                    {book.user.role ===
                                                        'admin' && (
                                                        <i
                                                            className="fa-solid fa-circle-check text-blue-500 text-xs"
                                                            title="Admin"
                                                        ></i>
                                                    )}
                                                </Link>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {formatDateTime(
                                                        book.createdAt
                                                    )}
                                                </p>
                                            </div>
                                            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors">
                                                <i className="fa-solid fa-ellipsis"></i>
                                            </button>
                                        </div>

                                        <div
                                            onClick={() =>
                                                openPostModal(book.slug)
                                            }
                                            className="block aspect-[5/3] w-full bg-gray-100 cursor-pointer overflow-hidden"
                                        >
                                            <img
                                                src={
                                                    book.thumbnail
                                                        ? `${BASE_URL.replace('/api/', '')}${book.thumbnail}`
                                                        : 'https://placehold.co/600x800/f1f5f9/334155?text=No+Image'
                                                }
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        'https://placehold.co/600x800/f1f5f9/334155?text=Error';
                                                }}
                                            />
                                        </div>

                                        <div className="px-4 py-3">
                                            <div className="flex items-center gap-4 mb-2">
                                                <button
                                                    onClick={() =>
                                                        handleToggleFavorite(
                                                            book.id,
                                                            index
                                                        )
                                                    }
                                                    className={`text-2xl hover:opacity-70 transition-opacity ${book.isFavorited ? 'text-pink-600' : 'text-gray-900'}`}
                                                >
                                                    <i
                                                        className={`fa-heart ${book.isFavorited ? 'fa-solid' : 'fa-regular'}`}
                                                    ></i>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openPostModal(book.slug)
                                                    }
                                                    className="text-2xl text-gray-900 hover:opacity-70 transition-opacity"
                                                >
                                                    <i className="fa-regular fa-comment"></i>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleCopyLink(
                                                            book.slug
                                                        )
                                                    }
                                                    className="text-2xl text-gray-900 hover:opacity-70 transition-opacity"
                                                >
                                                    <i className="fa-regular fa-paper-plane"></i>
                                                </button>
                                            </div>
                                            <p className="font-bold text-sm text-gray-900 mb-1.5">
                                                {book.favoriteCount || 0} lượt
                                                thích
                                            </p>
                                            <div className="text-sm text-gray-900">
                                                <Link
                                                    href={`/u/${book.user.username}`}
                                                    className="font-bold mr-2 hover:underline"
                                                >
                                                    {book.user.fullName}
                                                </Link>
                                                <span className="font-medium text-gray-800">
                                                    {book.title}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {book.summary}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    openPostModal(book.slug)
                                                }
                                                className="text-gray-400 text-sm mt-2 font-medium hover:underline"
                                            >
                                                Xem chi tiết và bình luận...
                                            </button>
                                        </div>
                                    </article>
                                ))}

                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-3 mt-4">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
                                        >
                                            <i className="fa-solid fa-chevron-left"></i>
                                        </button>
                                        <span className="text-sm font-bold text-gray-600">
                                            Trang {currentPage}
                                        </span>
                                        <button
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
                                        >
                                            <i className="fa-solid fa-chevron-right"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white p-12 w-full text-center rounded-2xl border border-gray-200 flex flex-col items-center mt-10">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500 text-3xl">
                                    <i className="fa-solid fa-user-group"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Bảng tin đang trống!
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-sm">
                                    Bạn chưa theo dõi ai, hoặc họ chưa đăng bài.
                                </p>
                                <Link
                                    href="/"
                                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Khám phá ngay
                                </Link>
                            </div>
                        )}
                    </div>

                    <aside className="lg:col-span-4 lg:sticky lg:top-24 hidden lg:block">
                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={
                                    user.avatar
                                        ? `${BASE_URL.replace('/api/', '')}${user.avatar}`
                                        : `https://placehold.co/60x60/e0e7ff/3730a3?text=${user.fullName.charAt(0)}`
                                }
                                className="w-14 h-14 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">
                                    {user.username}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {user.fullName}
                                </p>
                            </div>
                            <Link
                                href="/account"
                                className="ml-auto text-xs font-bold text-blue-500 hover:text-blue-700"
                            >
                                Tài khoản
                            </Link>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm text-gray-500">
                                Đang theo dõi
                            </h3>
                            <Link
                                href="/account"
                                className="text-xs font-bold text-gray-900 hover:text-blue-600"
                            >
                                Quản lý
                            </Link>
                        </div>

                        <ul className="space-y-4">
                            {followingUsers.length === 0 ? (
                                <p className="text-xs text-gray-400 italic">
                                    Danh sách trống.
                                </p>
                            ) : (
                                followingUsers.map((author) => (
                                    <li key={author.id}>
                                        <Link
                                            href={`/u/${author.username}`}
                                            className="flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        author.avatar
                                                            ? `${BASE_URL.replace('/api/', '')}${author.avatar}`
                                                            : `https://placehold.co/40x40/f3f4f6/6b7280?text=${author.fullName.charAt(0)}`
                                                    }
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                                />
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 truncate max-w-[150px]">
                                                        {author.username}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                                        {author.fullName}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-blue-500 group-hover:text-blue-700">
                                                Xem
                                            </span>
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </aside>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-0 md:p-6 lg:p-10 animate-fade-in">
                    <button
                        onClick={closePostModal}
                        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-[110] transition-colors"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    <div className="bg-white md:rounded-r-2xl md:rounded-l-2xl flex flex-col lg:flex-row w-full max-w-[1200px] h-full md:h-[90vh] overflow-hidden relative animate-zoom-in">
                        {modalLoading || !modalBook ? (
                            <div className="w-full h-full flex justify-center items-center">
                                <i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-4xl"></i>
                            </div>
                        ) : (
                            <>
                                <div className="lg:w-[65%] h-[50vh] lg:h-full overflow-y-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-gray-200 bg-white">
                                    <article className="p-6 md:p-8">
                                        <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 shadow-sm border border-gray-100">
                                            <img
                                                src={
                                                    modalBook.thumbnail
                                                        ? `${BASE_URL.replace('/api/', '')}${modalBook.thumbnail}`
                                                        : 'https://placehold.co/800'
                                                }
                                                alt={modalBook.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <header className="mb-6 border-b border-gray-100 pb-4">
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight flex-1">
                                                    {modalBook.title}
                                                </h1>
                                                <button
                                                    onClick={() =>
                                                        handleToggleFavorite(
                                                            modalBook.id
                                                        )
                                                    }
                                                    className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold transition-colors shadow-sm ${modalBook.isFavorited ? 'bg-pink-50 text-pink-600 border-pink-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200'}`}
                                                >
                                                    <i
                                                        className={`fa-heart ${modalBook.isFavorited ? 'fa-solid' : 'fa-regular'}`}
                                                    ></i>
                                                    {modalBook.favoriteCount ||
                                                        0}
                                                </button>
                                            </div>

                                            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={
                                                            modalBook.user
                                                                ?.avatar
                                                                ? `${BASE_URL.replace('/api/', '')}${modalBook.user.avatar}`
                                                                : `https://placehold.co/32`
                                                        }
                                                        className="w-7 h-7 rounded-full object-cover border border-gray-200"
                                                    />
                                                    <span className="font-bold text-gray-700">
                                                        {
                                                            modalBook.user
                                                                ?.fullName
                                                        }
                                                    </span>
                                                </div>
                                                <span className="hidden sm:inline text-gray-300">
                                                    |
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <i className="fa-regular fa-calendar"></i>{' '}
                                                    {formatDate(
                                                        modalBook.createdAt
                                                    )}
                                                </span>
                                                <span className="hidden sm:inline text-gray-300">
                                                    |
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <i className="fa-regular fa-eye"></i>{' '}
                                                    {modalBook.viewCount.toLocaleString()}{' '}
                                                    lượt xem
                                                </span>
                                            </div>
                                            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                                                {modalBook.category?.name ||
                                                    'Chưa phân loại'}
                                            </span>
                                        </header>
                                        <div
                                            className="prose prose-lg prose-blue max-w-none prose-img:rounded-xl prose-a:text-blue-600"
                                            dangerouslySetInnerHTML={{
                                                __html: modalBook.content || '',
                                            }}
                                        />

                                        <footer className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-bold text-gray-700">
                                                    <i className="fa-solid fa-tags text-gray-400"></i>{' '}
                                                    Từ khóa:
                                                </span>
                                                {modalTags.length > 0 ? (
                                                    modalTags.map((t) => (
                                                        <span
                                                            key={t.id}
                                                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg"
                                                        >
                                                            #{t.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs italic text-gray-400">
                                                        Không có
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            `${window.location.origin}/${modalBook.slug}`
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                >
                                                    <i className="fa-solid fa-link text-sm"></i>
                                                </button>
                                            </div>
                                        </footer>
                                    </article>
                                </div>

                                <div className="lg:w-[35%] h-[50vh] lg:h-full flex flex-col bg-white">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                                        <Link
                                            href={`/u/${modalBook.user.username}`}
                                            className="flex items-center gap-3 hover:opacity-80"
                                        >
                                            <img
                                                src={
                                                    modalBook.user.avatar
                                                        ? `${BASE_URL.replace('/api/', '')}${modalBook.user.avatar}`
                                                        : `https://placehold.co/40`
                                                }
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                            <span className="font-bold text-sm text-gray-900">
                                                {modalBook.user.fullName}
                                            </span>
                                        </Link>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                                        <div className="flex gap-3 mb-6">
                                            <img
                                                src={
                                                    modalBook.user.avatar
                                                        ? `${BASE_URL.replace('/api/', '')}${modalBook.user.avatar}`
                                                        : `https://placehold.co/40`
                                                }
                                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                            />
                                            <div className="text-sm text-gray-900 leading-snug">
                                                <span className="font-bold mr-2">
                                                    {modalBook.user.fullName}
                                                </span>
                                                {modalBook.summary}
                                            </div>
                                        </div>

                                        {modalComments.length === 0 ? (
                                            <div className="text-center py-10 opacity-60">
                                                <p className="text-sm font-medium text-gray-500">
                                                    Chưa có bình luận nào.
                                                </p>
                                            </div>
                                        ) : (
                                            modalComments.map((cmt) => (
                                                <div
                                                    key={cmt.id}
                                                    className="flex gap-3 group"
                                                >
                                                    <img
                                                        src={
                                                            cmt.user.avatar
                                                                ? `${BASE_URL.replace('/api/', '')}${cmt.user.avatar}`
                                                                : `https://placehold.co/40`
                                                        }
                                                        className="w-8 h-8 rounded-full object-cover shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm leading-snug">
                                                            <span className="font-bold mr-2 text-gray-900">
                                                                {
                                                                    cmt.user
                                                                        .fullName
                                                                }
                                                            </span>
                                                            <span className="text-gray-800 break-words">
                                                                {cmt.content}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1.5 text-[11px] font-bold text-gray-500">
                                                            <span className="font-normal">
                                                                {
                                                                    formatDateTime(
                                                                        cmt.createdAt
                                                                    ).split(
                                                                        ' '
                                                                    )[1]
                                                                }
                                                            </span>

                                                            {user &&
                                                                user.id ===
                                                                    cmt.user
                                                                        .id && (
                                                                    <div className="hidden group-hover:flex items-center gap-3 ml-2">
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingCommentId(
                                                                                    cmt.id
                                                                                );
                                                                                setEditCommentText(
                                                                                    cmt.content
                                                                                );
                                                                            }}
                                                                            className="hover:text-blue-600 transition-colors"
                                                                        >
                                                                            Sửa
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteComment(
                                                                                    cmt.id
                                                                                )
                                                                            }
                                                                            className="hover:text-red-600 transition-colors"
                                                                        >
                                                                            Xóa
                                                                        </button>
                                                                    </div>
                                                                )}
                                                        </div>
                                                        {editingCommentId ===
                                                            cmt.id && (
                                                            <div className="mt-2 flex gap-2">
                                                                <input
                                                                    type="text"
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
                                                                    className="border rounded px-2 py-1 text-xs w-full focus:ring-1 focus:ring-blue-500"
                                                                />
                                                                <button
                                                                    onClick={() =>
                                                                        handleUpdateComment(
                                                                            cmt.id
                                                                        )
                                                                    }
                                                                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                                                >
                                                                    Lưu
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-gray-100 shrink-0 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            'modalCommentInput'
                                                        )
                                                        ?.focus()
                                                }
                                                className="text-2xl text-gray-900 hover:opacity-70"
                                            >
                                                <i className="fa-regular fa-comment"></i>
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400 uppercase">
                                            {formatDate(modalBook.createdAt)}
                                        </p>
                                    </div>

                                    <div className="p-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
                                        <i className="fa-regular fa-face-smile text-2xl text-gray-400"></i>
                                        <input
                                            id="modalCommentInput"
                                            type="text"
                                            value={newComment}
                                            onChange={(e) =>
                                                setNewComment(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    handlePostComment();
                                            }}
                                            placeholder="Thêm bình luận..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0"
                                        />
                                        <button
                                            onClick={handlePostComment}
                                            disabled={
                                                !newComment.trim() ||
                                                isSubmittingComment
                                            }
                                            className="text-blue-600 font-bold text-sm disabled:opacity-50"
                                        >
                                            {isSubmittingComment
                                                ? 'Đang đăng...'
                                                : 'Đăng'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
