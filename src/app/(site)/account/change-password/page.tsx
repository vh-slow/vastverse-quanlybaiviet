'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { apiUser } from '@/src/services/user';

export default function ChangePasswordPage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClear = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('Vui lòng điền đầy đủ các trường mật khẩu!');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }

        if (newPassword === oldPassword) {
            toast.error('Mật khẩu mới không được trùng với mật khẩu cũ!');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        setIsSubmitting(true);

        try {
            await apiUser.changePassword({
                oldPassword,
                newPassword,
            });

            toast.success('Đổi mật khẩu thành công!');
            handleClear();
        } catch (error: any) {
            console.error('Change password failed:', error);
            const errorMsg =
                error.response?.data?.message ||
                error.response?.data ||
                'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại!';
            toast.error(
                typeof errorMsg === 'string'
                    ? errorMsg
                    : 'Đổi mật khẩu thất bại!'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 m-0">
                    Đổi mật khẩu
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Quản lý mật khẩu để bảo vệ tài khoản của bạn luôn an toàn.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Mật khẩu hiện tại{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    placeholder="Nhập mật khẩu hiện tại"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <i
                                        className={`fa-regular ${showCurrent ? 'fa-eye-slash' : 'fa-eye'}`}
                                    ></i>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Mật khẩu mới{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    placeholder="Nhập mật khẩu mới"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <i
                                        className={`fa-regular ${showNew ? 'fa-eye-slash' : 'fa-eye'}`}
                                    ></i>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Xác nhận mật khẩu mới{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className={`w-full pl-4 pr-10 py-2.5 bg-gray-50 border rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                                        confirmPassword &&
                                        confirmPassword !== newPassword
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-200 focus:border-blue-500'
                                    }`}
                                    placeholder="Nhập lại mật khẩu mới"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <i
                                        className={`fa-regular ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}
                                    ></i>
                                </button>
                            </div>
                            {confirmPassword &&
                                confirmPassword !== newPassword && (
                                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                                        <i className="fa-solid fa-circle-exclamation"></i>{' '}
                                        Mật khẩu xác nhận không khớp!
                                    </p>
                                )}
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClear}
                                disabled={
                                    isSubmitting ||
                                    (!oldPassword &&
                                        !newPassword &&
                                        !confirmPassword)
                                }
                                className="px-6 py-2.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                            >
                                {isSubmitting ? (
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                ) : (
                                    <i className="fa-solid fa-check"></i>
                                )}
                                <span>Cập nhật mật khẩu</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-5">
                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl">
                        <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-shield-cat text-blue-600"></i>
                            Yêu cầu về mật khẩu
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-start gap-2">
                                <i className="fa-solid fa-circle-check text-green-500 mt-0.5 text-xs"></i>
                                <span>
                                    Độ dài tối thiểu <strong>6 ký tự</strong>.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <i className="fa-solid fa-circle-check text-green-500 mt-0.5 text-xs"></i>
                                <span>
                                    Nên chứa ít nhất một chữ hoa và một chữ số.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <i className="fa-solid fa-circle-check text-green-500 mt-0.5 text-xs"></i>
                                <span>
                                    Tránh sử dụng các mật khẩu dễ đoán như
                                    123456, ngày sinh hoặc tên của bạn.
                                </span>
                            </li>
                        </ul>

                        <div className="mt-5 pt-5 border-t border-blue-100/60">
                            <h4 className="text-sm font-bold text-gray-800 mb-2">
                                Bạn quên mật khẩu hiện tại?
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-3">
                                Nếu bạn không nhớ mật khẩu hiện tại, vui lòng
                                đăng xuất và sử dụng chức năng "Quên mật khẩu"
                                tại trang đăng nhập để đặt lại.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
