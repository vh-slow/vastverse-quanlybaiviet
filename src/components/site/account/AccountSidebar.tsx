'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { BASE_URL } from '@/src/services';

export default function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();

    const isActive = (path: string) => {
        if (path === '/account') {
            return pathname === path;
        }
        return pathname.startsWith(path);
    };

    const getMenuClass = (path: string) => {
        return isActive(path)
            ? 'flex items-center gap-3 px-4 py-3 rounded-lg text-white bg-[#3c50e0] font-semibold shadow-sm'
            : 'flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors';
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        router.push('/login');
    };

    const avatarUrl = user?.avatar
        ? `${BASE_URL.replace('/api/', '')}${user.avatar}`
        : `https://placehold.co/128x128/e0e7ff/3730a3?text=${user?.fullName?.charAt(0) || 'U'}`;

    return (
        <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                {isLoading ? (
                    <div className="animate-pulse">
                        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200"></div>
                        <div className="h-6 w-3/5 mx-auto bg-gray-200 rounded-md"></div>
                        <p className="h-4 w-2/5 mx-auto bg-gray-200 rounded-md mt-2 mb-6"></p>
                    </div>
                ) : user ? (
                    <>
                        <img
                            src={avatarUrl}
                            alt="User Avatar"
                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
                        />
                        <h2 className="text-xl font-bold text-gray-900">
                            {user.fullName || user.username}
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            @{user.username}
                        </p>
                    </>
                ) : (
                    <div className="py-10">
                        <p className="text-gray-600">
                            Vui lòng đăng nhập để xem tài khoản.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                )}

                <nav className="space-y-2 text-left pt-4 border-t border-gray-100">
                    <Link href="/account" className={getMenuClass('/account')}>
                        <i className="fa-solid fa-table-columns fa-fw w-5"></i>
                        <span>Trang chủ</span>
                    </Link>
                    <Link
                        href="/account/details"
                        className={getMenuClass('/account/details')}
                    >
                        <i className="fa-solid fa-user-pen fa-fw w-5"></i>
                        <span>Thông tin cá nhân</span>
                    </Link>
                    <Link
                        href="/account/change-password"
                        className={getMenuClass('/account/change-password')}
                    >
                        <i className="fa-solid fa-shield-halved fa-fw w-5"></i>
                        <span>Đổi mật khẩu</span>
                    </Link>
                    <Link
                        href="/account/posts"
                        className={getMenuClass('/account/posts')}
                    >
                        <i className="fa-solid fa-pen-nib fa-fw w-5"></i>
                        <span>Bài viết của tôi</span>
                    </Link>
                    <Link
                        href="/account/favorites"
                        className={getMenuClass('/account/favorites')}
                    >
                        <i className="fa-solid fa-heart fa-fw w-5"></i>
                        <span>Bài viết yêu thích</span>
                    </Link>

                    <a
                        href="#"
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors mt-2"
                    >
                        <i className="fa-solid fa-right-from-bracket fa-fw w-5"></i>
                        <span>Đăng xuất</span>
                    </a>
                </nav>
            </div>
        </aside>
    );
}
