'use client';

import React, { FormEvent } from 'react';
import Link from 'next/link';

export default function Footer() {
    const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Cảm ơn bạn đã đăng ký bản tin VastVerse!');
    };

    return (
        <footer className="relative bg-[#0f172a] text-slate-400 font-sans overflow-hidden border-t border-slate-800/50">
            <div className="absolute -bottom-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-slate-800/40 pointer-events-none transition-transform duration-1000 ease-in-out"></div>
            <div className="absolute -top-[20%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-b from-blue-900/20 to-transparent blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-[5%] w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
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
                        <p className="text-sm leading-relaxed mb-8 text-slate-400">
                            Khám phá vũ trụ tri thức với những bài viết chuyên
                            sâu về Lập trình, UI/UX Design, và công nghệ. Nơi
                            hội tụ của những người đam mê sáng tạo.
                        </p>

                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-200 ease-out shadow-sm"
                                title="Facebook"
                            >
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-sky-500 hover:text-white hover:-translate-y-1 transition-all duration-200 ease-out shadow-sm"
                                title="Twitter"
                            >
                                <i className="fa-brands fa-twitter"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-blue-700 hover:text-white hover:-translate-y-1 transition-all duration-200 ease-out shadow-sm"
                                title="LinkedIn"
                            >
                                <i className="fa-brands fa-linkedin-in"></i>
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300 hover:bg-pink-600 hover:text-white hover:-translate-y-1 transition-all duration-200 ease-out shadow-sm"
                                title="Instagram"
                            >
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:ml-auto">
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6 relative inline-block">
                            Khám Phá
                            <span className="absolute -bottom-2 left-0 w-6 h-0.5 bg-blue-500 rounded"></span>
                        </h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="group">
                                <Link
                                    href="/category/lap-trinh-web"
                                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-blue-400"
                                >
                                    Lập trình Web
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    href="/category/ui-ux"
                                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-blue-400"
                                >
                                    Thiết kế UI/UX
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    href="/category/chuyen-nghe-it"
                                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-blue-400"
                                >
                                    Chuyện nghề IT
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    href="/category/tai-lieu"
                                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-blue-400"
                                >
                                    Tài liệu Tự học
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2 lg:ml-auto">
                        <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-6 relative inline-block">
                            VastVerse
                            <span className="absolute -bottom-2 left-0 w-6 h-0.5 bg-indigo-500 rounded"></span>
                        </h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="group">
                                <Link
                                    href="/about"
                                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-indigo-400"
                                >
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    href="/contact"
                                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-indigo-400"
                                >
                                    Liên hệ
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    href="/write-for-us"
                                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-indigo-400"
                                >
                                    Trở thành Tác giả
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    href="/faq"
                                    className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-indigo-400"
                                >
                                    Giải đáp (FAQ)
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4 relative z-10">
                        <div className="bg-slate-800/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-slate-700/50 shadow-xl">
                            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-3">
                                Đăng ký Bản tin
                            </h4>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                Nhận bài viết mới nhất và tài nguyên miễn phí
                                hàng tuần. Không Spam!
                            </p>

                            <form
                                onSubmit={handleSubscribe}
                                className="relative"
                            >
                                <div className="flex bg-[#0f172a] p-1.5 rounded-xl border border-slate-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 ease-out">
                                    <div className="pl-3 flex items-center justify-center text-slate-500">
                                        <i className="fa-regular fa-envelope"></i>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Nhập email của bạn..."
                                        required
                                        className="w-full bg-transparent text-white text-sm px-3 py-2.5 outline-none placeholder-slate-500"
                                    />
                                    <button
                                        type="submit"
                                        className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 ease-out shadow-md hover:shadow-blue-500/25 active:scale-95"
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= FOOTER BOTTOM ================= */}
            <div className="border-t border-slate-800/60 relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500 text-center md:text-left font-medium">
                        &copy; {new Date().getFullYear()} VastVerse. Đã đăng ký
                        bản quyền.
                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                        <Link
                            href="/terms"
                            className="hover:text-white transition-colors duration-200 ease-out"
                        >
                            Điều khoản
                        </Link>
                        <Link
                            href="/privacy"
                            className="hover:text-white transition-colors duration-200 ease-out"
                        >
                            Bảo mật
                        </Link>
                        <Link
                            href="/rss"
                            className="hover:text-orange-400 transition-colors duration-200 ease-out flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-rss"></i> RSS
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
