'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../../../components/admin/layout/Header';
import { Category, Pagination } from '@/src/types';
import { apiCategory, BASE_URL } from '@/src/services';
import { formatDate } from '@/src/utils/formatters';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    // IsDeleted Filter
    const [filterIsDeleted, setFilterIsDeleted] = useState<
        'active' | 'deleted'
    >('active');

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] =
        useState<string>('');

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                pageNumber: currentPage + 1,
                pageSize: pageSize,
                isDeleted: filterIsDeleted === 'deleted',
            };

            if (debouncedSearchQuery !== '')
                params.searchQuery = debouncedSearchQuery;

            const response = await apiCategory.getAdminCategories(params);

            setCategories(response.data);
            setPaginationInfo(response);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, filterIsDeleted, debouncedSearchQuery]);

    const handleDelete = async (id: number) => {
        try {
            await apiCategory.deleteCategory(id);
            toast.success('Đã chuyển danh mục vào thùng rác');
            fetchCategories();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Xóa danh mục thất bại'
            );
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await apiCategory.restoreCategory(id);
            toast.success('Đã khôi phục danh mục');
            fetchCategories();
        } catch (error) {
            toast.error('Khôi phục danh mục thất bại');
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
        fetchCategories();
    }, [fetchCategories]);

    const breadcrumbs = [
        { name: 'Home', href: '/admin' },
        { name: 'Danh mục' },
    ];

    return (
        <>
            <Header title="Quản lý Danh mục" breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <div className="flex justify-start mb-6">
                    <Link
                        href="/admin/categories/create"
                        className="create-btn"
                    >
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
                        Thêm danh mục mới
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200">
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

                        <div className="flex items-center gap-3">
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

                            <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm danh mục..."
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
                                    <th className="p-4 text-left font-semibold text-gray-600 w-16">
                                        #
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600 w-24">
                                        Ảnh
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        Tên danh mục
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600 hidden md:table-cell">
                                        Mô tả
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        Ngày tạo
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600 w-24">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && categories.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            Không tìm thấy danh mục nào.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((cat, index) => (
                                        <tr
                                            key={cat.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="p-4 font-medium text-gray-500">
                                                {currentPage * pageSize +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="p-4">
                                                <img
                                                    src={
                                                        cat.image
                                                            ? `${BASE_URL.replace('/api/', '')}${cat.image}`
                                                            : 'https://placehold.co/40x40/f1f5f9/334155?text=Img'
                                                    }
                                                    alt={cat.name}
                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            'https://placehold.co/40x40/f1f5f9/334155?text=Img';
                                                    }}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium text-gray-800">
                                                    {cat.name}
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    /{cat.slug}
                                                </p>
                                            </td>
                                            <td className="p-4 text-gray-600 hidden md:table-cell max-w-xs truncate">
                                                {cat.description || (
                                                    <span className="text-gray-400 italic">
                                                        Không có mô tả
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {formatDate(cat.createdAt)}
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
                                                                href={`/admin/categories/update/${cat.id}`}
                                                            >
                                                                <i className="fa-solid fa-pen fa-fw"></i>{' '}
                                                                Sửa
                                                            </Link>
                                                        </li>

                                                        {filterIsDeleted ===
                                                        'active' ? (
                                                            <li>
                                                                <a
                                                                    href="#"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        handleDelete(
                                                                            cat.id
                                                                        );
                                                                    }}
                                                                    className="text-red-500"
                                                                >
                                                                    <i className="fa-solid fa-trash fa-fw"></i>{' '}
                                                                    Xóa mềm
                                                                </a>
                                                            </li>
                                                        ) : (
                                                            <li>
                                                                <a
                                                                    href="#"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        handleRestore(
                                                                            cat.id
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
