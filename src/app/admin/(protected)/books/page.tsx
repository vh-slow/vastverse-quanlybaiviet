'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../../../components/admin/layout/Header';
import { Category, Pagination } from '@/src/types';
import { apiCategory, BASE_URL } from '@/src/services';
import { apiBook } from '@/src/services/book';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BooksPage() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    const [categories, setCategories] = useState<Category[]>([]);

    const [filterStatus, setFilterStatus] = useState<'all' | '1' | '0' | '3'>(
        'all'
    );

    const [filterIsDeleted, setFilterIsDeleted] = useState<
        'active' | 'deleted'
    >('active');

    const [filterCategory, setFilterCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] =
        useState<string>('');

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                pageNumber: currentPage + 1,
                pageSize: pageSize,
            };

            if (filterStatus !== 'all') params.status = Number(filterStatus);

            params.isDeleted = filterIsDeleted === 'deleted';

            if (filterCategory !== '')
                params.categoryId = Number(filterCategory);
            if (debouncedSearchQuery !== '')
                params.searchQuery = debouncedSearchQuery;

            const response = await apiBook.getAdminBooks(params);

            setBooks(response.data);
            console.log('Books response:', response);

            setPaginationInfo(response);
        } catch (error) {
            console.error('Failed to fetch books:', error);
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        pageSize,
        filterStatus,
        filterIsDeleted,
        filterCategory,
        debouncedSearchQuery,
    ]);

    const handleDelete = async (id: number) => {
        try {
            await apiBook.deleteBookForAdmin(id);
            toast.success('Đã chuyển bài viết vào thùng rác');
            fetchBooks();
        } catch (error) {
            toast.error('Xóa bài viết thất bại');
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await apiBook.restoreBook(id);
            toast.success('Đã khôi phục bài viết');
            fetchBooks();
        } catch (error) {
            toast.error('Khôi phục bài viết thất bại');
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await apiBook.approveBook(id);
            toast.success('Đã duyệt bài viết thành công');
            fetchBooks();
        } catch (error) {
            toast.error('Duyệt bài viết thất bại');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiCategory.getAdminCategories({
                    page: 1,
                    size: 100,
                });
                setCategories(data.data || data.content || data);
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(0);
    }, [
        filterStatus,
        filterIsDeleted,
        filterCategory,
        debouncedSearchQuery,
        pageSize,
    ]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const breadcrumbs = [
        { name: 'Trang chủ', href: '/admin' },
        { name: 'Bài viết' },
    ];

    return (
        <>
            <Header title="Quản lý Bài viết" breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <div className="flex justify-start mb-6">
                    <Link href="/admin/books/create" className="create-btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.25rem"
                            height="1.25rem"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        >
                            <path d="M12 19v-7m0 0V5m0 7H5m7 0h7"></path>
                        </svg>
                        Viết bài mới
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 flex flex-col xl:flex-row justify-between items-center gap-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Show</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(0);
                                }}
                                className="border-gray-300 rounded-md shadow-sm h-9 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                            <span>entries</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Filter Status */}
                            <div className="filter-tabs">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`filter-tab-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                >
                                    Tất cả
                                </button>
                                <button
                                    onClick={() => setFilterStatus('1')}
                                    className={`filter-tab-btn ${filterStatus === '1' ? 'active' : ''}`}
                                >
                                    Công khai
                                </button>
                                <button
                                    onClick={() => setFilterStatus('0')}
                                    className={`filter-tab-btn ${filterStatus === '0' ? 'active' : ''}`}
                                >
                                    Chờ duyệt
                                </button>
                                <button
                                    onClick={() => setFilterStatus('3')}
                                    className={`filter-tab-btn ${filterStatus === '3' ? 'active' : ''}`}
                                >
                                    Đã khóa
                                </button>
                            </div>

                            {/* Filter IsDeleted */}
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
                                    Thùng rác
                                </button>
                            </div>

                            <select
                                value={filterCategory}
                                onChange={(e) =>
                                    setFilterCategory(e.target.value)
                                }
                                className="border border-gray-300 rounded-lg shadow-sm h-10 focus:border-blue-300 text-sm"
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm tiêu đề..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg w-full sm:w-48 text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <table className="w-full text-sm min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        #
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        Bài viết
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        Danh mục
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        Tác giả
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        Trạng thái
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        Lượt xem
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && books.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : books.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            Không tìm thấy bài viết nào.
                                        </td>
                                    </tr>
                                ) : (
                                    books.map((book, index) => (
                                        <tr
                                            key={book.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="p-4 font-medium text-gray-500">
                                                {currentPage * pageSize +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            book.thumbnail
                                                                ? `${BASE_URL.replace('/api/', '')}${book.thumbnail}`
                                                                : 'https://placehold.co/40x40/f1f5f9/334155?text=Img'
                                                        }
                                                        alt={book.title}
                                                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                'https://placehold.co/40x40/f1f5f9/334155?text=Img';
                                                        }}
                                                    />
                                                    <div className="w-48">
                                                        <p
                                                            className="font-medium text-gray-800 truncate"
                                                            title={book.title}
                                                        >
                                                            {book.title}
                                                        </p>
                                                        <p
                                                            className="text-gray-500 text-xs truncate"
                                                            title={
                                                                book.summary ||
                                                                'No summary'
                                                            }
                                                        >
                                                            {book.summary ||
                                                                'No summary'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {book.category?.name || 'N/A'}
                                            </td>
                                            <td className="p-4 text-gray-600 font-medium">
                                                {book.user?.username || 'N/A'}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                    ${
                                                        book.status === 1
                                                            ? 'bg-green-100 text-green-800'
                                                            : book.status === 0
                                                              ? 'bg-yellow-100 text-yellow-800'
                                                              : book.status ===
                                                                  2
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {book.status === 1
                                                        ? 'Công khai'
                                                        : book.status === 0
                                                          ? 'Chờ duyệt'
                                                          : book.status === 2
                                                            ? 'Đang ẩn'
                                                            : 'Bị khóa'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                <i className="fa-regular fa-eye mr-1"></i>{' '}
                                                {book.viewCount}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div
                                                    className="relative"
                                                    data-te-dropdown-ref
                                                >
                                                    <button
                                                        className="w-8 h-8 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                                                        data-te-dropdown-toggle-ref
                                                    >
                                                        <i className="fa-solid fa-ellipsis"></i>
                                                    </button>
                                                    <ul
                                                        className="action-dropdown"
                                                        data-te-dropdown-menu-ref
                                                    >
                                                        <li>
                                                            <Link
                                                                href={`/admin/books/${book.id}`}
                                                            >
                                                                <i className="fa-solid fa-eye fa-fw"></i>{' '}
                                                                Xem chi tiết
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                href={`/admin/books/update/${book.id}`}
                                                            >
                                                                <i className="fa-solid fa-pen fa-fw"></i>{' '}
                                                                Sửa
                                                            </Link>
                                                        </li>

                                                        {filterIsDeleted ===
                                                        'active' ? (
                                                            <>
                                                                {book.status ===
                                                                    0 && (
                                                                    <li>
                                                                        <a
                                                                            href="#"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.preventDefault();
                                                                                handleApprove(
                                                                                    book.id
                                                                                );
                                                                            }}
                                                                            className="text-green-600"
                                                                        >
                                                                            <i className="fa-solid fa-check fa-fw"></i>{' '}
                                                                            Duyệt
                                                                            bài
                                                                        </a>
                                                                    </li>
                                                                )}
                                                                <li>
                                                                    <a
                                                                        href="#"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            handleDelete(
                                                                                book.id
                                                                            );
                                                                        }}
                                                                        className="text-red-500"
                                                                    >
                                                                        <i className="fa-solid fa-trash fa-fw"></i>{' '}
                                                                        Xóa mềm
                                                                    </a>
                                                                </li>
                                                            </>
                                                        ) : (
                                                            <li>
                                                                <a
                                                                    href="#"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        handleRestore(
                                                                            book.id
                                                                        );
                                                                    }}
                                                                    className="text-blue-600"
                                                                >
                                                                    <i className="fa-solid fa-rotate-left fa-fw"></i>{' '}
                                                                    Khôi phục
                                                                </a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {paginationInfo && (
                        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
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
                                trong số {paginationInfo.totalRecords} bản ghi
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(0, prev - 1)
                                        )
                                    }
                                    disabled={paginationInfo.pageNumber === 1}
                                    className="px-3 py-1.5 border border-gray-400 rounded-md hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Trước
                                </button>

                                {Array.from({
                                    length: paginationInfo.totalPages,
                                }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx)}
                                        className={`w-9 h-9 border border-gray-400 rounded-md ${currentPage === idx ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
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
                                    className="px-3 py-1.5 border border-gray-400 rounded-md hover:bg-gray-100 disabled:opacity-50"
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
