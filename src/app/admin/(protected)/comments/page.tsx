'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/src/components/admin/layout/Header';
import { Comment, Pagination } from '@/src/types';
import { apiComment } from '@/src/services/comment';
import { BASE_URL } from '@/src/services';
import { formatDateTime } from '@/src/utils/formatters';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    const [filterIsDeleted, setFilterIsDeleted] = useState<
        'active' | 'deleted'
    >('active');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] =
        useState<string>('');

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                pageNumber: currentPage + 1,
                pageSize: pageSize,
                isDeleted: filterIsDeleted === 'deleted',
            };

            if (debouncedSearchQuery !== '')
                params.searchQuery = debouncedSearchQuery;

            const response = await apiComment.getAdminComments(params);

            setComments(response.data);
            setPaginationInfo(response);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            toast.error('Lỗi khi tải danh sách bình luận');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, filterIsDeleted, debouncedSearchQuery]);

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn ẩn bình luận này khỏi bài viết?'))
            return;
        try {
            await apiComment.deleteCommentForAdmin(id);
            toast.success('Đã ẩn bình luận vi phạm!');
            fetchComments();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Ẩn bình luận thất bại!'
            );
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await apiComment.restoreComment(id);
            toast.success('Đã khôi phục bình luận!');
            fetchComments();
        } catch (error) {
            toast.error('Khôi phục bình luận thất bại!');
        }
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(0);
    }, [filterIsDeleted, debouncedSearchQuery, pageSize]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const breadcrumbs = [
        { name: 'Trang chủ', href: '/admin' },
        { name: 'Bình luận' },
    ];

    return (
        <>
            <Header title="Quản Lý Bình Luận" breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2 mt-4">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 bg-gray-50/30 rounded-t-xl">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Hiển thị</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(0);
                                }}
                                className="border-gray-300 rounded-md shadow-sm h-9 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span>bản ghi</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="filter-tabs">
                                <button
                                    onClick={() => setFilterIsDeleted('active')}
                                    className={`filter-tab-btn ${filterIsDeleted === 'active' ? 'active' : ''}`}
                                >
                                    Hoạt động
                                </button>
                                <button
                                    onClick={() =>
                                        setFilterIsDeleted('deleted')
                                    }
                                    className={`filter-tab-btn ${filterIsDeleted === 'deleted' ? 'active' : ''}`}
                                >
                                    Đã ẩn
                                </button>
                            </div>

                            <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm nội dung, tên tác giả..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg w-full sm:w-64 text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                                    <th className="p-4 font-semibold text-gray-600 w-16">
                                        #
                                    </th>
                                    <th className="p-4 font-semibold text-gray-600 w-48">
                                        Người đăng
                                    </th>
                                    <th className="p-4 font-semibold text-gray-600">
                                        Nội dung bình luận
                                    </th>
                                    <th className="p-4 font-semibold text-gray-600 w-40 text-center">
                                        Thời gian
                                    </th>
                                    <th className="p-4 font-semibold text-gray-600 w-24 text-center">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && comments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : comments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            Không có bình luận nào.
                                        </td>
                                    </tr>
                                ) : (
                                    comments.map((comment, index) => (
                                        <tr
                                            key={comment.id}
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="p-4 font-medium text-gray-500">
                                                {currentPage * pageSize +
                                                    index +
                                                    1}
                                            </td>

                                            {/* User Info */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            comment.user?.avatar
                                                                ? `${BASE_URL.replace('/api/', '')}${comment.user.avatar}`
                                                                : `https://placehold.co/40x40/e0e7ff/3730a3?text=${comment.user?.fullName?.charAt(0) || 'U'}`
                                                        }
                                                        alt={
                                                            comment.user
                                                                ?.fullName
                                                        }
                                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-800 truncate max-w-[120px]">
                                                            {
                                                                comment.user
                                                                    ?.fullName
                                                            }
                                                        </p>
                                                        <p className="text-gray-500 text-xs">
                                                            @
                                                            {
                                                                comment.user
                                                                    ?.username
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Comment Content & Book Link */}
                                            <td className="p-4">
                                                <p
                                                    className="text-gray-800 line-clamp-2 leading-relaxed mb-1"
                                                    title={comment.content}
                                                >
                                                    {comment.content}
                                                </p>
                                                <Link
                                                    href={`/admin/books/${comment.bookId}`}
                                                    className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <i className="fa-solid fa-link"></i>{' '}
                                                    Xem trong bài viết #
                                                    {comment.bookId}
                                                </Link>
                                            </td>

                                            <td className="p-4 text-center text-gray-600 text-xs whitespace-nowrap">
                                                {formatDateTime(
                                                    comment.createdAt
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-center">
                                                {filterIsDeleted ===
                                                'active' ? (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                comment.id
                                                            )
                                                        }
                                                        title="Ẩn bình luận này"
                                                        className="w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                    >
                                                        <i className="fa-solid fa-eye-slash"></i>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleRestore(
                                                                comment.id
                                                            )
                                                        }
                                                        title="Khôi phục bình luận"
                                                        className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                    >
                                                        <i className="fa-solid fa-rotate-left"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {paginationInfo && (
                        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-gray-100">
                            <span className="text-sm text-gray-600">
                                Đang hiển thị{' '}
                                {paginationInfo.totalRecords > 0
                                    ? (paginationInfo.pageNumber - 1) *
                                          paginationInfo.pageSize +
                                      1
                                    : 0}{' '}
                                tới{' '}
                                {Math.min(
                                    paginationInfo.pageNumber *
                                        paginationInfo.pageSize,
                                    paginationInfo.totalRecords
                                )}{' '}
                                trong số {paginationInfo.totalRecords} bình luận
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(0, prev - 1)
                                        )
                                    }
                                    disabled={paginationInfo.pageNumber === 1}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Trước
                                </button>

                                {Array.from({
                                    length: paginationInfo.totalPages,
                                }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx)}
                                        className={`w-9 h-9 border rounded-md transition-colors ${currentPage === idx ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    disabled={
                                        paginationInfo.pageNumber ===
                                            paginationInfo.totalPages ||
                                        paginationInfo.totalPages === 0
                                    }
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Tiếp
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
