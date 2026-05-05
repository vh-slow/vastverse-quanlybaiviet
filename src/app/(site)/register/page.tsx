'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PageHeader from '@/src/components/site/PageHeader';
import { useAuth } from '@/src/context/AuthContext';
import { apiAuth } from '@/src/services';

export default function RegisterPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isSubmittingRef = useRef(false);
    const hasToastedRef = useRef(false);

    const breadcrumbs = [{ name: 'Trang chủ', href: '/' }, { name: 'Đăng ký' }];

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

        setIsLoading(true);
        isSubmittingRef.current = true;

        try {
            const response = await apiAuth.register({
                username,
                fullName,
                email,
                password,
            });

            setTimeout(() => {
                toast.success(
                    response.message ||
                        'Đăng ký thành công! Đang chuyển hướng...'
                );
            }, 300);

            router.push('/login');
        } catch (error: any) {
            isSubmittingRef.current = false;
            console.error('Registration failed', error);

            const errorMsg =
                typeof error.response?.data === 'string'
                    ? error.response.data
                    : error.response?.data?.message ||
                      'Đăng ký thất bại! Vui lòng thử lại.';

            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PageHeader title="Tạo tài khoản" breadcrumbs={breadcrumbs} />

            <section className="py-16 lg:py-20 bg-gray-50">
                <div className="container flex justify-center mx-auto px-4">
                    <div className="w-full max-w-lg bg-white p-8 lg:p-10 rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Đăng Ký Tài Khoản
                            </h2>
                            <p className="mt-2 text-gray-500">
                                Điền thông tin dưới đây để trở thành thành viên
                                của VastVerse
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* FullName Input */}
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Họ và Tên{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    required
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                />
                            </div>
                            {/* Email Input */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Địa chỉ Email{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    required
                                    placeholder="Địa chỉ Email của bạn..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {/* Username Input */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                    Tên đăng nhập{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    required
                                    placeholder="Tên đăng nhập viết liền không dấu..."
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>
                            {/* Password Input */}
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
                                        placeholder="Mật khẩu từ 6 ký tự trở lên..."
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
                            
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 btn-primary text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading && (
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                    )}
                                    Tạo Tài Khoản
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-6 text-sm">
                            <p className="text-gray-600">
                                Đã có tài khoản?{' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    Đăng nhập ngay!
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
