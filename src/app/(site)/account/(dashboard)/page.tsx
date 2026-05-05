'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import { apiBook } from '@/src/services/book';
import { apiFavorite, apiUser, BASE_URL } from '@/src/services';
import { Book } from '@/src/types';
import { formatDate, formatDateTime } from '@/src/utils/formatters';

export default function AccountDashboardPage() {
    const { user, isLoading } = useAuth();

    const [recentBooks, setRecentBooks] = useState<Book[]>([]);
    const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
    const [stats, setStats] = useState({
        totalPublished: 0,
        totalFavorites: 0,
        totalViews: 0,
    });
    const [loadingData, setLoadingData] = useState(true);

    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? 'Chào buổi sáng'
            : hour < 18
              ? 'Chào buổi chiều'
              : 'Chào buổi tối';

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            setLoadingData(true);
            try {
                const [booksRes, statsRes, favoritesRes] = await Promise.all([
                    apiBook.getMyBooks({ pageNumber: 1, pageSize: 3 }),
                    apiUser.getUserStats(user.username),
                    apiFavorite.getMyFavorites(),
                ]);

                setRecentBooks(booksRes.data);
                setStats(statsRes);
                console.log('Stats:', statsRes);
                setFavoriteBooks(favoritesRes.slice(0, 2));
            } catch (error) {
                console.error('Lỗi lấy dữ liệu Dashboard:', error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    if (isLoading || loadingData) {
        return (
            <div className="flex items-center justify-center min-h-[700px]">
                <div className="flex flex-col items-center gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600"></i>
                    <p className="text-gray-500 font-medium">
                        Đang tải dữ liệu tổng quan...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Tổng quan tài khoản
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {greeting}, {user?.fullName || user?.username}! Dưới đây
                        là hoạt động blog của bạn.
                    </p>
                </div>
                <Link
                    href="/posts/create"
                    className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <i className="fa-solid fa-pen-nib"></i>
                    <span>Viết bài mới</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 mt-8">
                <div className="p-6 rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">
                        <i className="fa-solid fa-file-lines"></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                            Bài đã đăng
                        </p>
                        <h4 className="text-lg font-bold text-gray-900">
                            {stats.totalPublished}
                        </h4>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-100 bg-gradient-to-br from-pink-50 to-white shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xl shrink-0">
                        <i className="fa-solid fa-heart"></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                            Lượt thích
                        </p>
                        <h4 className="text-lg font-bold text-gray-900">
                            {stats.totalFavorites}
                        </h4>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-gray-100 bg-gradient-to-br from-purple-50 to-white shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0">
                        <i className="fa-solid fa-eye"></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                            Lượt xem
                        </p>
                        <h4 className="text-lg font-bold text-gray-900">
                            {stats.totalViews}
                        </h4>
                    </div>
                </div>
            </div>

            <hr className="my-8 border-gray-100" />

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        Bài viết gần đây của tôi
                    </h3>
                    <Link
                        href="/account/posts"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        Xem tất cả
                    </Link>
                </div>

                <div className="space-y-2">
                    {recentBooks.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500 text-sm">
                                Bạn chưa có bài viết nào.
                            </p>
                        </div>
                    ) : (
                        recentBooks.map((book) => (
                            <div
                                key={book.id}
                                className="group flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors"
                            >
                                <div className="w-full sm:w-28 h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                                    <img
                                        src={
                                            book.thumbnail
                                                ? `${BASE_URL.replace('/api/', '')}${book.thumbnail}`
                                                : 'https://placehold.co/150x100/f1f5f9/334155?text=Img'
                                        }
                                        alt={book.title}
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                'https://placehold.co/150x100/f1f5f9/334155?text=Img';
                                        }}
                                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${book.status === 0 ? 'grayscale opacity-70' : ''}`}
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-bold text-gray-900 truncate">
                                        <Link
                                            href={`/${book.slug}`}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {book.title}
                                        </Link>
                                    </h4>
                                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                                        <span
                                            className={`px-2 py-0.5 rounded font-semibold ${
                                                book.status === 1
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {book.status === 1
                                                ? 'Công khai'
                                                : 'Chờ duyệt'}
                                        </span>

                                        <span>
                                            {formatDateTime(book.createdAt)}
                                        </span>

                                        <span className="text-gray-300">|</span>

                                        <span className="flex items-center gap-1.5">
                                            <i className="fa-regular fa-eye"></i>{' '}
                                            {book.viewCount.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <i className="fa-regular fa-heart"></i>{' '}
                                            {book.favoriteCount || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative group/action shrink-0 w-full sm:w-auto flex justify-end mt-2 sm:mt-0">
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors bg-transparent group-hover:bg-white">
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </button>

                                    <div className="absolute right-full top-1/2 -translate-y-1/2 pr-3 py-4 flex items-center gap-2 opacity-0 translate-x-4 pointer-events-none group-hover/action:pointer-events-auto group-hover/action:opacity-100 group-hover/action:translate-x-0 transition-all duration-300 ease-out">
                                        <Link
                                            href={`/posts/update/${book.id}`}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all"
                                            title="Chỉnh sửa"
                                        >
                                            <i className="fa-solid fa-pen text-xs"></i>
                                        </Link>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300 hover:shadow-sm transition-all"
                                            title="Xóa"
                                        >
                                            <i className="fa-solid fa-trash-can text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <hr className="my-8 border-gray-100" />

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        Bài viết đã lưu (Yêu thích)
                    </h3>
                    <Link
                        href="/account/favorites"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        Xem tất cả
                    </Link>
                </div>

                {favoriteBooks.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">
                            Bạn chưa lưu bài viết nào.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favoriteBooks.map((favBook) => (
                            <div key={favBook.id} className="flex gap-4 group">
                                <Link
                                    href={`/${favBook.slug}`}
                                    className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-200"
                                >
                                    <img
                                        src={
                                            favBook.thumbnail
                                                ? `${BASE_URL.replace('/api/', '')}${favBook.thumbnail}`
                                                : 'https://placehold.co/150x150/f1f5f9/334155?text=Img'
                                        }
                                        alt="Saved"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                'https://placehold.co/150x100/f1f5f9/334155?text=Img';
                                        }}
                                    />
                                </Link>
                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        <Link href={`/${favBook.slug}`}>
                                            {favBook.title}
                                        </Link>
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Bởi {favBook.user?.fullName}
                                    </p>
                                    <button
                                        onClick={async () => {
                                            await apiFavorite.toggleFavorite(
                                                favBook.id
                                            );
                                            setFavoriteBooks((prev) =>
                                                prev.filter(
                                                    (b) => b.id !== favBook.id
                                                )
                                            );
                                        }}
                                        className="mt-auto text-xs font-semibold text-gray-400 text-pink-600 hover:text-yellow-600 flex items-center gap-1.5 self-start transition-colors"
                                    >
                                        <i className="fa-solid fa-bookmark"></i>{' '}
                                        Bỏ lưu
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
