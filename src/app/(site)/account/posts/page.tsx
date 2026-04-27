'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiBook } from '@/src/services/book';
import { BASE_URL } from '@/src/services';
import { Book, Pagination } from '@/src/types';
import { formatDate } from '@/src/utils/formatters';

export default function MyPostsPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    const [statusFilter, setStatusFilter] = useState<number | null>(null);

    const fetchMyBooks = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                pageNumber: currentPage + 1,
                pageSize: pageSize,
            };

            if (statusFilter !== null) {
                params.status = statusFilter;
            }

            const response = await apiBook.getMyBooks(params);
            setBooks(response.data);
            setPaginationInfo(response);
        } catch (error) {
            console.error('Failed to fetch my books:', error);
            toast.error('Không thể tải danh sách bài viết!');
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter]);

    useEffect(() => {
        setCurrentPage(0);
    }, [statusFilter]);

    useEffect(() => {
        fetchMyBooks();
    }, [fetchMyBooks]);

    const handleDelete = async (id: number) => {
        try {
            await apiBook.deleteBook(id);
            toast.success('Đã xóa bài viết!');
            fetchMyBooks();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Xóa bài viết thất bại!'
            );
        }
    };

    const handleToggleVisibility = async (id: number) => {
        try {
            const res = await apiBook.toggleVisibility(id);
            toast.success(res.message);
            fetchMyBooks();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Thao tác thất bại!');
        }
    };

    const renderStatusBadge = (status: number) => {
        switch (status) {
            case 1:
                return (
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">
                        Công khai
                    </span>
                );
            case 0:
                return (
                    <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">
                        Chờ duyệt
                    </span>
                );
            case 2:
                return (
                    <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-semibold">
                        Đã ẩn
                    </span>
                );
            case 3:
                return (
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold">
                        Bị khóa
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 m-0">
                        Bài viết của tôi
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý và theo dõi hiệu suất các nội dung bạn đã sáng
                        tạo.
                    </p>
                </div>
                <Link
                    href="/posts/create"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
                >
                    <i className="fa-solid fa-pen-nib"></i>
                    <span>Viết bài mới</span>
                </Link>
            </div>

            <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setStatusFilter(null)}
                    className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${statusFilter === null ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    Tất cả bài viết
                </button>
                <button
                    onClick={() => setStatusFilter(1)}
                    className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${statusFilter === 1 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    Đã xuất bản
                </button>
                <button
                    onClick={() => setStatusFilter(0)}
                    className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${statusFilter === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    Đang chờ duyệt
                </button>
                <button
                    onClick={() => setStatusFilter(2)}
                    className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${statusFilter === 2 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    Đã ẩn
                </button>
            </div>

            {/* Content List */}
            <div className="space-y-1">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex gap-4 p-4 rounded-xl animate-pulse"
                        >
                            <div className="w-24 h-16 sm:w-32 sm:h-20 bg-gray-200 rounded-lg shrink-0"></div>
                            <div className="flex-1 space-y-3 py-1">
                                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded mt-3"></div>
                            </div>
                        </div>
                    ))
                ) : books.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400 text-2xl">
                            <i className="fa-solid fa-box-open"></i>
                        </div>
                        <h3 className="text-gray-900 font-semibold">
                            Chưa có bài viết nào
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 mb-4">
                            Bạn chưa có bài viết nào trong mục này.
                        </p>
                    </div>
                ) : (
                    books.map((book) => (
                        <div
                            key={book.id}
                            className="group flex flex-col sm:flex-row gap-5 items-start sm:items-center p-4 rounded-xl hover:bg-gray-50 transition-colors bg-white border border-transparent"
                        >
                            {/* Thumbnail */}
                            <Link
                                href={`/${book.slug}`}
                                className="w-full sm:w-32 h-40 sm:h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-200 block relative"
                            >
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
                            </Link>

                            {/* Info */}
                            <div className="flex-1 min-w-0 py-1">
                                <h4 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1 leading-snug">
                                    <Link
                                        href={`/${book.slug}`}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {book.title}
                                    </Link>
                                </h4>

                                <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mt-2 text-xs sm:text-sm text-gray-500">
                                    {renderStatusBadge(book.status)}
                                    <span>{formatDate(book.createdAt)}</span>
                                    <span className="hidden sm:inline text-gray-300">
                                        |
                                    </span>
                                    <span
                                        className="flex items-center gap-1.5"
                                        title="Lượt xem"
                                    >
                                        <i className="fa-regular fa-eye"></i>{' '}
                                        {book.viewCount.toLocaleString()}
                                    </span>
                                    <span
                                        className="flex items-center gap-1.5"
                                        title="Lượt thích"
                                    >
                                        <i className="fa-regular fa-heart"></i>{' '}
                                        {book.favoriteCount || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="relative group/action shrink-0 w-full sm:w-auto flex justify-end">
                                <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors relative z-10 bg-white">
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                </button>

                                <div className="absolute right-full top-1/2 -translate-y-1/2 pr-3 py-4 flex items-center gap-2 opacity-0 translate-x-4 pointer-events-none group-hover/action:pointer-events-auto group-hover/action:opacity-100 group-hover/action:translate-x-0 transition-all duration-300 ease-out z-0">
                                    <Link
                                        href={`/posts/update/${book.id}`}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all"
                                        title="Chỉnh sửa"
                                    >
                                        <i className="fa-solid fa-pen text-xs"></i>
                                    </Link>

                                    {(book.status === 1 ||
                                        book.status === 2) && (
                                        <button
                                            onClick={() =>
                                                handleToggleVisibility(book.id)
                                            }
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-yellow-600 hover:border-yellow-300 hover:shadow-sm transition-all"
                                            title={
                                                book.status === 1
                                                    ? 'Ẩn bài viết'
                                                    : 'Hiện bài viết'
                                            }
                                        >
                                            <i
                                                className={`fa-solid ${book.status === 1 ? 'fa-eye-slash' : 'fa-eye'} text-xs`}
                                            ></i>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(book.id)}
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

            {paginationInfo && paginationInfo.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center gap-1 bg-white p-1 border border-gray-200 rounded-lg shadow-sm">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(0, prev - 1))
                            }
                            disabled={paginationInfo.pageNumber === 1}
                            className="px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                            Trang trước
                        </button>
                        {Array.from({ length: paginationInfo.totalPages }).map(
                            (_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx)}
                                    className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors ${
                                        currentPage === idx
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            )
                        )}
                        <button
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={
                                paginationInfo.pageNumber ===
                                paginationInfo.totalPages
                            }
                            className="px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
