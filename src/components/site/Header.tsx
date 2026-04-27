'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { BASE_URL } from '@/src/services';

function HeaderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryFromUrl = searchParams.get('query') || '';

    const [searchQuery, setSearchQuery] = useState(queryFromUrl);
    const { user, isLoading } = useAuth();

    useEffect(() => {
        setSearchQuery(queryFromUrl);
    }, [queryFromUrl]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set('query', value);
        } else {
            params.delete('query');
        }

        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            <header className="header-main">
                <div className="container header-container">
                    <Link href="/" className="logo flex items-center gap-2">
                        <img
                            src="/images/logo.png"
                            alt="VastVerse Logo"
                            className="logo-img w-10 h-10"
                        />
                        <h1 className="logo-text text-2xl font-bold text-blue-600">
                            VastVerse
                        </h1>
                    </Link>

                    <form
                        className="search-bar"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleInputChange}
                        />
                        <button type="button" className="search-button">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>

                    <div className="header-actions flex items-center gap-6">
                        {user && (
                            <Link
                                href="/posts/create"
                                className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors mb-[-10px]"
                            >
                                <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
                                <span className="text-[10px] font-bold mt-1 uppercase">
                                    Đăng bài
                                </span>
                            </Link>
                        )}
                        <div className="header-action">
                            <Link href={user ? '/account' : '/login'}>
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="currentColor"
                                    className="icon fill-blue"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10.9995 1.14581C8.59473 1.14581 6.64531 3.09524 6.64531 5.49998C6.64531 7.90472 8.59473 9.85415 10.9995 9.85415C13.4042 9.85415 15.3536 7.90472 15.3536 5.49998C15.3536 3.09524 13.4042 1.14581 10.9995 1.14581ZM8.02031 5.49998C8.02031 3.85463 9.35412 2.52081 10.9995 2.52081C12.6448 2.52081 13.9786 3.85463 13.9786 5.49998C13.9786 7.14533 12.6448 8.47915 10.9995 8.47915C9.35412 8.47915 8.02031 7.14533 8.02031 5.49998Z"
                                        fill=""
                                    ></path>
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10.9995 11.2291C8.87872 11.2291 6.92482 11.7112 5.47697 12.5256C4.05066 13.3279 2.97864 14.5439 2.97864 16.0416L2.97858 16.1351C2.97754 17.2001 2.97624 18.5368 4.14868 19.4916C4.7257 19.9614 5.53291 20.2956 6.6235 20.5163C7.71713 20.7377 9.14251 20.8541 10.9995 20.8541C12.8564 20.8541 14.2818 20.7377 15.3754 20.5163C16.466 20.2956 17.2732 19.9614 17.8503 19.4916C19.0227 18.5368 19.0214 17.2001 19.0204 16.1351L19.0203 16.0416C19.0203 14.5439 17.9483 13.3279 16.522 12.5256C15.0741 11.7112 13.1202 11.2291 10.9995 11.2291ZM4.35364 16.0416C4.35364 15.2612 4.92324 14.4147 6.15108 13.724C7.35737 13.0455 9.07014 12.6041 10.9995 12.6041C12.9288 12.6041 14.6416 13.0455 15.8479 13.724C17.0757 14.4147 17.6453 15.2612 17.6453 16.0416C17.6453 17.2405 17.6084 17.9153 16.982 18.4254C16.6424 18.702 16.0746 18.9719 15.1027 19.1686C14.1338 19.3648 12.8092 19.4791 10.9995 19.4791C9.18977 19.4791 7.86515 19.3648 6.89628 19.1686C5.92437 18.9719 5.35658 18.702 5.01693 18.4254C4.39059 17.9153 4.35364 17.2405 4.35364 16.0416Z"
                                        fill=""
                                    ></path>
                                </svg>
                                <div className="action-text account-text">
                                    <span className="label">Tài khoản</span>

                                    <span className="value block text-sm font-bold text-gray-800">
                                        {isLoading
                                            ? 'Đang tải...'
                                            : user
                                              ? user.fullName
                                              : 'Đăng nhập'}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <nav className="header-nav border-t border-gray-200">
                    <div className="container nav-container">
                        <ul className="nav-list">
                            <li>
                                <Link href="/" className="nav-link">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link href="/posts" className="nav-link">
                                    Bài viết
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="nav-link">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="nav-link">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>

                        <ul className="nav-list">
                            <li>
                                <Link href="#new-posts" className="nav-link">
                                    Mới nhất
                                </Link>
                            </li>
                            <li>
                                <Link href="#trending" className="nav-link">
                                    Nổi bật
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default function Header() {
    return (
        <Suspense fallback={null}>
            <HeaderContent />
        </Suspense>
    );
}
