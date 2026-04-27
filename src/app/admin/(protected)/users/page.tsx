'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../../../components/admin/layout/Header';
import { Pagination, User } from '@/src/types';
import { apiUser } from '@/src/services/user';
import { BASE_URL } from '@/src/services';
import { formatDate } from '@/src/utils/formatters';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    const [filterStatus, setFilterStatus] = useState<'all' | '1' | '2'>('all');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>(
        'all'
    );
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] =
        useState<string>('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                pageNumber: currentPage + 1,
                pageSize: pageSize,
            };

            if (filterStatus !== 'all') params.status = Number(filterStatus);
            if (filterRole !== 'all') params.role = filterRole;
            if (debouncedSearchQuery !== '')
                params.searchQuery = debouncedSearchQuery;

            const response = await apiUser.getAdminUsers(params);

            setUsers(response.data);
            setPaginationInfo({
                data: response.data,
                totalElements: response.totalRecords,
                totalPages: response.totalPages,
                size: response.pageSize,
                number: response.pageNumber - 1,
                first: response.pageNumber === 1,
                last:
                    response.pageNumber === response.totalPages ||
                    response.totalPages === 0,
                empty: response.totalRecords === 0,
            } as any);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, filterStatus, filterRole, debouncedSearchQuery]);

    const handleLock = async (id: number) => {
        if (
            !confirm(
                'Khóa tài khoản sẽ tự động khóa toàn bộ bài viết của người này. Tiếp tục?'
            )
        )
            return;
        try {
            const res = await apiUser.lockUser(id);
            toast.success(res.message || 'Đã khóa tài khoản');
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Khóa thất bại');
        }
    };

    const handleUnlock = async (id: number) => {
        try {
            const res = await apiUser.unlockUser(id);
            toast.success(res.message || 'Đã mở khóa tài khoản');
            fetchUsers();
        } catch (error) {
            toast.error('Mở khóa thất bại');
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
    }, [filterStatus, filterRole, debouncedSearchQuery, pageSize]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const breadcrumbs = [
        { name: 'Home', href: '/admin' },
        { name: 'Thành viên' },
    ];

    return (
        <>
            <Header title="Quản lý Thành viên" breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2 mt-4">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    {/* Toolbar */}
                    <div className="p-4 flex flex-col xl:flex-row justify-between items-center gap-4 border-b border-gray-200">
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
                                    onClick={() => setFilterRole('all')}
                                    className={`filter-tab-btn ${filterRole === 'all' ? 'active' : ''}`}
                                >
                                    Tất cả Role
                                </button>
                                <button
                                    onClick={() => setFilterRole('admin')}
                                    className={`filter-tab-btn ${filterRole === 'admin' ? 'active' : ''}`}
                                >
                                    Admin
                                </button>
                                <button
                                    onClick={() => setFilterRole('user')}
                                    className={`filter-tab-btn ${filterRole === 'user' ? 'active' : ''}`}
                                >
                                    User
                                </button>
                            </div>

                            <div className="filter-tabs">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`filter-tab-btn ${filterStatus === 'all' ? 'active' : ''}`}
                                >
                                    Tất cả TT
                                </button>
                                <button
                                    onClick={() => setFilterStatus('1')}
                                    className={`filter-tab-btn ${filterStatus === '1' ? 'active' : ''}`}
                                >
                                    Hoạt động
                                </button>
                                <button
                                    onClick={() => setFilterStatus('2')}
                                    className={`filter-tab-btn ${filterStatus === '2' ? 'active' : ''}`}
                                >
                                    Đã khóa
                                </button>
                            </div>

                            <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Tên, username, email..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-10 pl-10 pr-4 border border-gray-300 rounded-lg w-full sm:w-56 text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <table className="w-full text-sm min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        Hồ sơ
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600">
                                        Tài khoản
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        Quyền
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        Trạng thái
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        Ngày tham gia
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-gray-100 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                            >
                                {loading && users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            Không tìm thấy người dùng nào.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            user.avatar
                                                                ? `${BASE_URL.replace('/api/', '')}${user.avatar}`
                                                                : `https://placehold.co/40x40/e0e7ff/3730a3?text=${user.fullName.charAt(0)}`
                                                        }
                                                        alt={user.fullName}
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-800 truncate max-w-[150px]">
                                                            {user.fullName}
                                                        </p>
                                                        <p className="text-gray-500 text-xs">
                                                            ID: #{user.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                <p className="font-medium text-gray-800">
                                                    @{user.username}
                                                </p>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                                                >
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                >
                                                    {user.status === 1
                                                        ? 'Hoạt động'
                                                        : 'Bị Khóa'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center text-gray-600">
                                                {formatDate(user.createdAt)}
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
                                                                href={`/admin/users/${user.id}`}
                                                            >
                                                                <i className="fa-solid fa-eye fa-fw"></i>{' '}
                                                                Xem chi tiết
                                                            </Link>
                                                        </li>

                                                        {user.role !==
                                                            'admin' &&
                                                            (user.status ===
                                                            1 ? (
                                                                <li>
                                                                    <a
                                                                        href="#"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            handleLock(
                                                                                user.id
                                                                            );
                                                                        }}
                                                                        className="text-red-600"
                                                                    >
                                                                        <i className="fa-solid fa-lock fa-fw"></i>{' '}
                                                                        Khóa tài
                                                                        khoản
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
                                                                            handleUnlock(
                                                                                user.id
                                                                            );
                                                                        }}
                                                                        className="text-green-600"
                                                                    >
                                                                        <i className="fa-solid fa-unlock fa-fw"></i>{' '}
                                                                        Mở khóa
                                                                    </a>
                                                                </li>
                                                            ))}
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
                                {(paginationInfo as any).totalElements > 0
                                    ? currentPage * pageSize + 1
                                    : 0}{' '}
                                tới{' '}
                                {Math.min(
                                    (currentPage + 1) * pageSize,
                                    (paginationInfo as any).totalElements
                                )}{' '}
                                trong số {(paginationInfo as any).totalElements}{' '}
                                bản ghi
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(0, prev - 1)
                                        )
                                    }
                                    disabled={(paginationInfo as any).first}
                                    className="px-3 py-1.5 border border-gray-400 rounded-md hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                {Array.from({
                                    length: (paginationInfo as any).totalPages,
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
                                    disabled={(paginationInfo as any).last}
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
