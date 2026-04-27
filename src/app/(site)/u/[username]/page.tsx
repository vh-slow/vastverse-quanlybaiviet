'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiUser, BASE_URL } from '@/src/services';
import { apiBook } from '@/src/services/book';
import { formatDateTime, formatDate } from '@/src/utils/formatters';
import toast from 'react-hot-toast';
import BookCard from '@/src/components/BookCard';

export default function PublicProfilePage() {
    const params = useParams();
    const rawUsername = params.username as string;
    const username = decodeURIComponent(rawUsername);

    const [user, setUser] = useState<any>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

    const [stats, setStats] = useState({
        totalPublished: 0,
        totalFavorites: 0,
        totalViews: 0,
    });

    const [books, setBooks] = useState<any[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [activeTab, setActiveTab] = useState<'overview' | 'articles'>(
        'overview'
    );

    const OVERVIEW_PAGE_SIZE = 4;
    const ARTICLES_PAGE_SIZE = 6;

    const fetchUserProfile = useCallback(async () => {
        try {
            const [userData, statsData] = await Promise.all([
                apiUser.getPublicProfile(username),
                apiUser.getUserStats(username),
            ]);
            setUser(userData);
            setStats(statsData);
        } catch (error) {
            toast.error('Không tìm thấy thông tin tác giả!');
        } finally {
            setIsLoadingProfile(false);
        }
    }, [username]);

    const fetchUserBooks = useCallback(
        async (page: number, size: number) => {
            setIsLoadingBooks(true);
            try {
                const booksData = await apiBook.getBooksByUsername(username, {
                    pageNumber: page,
                    pageSize: size,
                });

                setBooks(booksData.data || booksData.content || []);

                const totalRecords = booksData.totalRecords || 0;
                setTotalPages(Math.ceil(totalRecords / size) || 1);
            } catch (error) {
                console.error('Lỗi tải bài viết:', error);
            } finally {
                setIsLoadingBooks(false);
            }
        },
        [username]
    );

    useEffect(() => {
        if (username) {
            fetchUserProfile();
            fetchUserBooks(1, OVERVIEW_PAGE_SIZE);
        }
    }, [username, fetchUserProfile, fetchUserBooks]);

    const handleTabChange = (tab: 'overview' | 'articles') => {
        setActiveTab(tab);
        setCurrentPage(1);
        fetchUserBooks(
            1,
            tab === 'overview' ? OVERVIEW_PAGE_SIZE : ARTICLES_PAGE_SIZE
        );
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchUserBooks(newPage, ARTICLES_PAGE_SIZE);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <div className="text-gray-500 flex items-center gap-2">
                    <i className="fa-solid fa-circle-notch fa-spin text-xl"></i>{' '}
                    Đang tải hồ sơ...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <img
                    src="https://placehold.co/150x150/e0e7ff/3730a3?text=404"
                    className="w-24 h-24 rounded-full grayscale opacity-50 mb-4"
                    alt="404"
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Không tìm thấy tác giả
                </h1>
                <p className="text-gray-500">
                    Người dùng này không tồn tại hoặc đã đổi tên.
                </p>
                <Link
                    href="/"
                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Về Trang chủ
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white animate-fade-in-up pb-20">
            <div className="max-w-5xl mx-auto">
                <div className="px-4 sm:px-6 lg:px-8 pt-6">
                    <div className="h-32 sm:h-48 w-full rounded-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    </div>

                    <div className="flex flex-col px-4 sm:px-8 relative -mt-12 sm:-mt-16 mb-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 mb-4">
                            <img
                                src={
                                    user.avatar
                                        ? `${BASE_URL.replace('/api/', '')}${user.avatar}`
                                        : `https://placehold.co/150x150/e0e7ff/3730a3?text=${user.fullName.charAt(0)}`
                                }
                                alt={user.fullName}
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-white shrink-0"
                            />
                            <div className="pb-2 text-center sm:text-left flex-1">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                                    {user.fullName}
                                </h1>
                                <p className="text-gray-500 font-medium mt-0.5">
                                    @{user.username}
                                </p>
                                <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <i className="fa-regular fa-calendar"></i>{' '}
                                        Tham gia {formatDate(user.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center sm:text-left max-w-3xl">
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                {user.bio || (
                                    <span className="italic text-gray-400">
                                        Tác giả chưa cập nhật tiểu sử.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="flex gap-8">
                        <button
                            onClick={() => handleTabChange('overview')}
                            className={`pb-4 text-base font-bold transition-colors relative ${activeTab === 'overview' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Tổng quan
                            {activeTab === 'overview' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                            )}
                        </button>
                        <button
                            onClick={() => handleTabChange('articles')}
                            className={`pb-4 text-base font-bold transition-colors relative ${activeTab === 'articles' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Tất cả bài viết
                            {activeTab === 'articles' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                            )}
                        </button>
                    </div>
                </div>

                <div className="px-4 sm:px-6 lg:px-8">
                    {activeTab === 'overview' && (
                        <div className="animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 mt-2">
                                <div className="p-6 rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">
                                        <i className="fa-solid fa-file-lines"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">
                                            Bài đã đăng
                                        </p>
                                        <h4 className="text-xl font-bold text-gray-900">
                                            {stats.totalPublished}
                                        </h4>
                                    </div>
                                </div>

                                <div className="p-6 rounded-xl border border-gray-100 bg-gradient-to-br from-pink-50 to-white shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
                                    <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xl shrink-0">
                                        <i className="fa-solid fa-heart"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">
                                            Lượt thích
                                        </p>
                                        <h4 className="text-xl font-bold text-gray-900">
                                            {stats.totalFavorites.toLocaleString()}
                                        </h4>
                                    </div>
                                </div>

                                <div className="p-6 rounded-xl border border-gray-100 bg-gradient-to-br from-purple-50 to-white shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0">
                                        <i className="fa-solid fa-eye"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">
                                            Lượt xem
                                        </p>
                                        <h4 className="text-xl font-bold text-gray-900">
                                            {stats.totalViews.toLocaleString()}
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Bài viết gần đây của{' '}
                                        {user.fullName.split(' ').pop()}
                                    </h2>
                                    <button
                                        onClick={() =>
                                            handleTabChange('articles')
                                        }
                                        className="text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                        Xem tất cả
                                    </button>
                                </div>

                                {isLoadingBooks ? (
                                    <div className="flex justify-center py-8">
                                        <i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-2xl"></i>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {books.length === 0 ? (
                                            <p className="text-gray-500 italic py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 col-span-full">
                                                Không có bài viết nào.
                                            </p>
                                        ) : (
                                            books.map((book) => (
                                                <BookCard
                                                    key={book.id}
                                                    book={book}
                                                />
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'articles' && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Tất cả bài viết
                            </h2>

                            {isLoadingBooks ? (
                                <div className="flex justify-center py-16">
                                    <i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-3xl"></i>
                                </div>
                            ) : books.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400 text-2xl">
                                        <i className="fa-solid fa-pen-nib"></i>
                                    </div>
                                    <h3 className="text-gray-900 font-bold text-lg">
                                        Chưa có bài viết nào
                                    </h3>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {books.map((book) => (
                                            <BookCard
                                                key={book.id}
                                                book={book}
                                            />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-3 mt-12 mb-8">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage - 1
                                                    )
                                                }
                                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-gray-200 transition-colors shadow-sm"
                                            >
                                                <i className="fa-solid fa-chevron-left"></i>
                                            </button>

                                            <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                                                Trang {currentPage} /{' '}
                                                {totalPages}
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
                                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-gray-200 transition-colors shadow-sm"
                                            >
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
