'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PageHeader from '@/src/components/site/PageHeader';
import { apiAuth } from '@/src/services';

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const breadcrumbs = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Đăng nhập', href: '/login' },
        { name: 'Quên mật khẩu' },
    ];

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Vui lòng nhập email!');
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiAuth.forgotPassword({ email });
            toast.success(
                res.message || 'Đã gửi mã xác nhận, vui lòng kiểm tra hộp thư!'
            );
            setStep(2);
        } catch (error: any) {
            if (error.response?.status === 429) {
                toast.error(
                    'Bạn thao tác quá nhanh! Vui lòng đợi 1 phút rồi thử lại.'
                );
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !newPassword) {
            toast.error('Vui lòng nhập đầy đủ mã xác thực và mật khẩu mới!');
            return;
        }

        setIsLoading(true);
        try {
            await apiAuth.resetPassword({
                email: email,
                token: otp,
                newPassword: newPassword,
            });

            toast.success('Đổi mật khẩu thành công!');
            setStep(3);
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                'Mã xác thực không đúng hoặc đã hết hạn!';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PageHeader title="Khôi phục tài khoản" breadcrumbs={breadcrumbs} />

            <section className="py-16 lg:py-20 bg-gray-50 min-h-[60vh] flex items-center">
                <div className="container flex justify-center mx-auto px-4">
                    <div className="w-full max-w-lg bg-white p-8 lg:p-10 rounded-xl border border-gray-200 shadow-sm">
                        {step === 1 && (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-[#1a202c]">
                                        Quên mật khẩu
                                    </h2>
                                    <p className="mt-2 text-gray-500">
                                        Nhập Email của bạn bên dưới.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSendEmail}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-1.5"
                                        >
                                            Email{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a202c]/20 focus:border-[#1a202c] transition-colors"
                                            required
                                            placeholder="example@gmail.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 btn-primary text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading && (
                                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                                        )}
                                        Gửi Email
                                    </button>
                                </form>

                                <div className="mt-8 flex items-center justify-center">
                                    <div className="border-t border-gray-200 flex-grow"></div>
                                    <span className="px-3 text-sm text-gray-400 bg-white">
                                        Or
                                    </span>
                                    <div className="border-t border-gray-200 flex-grow"></div>
                                </div>

                                <div className="text-center mt-6 text-sm">
                                    <p className="text-gray-600">
                                        Đã nhớ lại mật khẩu?{' '}
                                        <Link
                                            href="/login"
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Đăng nhập!
                                        </Link>
                                    </p>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-[#1a202c]">
                                        Nhập mã xác thực
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Mã gồm 6 chữ số đã được gửi đến <br />{' '}
                                        <b className="text-gray-800">{email}</b>
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleResetPassword}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Mã OTP
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center tracking-[0.5em] font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            maxLength={6}
                                            required
                                            placeholder="------"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                required
                                                placeholder="Nhập mật khẩu mới..."
                                                value={newPassword}
                                                onChange={(e) =>
                                                    setNewPassword(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <i
                                                    className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                                ></i>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 text-white rounded-lg font-medium btn-primary transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-70"
                                    >
                                        {isLoading && (
                                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                                        )}
                                        Cập nhật mật khẩu
                                    </button>
                                </form>
                                <div className="text-center mt-4">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-sm text-gray-500 hover:underline"
                                    >
                                        Không phải bạn? Nhập email khác?
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fa-solid fa-check text-3xl"></i>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Thành công!
                                </h2>
                                <p className="text-gray-500 mb-8">
                                    Mật khẩu của bạn đã được thay đổi. Vui lòng
                                    đăng nhập lại bằng mật khẩu mới.
                                </p>
                                <Link
                                    href="/login"
                                    className="w-full inline-block py-3 text-white rounded-lg font-medium btn-primary transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
