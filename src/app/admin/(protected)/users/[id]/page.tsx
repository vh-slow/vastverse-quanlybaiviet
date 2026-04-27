'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/src/components/admin/layout/Header';
import { apiUser } from '@/src/services/user';
import { apiBook } from '@/src/services/book';
import { BASE_URL } from '@/src/services';
import { formatDate, formatDateTime } from '@/src/utils/formatters';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UserDetailPage() {
    const params = useParams();
    const userId = Number(params.id);

    const [user, setUser] = useState<any>(null);
    const [books, setBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchUserData = useCallback(async () => {
        try {
            const [userData, booksData] = await Promise.all([
                apiUser.getUserDetail(userId),
                apiUser.getUserBooksByAdmin(userId, {
                    pageNumber: 1,
                    pageSize: 50,
                }),
            ]);
            setUser(userData);
            setBooks(booksData.data || []);
        } catch (error) {
            toast.error('Không tìm thấy thông tin người dùng!');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) fetchUserData();
    }, [userId, fetchUserData]);

    const handleDeleteBook = async (bookId: number) => {
        try {
            await apiBook.deleteBook(bookId);
            toast.success('Đã xóa bài viết!');
            fetchUserData();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Xóa bài viết thất bại!'
            );
        }
    };

    const handleToggleVisibility = async (bookId: number) => {
        try {
            const res = await apiBook.toggleVisibility(bookId);
            toast.success(res.message || 'Đã thay đổi trạng thái!');
            fetchUserData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Thao tác thất bại!');
        }
    };

    const handleApproveBook = async (bookId: number) => {
        if (!confirm('Bạn muốn duyệt bài viết này hiển thị công khai?')) return;
        try {
            await apiBook.toggleVisibility(bookId);
            toast.success('Đã duyệt bài viết thành công!');
            fetchUserData();
        } catch (error: any) {
            toast.error('Duyệt bài viết thất bại!');
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex justify-center items-center h-full min-h-[500px]">
                <div className="text-gray-500 flex flex-col items-center gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600"></i>
                    <p className="font-medium">Đang tải hồ sơ thành viên...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const breadcrumbs = [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Thành viên', href: '/admin/users' },
        { name: 'Hồ sơ chi tiết' },
    ];

    return (
        <>
            <Header title="Hồ sơ Thành viên" breadcrumbs={breadcrumbs} />

            <div className="flex-1 p-6 md:p-8 bg-gray-50/50 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-100 to-purple-100"></div>

                            <div className="relative mt-4 mb-4">
                                <img
                                    src={
                                        user.avatar
                                            ? `${BASE_URL.replace('/api/', '')}${user.avatar}`
                                            : `https://placehold.co/150x150/e0e7ff/3730a3?text=${user.fullName.charAt(0)}`
                                    }
                                    alt={user.fullName}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto bg-white relative z-10"
                                />
                                <div
                                    className={`absolute bottom-2 right-1/2 translate-x-12 w-5 h-5 border-2 border-white rounded-full z-20 ${user.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                                ></div>
                            </div>

                            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                                {user.fullName}
                            </h2>
                            <p className="text-gray-500 font-medium mb-5">
                                @{user.username}
                            </p>

                            <div className="flex justify-center gap-2 mb-6">
                                <span
                                    className={`px-3 py-1 text-xs font-bold rounded-lg border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                                >
                                    {user.role.toUpperCase()}
                                </span>
                                <span
                                    className={`px-3 py-1 text-xs font-bold rounded-lg border ${user.status === 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                                >
                                    {user.status === 1
                                        ? 'ĐANG HOẠT ĐỘNG'
                                        : 'ĐÃ BỊ KHÓA'}
                                </span>
                            </div>

                            <ul className="text-left space-y-4 text-sm text-gray-600 border-t border-gray-100 pt-6">
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                        <i className="fa-regular fa-envelope"></i>
                                    </div>
                                    <span
                                        className="truncate"
                                        title={user.email}
                                    >
                                        {user.email}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                        <i className="fa-regular fa-calendar"></i>
                                    </div>
                                    <span>
                                        Tham gia:{' '}
                                        <span className="font-semibold text-gray-900">
                                            {formatDate(user.createdAt)}
                                        </span>
                                    </span>
                                </li>
                            </ul>

                            <div className="text-left bg-blue-50/50 border border-blue-100 p-4 rounded-xl mt-6">
                                <h4 className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wider">
                                    Tiểu sử (Bio)
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {user.bio ? (
                                        user.bio
                                    ) : (
                                        <span className="italic text-gray-400">
                                            Người dùng chưa cập nhật tiểu sử.
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Bài viết đã đăng
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tổng cộng{' '}
                                        <span className="font-semibold text-gray-700">
                                            {books.length}
                                        </span>{' '}
                                        bài viết thuộc về tài khoản này.
                                    </p>
                                </div>
                            </div>

                            <div className="p-2 space-y-1">
                                {books.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                                            <i className="fa-solid fa-folder-open"></i>
                                        </div>
                                        <p className="text-gray-500 font-medium">
                                            Thành viên này chưa đăng bài viết
                                            nào.
                                        </p>
                                    </div>
                                ) : (
                                    books.map((book) => (
                                        <div
                                            key={book.id}
                                            className="group flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-xl hover:bg-gray-50 border border-transparent transition-colors"
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-full sm:w-28 h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-200 relative">
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

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-base font-bold text-gray-900 truncate mb-2">
                                                    <Link
                                                        href={`/admin/books/${book.id}`}
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        {book.title}
                                                    </Link>
                                                </h4>

                                                <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-xs text-gray-500">
                                                    <span
                                                        className={`px-2 py-0.5 rounded font-bold ${
                                                            book.status === 1
                                                                ? 'bg-green-100 text-green-700'
                                                                : book.status ===
                                                                    0
                                                                  ? 'bg-yellow-100 text-yellow-700'
                                                                  : book.status ===
                                                                      2
                                                                    ? 'bg-gray-200 text-gray-700'
                                                                    : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {book.status === 1
                                                            ? 'Công khai'
                                                            : book.status === 0
                                                              ? 'Chờ duyệt'
                                                              : book.status ===
                                                                  2
                                                                ? 'Đã ẩn'
                                                                : 'Bị khóa'}
                                                    </span>
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                                                        {book.category?.name ||
                                                            'N/A'}
                                                    </span>
                                                    <span>
                                                        {formatDateTime(
                                                            book.createdAt
                                                        )}
                                                    </span>
                                                    <span className="text-gray-300 hidden sm:inline">
                                                        |
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <i className="fa-regular fa-eye"></i>{' '}
                                                        {book.viewCount}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <i className="fa-regular fa-heart text-pink-400"></i>{' '}
                                                        {book.favoriteCount ||
                                                            0}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative group/action shrink-0 w-full sm:w-auto flex justify-end mt-2 sm:mt-0">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-colors relative z-10 bg-transparent group-hover:bg-white">
                                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                                </button>

                                                <div className="absolute right-full top-1/2 -translate-y-1/2 pr-3 py-4 flex items-center gap-2 opacity-0 translate-x-4 pointer-events-none group-hover/action:pointer-events-auto group-hover/action:opacity-100 group-hover/action:translate-x-0 transition-all duration-300 ease-out z-0">
                                                    {book.status === 0 && (
                                                        <button
                                                            onClick={() =>
                                                                handleApproveBook(
                                                                    book.id
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-green-600 hover:bg-green-50 hover:border-green-300 shadow-sm transition-all"
                                                            title="Duyệt bài viết"
                                                        >
                                                            <i className="fa-solid fa-check text-xs"></i>
                                                        </button>
                                                    )}

                                                    {(book.status === 1 ||
                                                        book.status === 2) && (
                                                        <button
                                                            onClick={() =>
                                                                handleToggleVisibility(
                                                                    book.id
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 shadow-sm transition-all"
                                                            title={
                                                                book.status ===
                                                                1
                                                                    ? 'Ẩn bài'
                                                                    : 'Hiện bài'
                                                            }
                                                        >
                                                            <i
                                                                className={`fa-solid ${book.status === 1 ? 'fa-eye-slash' : 'fa-eye'} text-xs`}
                                                            ></i>
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={`/admin/books/update/${book.id}`}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-sm transition-all"
                                                        title="Sửa"
                                                    >
                                                        <i className="fa-solid fa-pen text-xs"></i>
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            handleDeleteBook(
                                                                book.id
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm transition-all"
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
                    </div>
                </div>
            </div>
        </>
    );
}
