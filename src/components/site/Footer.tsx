'use client';

import React, { FormEvent } from 'react';
import Link from 'next/link';

export default function Footer() {
    const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Cảm ơn bạn đã đăng ký bản tin!');
    };

    return (
        <footer className="bg-gray-900 text-gray-400 font-sans border-t-4 border-blue-600">
            {/* FOOTER TOP */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
                    <div className="lg:col-span-4 pr-0 lg:pr-8 footer-col">
                        <Link href="/" className="footer-logo">
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                className="logo-img"
                            />

                            <span className="logo-text">VastVerse</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-8 text-gray-400">
                            Khám phá vũ trụ tri thức với những bài viết chuyên
                            sâu về Lập trình, UI/UX Design, và công nghệ. Hãy
                            cùng nhau học hỏi và xây dựng tương lai.
                        </p>

                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                                title="Facebook"
                            >
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all duration-300"
                                title="Twitter"
                            >
                                <i className="fa-brands fa-twitter"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all duration-300"
                                title="LinkedIn"
                            >
                                <i className="fa-brands fa-linkedin-in"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300"
                                title="Instagram"
                            >
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:ml-auto">
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6">
                            Khám Phá
                        </h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li>
                                <Link
                                    href="/category/lap-trinh-web"
                                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                >
                                    Lập trình Web
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/category/ui-ux"
                                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                >
                                    Thiết kế UI/UX
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/category/chuyen-nghe-it"
                                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                >
                                    Chuyện nghề IT
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/category/tu-hoc"
                                    className="hover:text-blue-400 transition-colors flex items-center gap-2"
                                >
                                    Tài liệu Tự học
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 lg:ml-auto">
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6">
                            VastVerse
                        </h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/write-for-us"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Trở thành Tác giả
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6">
                            Đăng ký Bản tin
                        </h4>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            Nhận những bài viết mới nhất, thủ thuật lập trình và
                            các tài nguyên miễn phí được gửi trực tiếp vào hộp
                            thư của bạn hàng tuần.
                        </p>

                        <form onSubmit={handleSubscribe} className="relative">
                            <div className="flex bg-gray-800 p-1.5 rounded-xl border border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                <div className="pl-3 flex items-center justify-center text-gray-500">
                                    <i className="fa-regular fa-envelope"></i>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn..."
                                    required
                                    className="w-full bg-transparent text-white text-sm px-3 py-2.5 outline-none placeholder-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                    Đăng ký
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 bg-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        &copy; {new Date().getFullYear()} VastVerse. Đã đăng ký
                        bản quyền.
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                        <Link
                            href="/terms"
                            className="hover:text-white transition-colors"
                        >
                            Điều khoản
                        </Link>
                        <Link
                            href="/privacy"
                            className="hover:text-white transition-colors"
                        >
                            Bảo mật
                        </Link>
                        <Link
                            href="/rss"
                            className="hover:text-orange-500 transition-colors flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-rss"></i> RSS
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
