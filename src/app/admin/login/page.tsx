'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login({
                username: userName,
                password: userPassword,
            });
            toast.success('Đăng nhập thành công!');
            router.push('/admin');
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                'Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm max-w-md w-full mx-4">
                <h1 className="text-3xl font-bold text-[#1e293b] text-center mb-2">
                    Sign In to Your Account
                </h1>
                <p className="text-gray-500 text-center text-sm mb-8">
                    Enter your detail below
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Email / Username Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={userPassword}
                                onChange={(e) =>
                                    setUserPassword(e.target.value)
                                }
                                required
                                className="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <i className="fa-regular fa-eye-slash"></i>
                                ) : (
                                    <i className="fa-regular fa-eye"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            Remember me
                        </label>
                        <a
                            href="#"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 mt-4 bg-[#1e293b] text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? (
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <a
                        href="#"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Sign Up Now!
                    </a>
                </p>
            </div>
        </div>
    );
}
