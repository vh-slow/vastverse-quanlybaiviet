'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PageHeader from '@/src/components/site/PageHeader';
import { useAuth } from '@/src/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, user, isLoading: isAuthLoading } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isSubmittingRef = useRef(false);
    const hasToastedRef = useRef(false);

    const breadcrumbs = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Đăng nhập' },
    ];

    useEffect(() => {
        if (isSubmittingRef.current) return;

        if (!isAuthLoading && user) {
            if (!hasToastedRef.current) {
                toast.success('Bạn đã đăng nhập rồi!');
                hasToastedRef.current = true;
            }
            router.push('/');
        }
    }, [user, isAuthLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error('Vui lòng nhập tài khoản và mật khẩu!');
            return;
        }

        setIsLoading(true);
        isSubmittingRef.current = true;

        try {
            await login({ username, password });

            setTimeout(() => {
                toast.success('Đăng nhập thành công!');
            }, 300);

            router.push('/');
        } catch (error: any) {
            isSubmittingRef.current = false;
            console.error('Login failed', error);

            const errorMessage =
                error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PageHeader title="Tài khoản của tôi" breadcrumbs={breadcrumbs} />

            <section className="py-16 lg:py-20 bg-gray-50">
                <div className="container flex justify-center mx-auto px-4">
                    <div className="w-full max-w-lg bg-white p-8 lg:p-10 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Đăng Nhập
                            </h2>
                            <p className="mt-2 text-gray-500">
                                Nhập thông tin tài khoản của bạn để tiếp tục
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Tên đăng nhập (Username){' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    required
                                    placeholder="Nhập tên đăng nhập..."
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Mật khẩu{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        id="password"
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                        required
                                        placeholder="Nhập mật khẩu..."
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <i
                                            className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                        ></i>
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="text-gray-600 cursor-pointer"
                                    >
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading && (
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                    )}
                                    Đăng Nhập
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-6 text-sm">
                            <p className="text-gray-600">
                                Chưa có tài khoản?{' '}
                                <Link
                                    href="/register"
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    Đăng ký ngay!
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
