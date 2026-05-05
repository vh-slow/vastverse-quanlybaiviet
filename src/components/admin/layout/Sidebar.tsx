'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/src/services';

const SidebarDropdown = ({
    icon,
    title,
    children,
}: {
    icon: string;
    title: string;
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLUListElement>(null);

    return (
        <li>
            <a
                href="#"
                className={`nav-link has-dropdown ${isOpen ? 'open' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
            >
                <i className={icon}></i>
                <span>{title}</span>
                <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
            </a>
            <ul
                className="sub-menu"
                ref={contentRef}
                style={{
                    maxHeight: isOpen
                        ? `${contentRef.current?.scrollHeight}px`
                        : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.2s ease-in-out',
                }}
            >
                {children}
            </ul>
        </li>
    );
};

export default function Sidebar() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Lấy thông tin user và hàm logout từ Context
    const { user, logout } = useAuth();
    const router = useRouter();

    const toggleUserMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    // Hàm xử lý đăng xuất
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout(); // Xóa token và state
        router.push('/admin/login'); // Điều hướng về trang đăng nhập
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Xử lý link Avatar
    const avatarUrl = user?.avatar
        ? `${BASE_URL.replace('/api/', '')}${user.avatar}`
        : `https://placehold.co/48x48/3c50e0/ffffff?text=${user?.fullName?.charAt(0) || 'U'}`;

    return (
        <aside className="w-[270px] bg-aside text-white flex flex-col shrink-0">
            <div className="sidebar-logo">
                <Link
                    href="/admin"
                    className="flex items-center gap-3 text-white no-underline"
                >
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="w-9 h-9"
                    />
                    <h1 className="text-xl font-semibold">VastVerse</h1>
                </Link>
            </div>

            <div className="sidebar-actions">
                <Link href="/admin/books/create" className="action-btn-main">
                    <i className="fa-solid fa-plus"></i>
                    <span>Thêm Bài Viết</span>
                </Link>
                <a href="#" className="action-btn-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </a>
            </div>

            <nav className="sidebar-nav-scroll">
                <p className="nav-heading">PAGES</p>
                <ul className="flex flex-col gap-1.5">
                    <li>
                        <Link href="/admin" className="nav-link">
                            <i className="fa-solid fa-house fa-fw"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/admin/books" className="nav-link">
                            <i className="fa-solid fa-book fa-fw"></i>
                            <span>Quản Lý Bài Viết</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/admin/categories" className="nav-link">
                            <i className="fa-solid fa-network-wired fa-fw"></i>
                            <span>Quản Lý Danh Mục</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/admin/users" className="nav-link">
                            <i className="fa-solid fa-users fa-fw"></i>
                            <span>Quản Lý Người Dùng</span>
                        </Link>
                    </li>

                    <li>
                        <Link href="/admin/comments" className="nav-link">
                            <i className="fa-regular fa-comments fa-fw"></i>
                            <span>Quản Lý Bình Luận</span>
                        </Link>
                    </li>
                </ul>

                <p className="nav-heading">OUTLINE</p>
                <ul className="flex flex-col gap-1.5">
                    <li>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            className="nav-link"
                        >
                            <i className="fa-brands fa-facebook fa-fw"></i>
                            <span>@vh.slow</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-user" ref={userMenuRef}>
                <button
                    type="button"
                    className="user-avatar-button"
                    onClick={toggleUserMenu}
                >
                    <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                        <span className="block user-name truncate max-w-[130px]">
                            {user?.fullName || 'Administrator'}
                        </span>
                        <span className="block user-email truncate max-w-[130px]">
                            {`@${user?.username}`}
                        </span>
                    </div>
                    <i className="fa-solid fa-ellipsis-vertical ml-auto text-sidebar-link-color"></i>
                </button>

                <div
                    className={`user-dropdown-menu ${isUserMenuOpen ? 'open' : ''}`}
                >
                    {/* Dropdown Header */}
                    <div className="dropdown-header">
                        <img
                            src={avatarUrl}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <span className="block user-name truncate max-w-[140px]">
                                {user?.fullName || 'Administrator'}
                            </span>
                            <span className="block user-email truncate max-w-[140px]">
                                {`@${user?.username}`}
                            </span>
                        </div>
                    </div>

                    {/* Dropdown Links */}
                    <ul className="dropdown-links">
                        <li>
                            <Link href={`/admin/users/${user?.id}`}>
                                <i className="fa-regular fa-id-card fa-fw"></i>{' '}
                                Hồ sơ của tôi
                            </Link>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fa-solid fa-gear fa-fw"></i>
                                <span>Cài đặt tài khoản</span>
                                <i className="fa-solid fa-chevron-right ml-auto text-xs"></i>
                            </a>
                        </li>
                    </ul>

                    {/* Dropdown Actions */}
                    <div className="dropdown-actions">
                        <div className="dark-mode-toggle">
                            <i className="fa-regular fa-moon fa-fw"></i>
                            <span>Giao diện tối</span>
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <a
                            href="#"
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </a>
                    </div>
                </div>
            </div>
        </aside>
    );
}
