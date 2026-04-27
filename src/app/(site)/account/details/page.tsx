'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiUser, BASE_URL } from '@/src/services';
import { useAuth } from '@/src/context/AuthContext';

export default function AccountDetailsPage() {
    const { user, refreshUser } = useAuth();

    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [originalData, setOriginalData] = useState<any>(null);

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyProfile = async () => {
            setLoading(true);
            try {
                const data = await apiUser.getMyProfile();
                setOriginalData(data);

                setUsername(data.username || '');
                setEmail(data.email || '');
                setFullName(data.fullName || '');
                setBio(data.bio || '');
                setAvatarUrl(data.avatar || '');
            } catch (error) {
                toast.error('Không thể tải thông tin hồ sơ!');
            } finally {
                setLoading(false);
            }
        };

        fetchMyProfile();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Kích thước ảnh tối đa là 2MB!');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (originalData) {
            setFullName(originalData.fullName || '');
            setBio(originalData.bio || '');
        }
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error('Vui lòng nhập Họ và Tên!');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('FullName', fullName.trim());

            if (bio.trim()) {
                formData.append('Bio', bio.trim());
            }

            if (imageFile) {
                formData.append('AvatarFile', imageFile);
            }

            const response = await apiUser.updateMyProfile(formData);

            toast.success('Cập nhật hồ sơ thành công!');
            setIsEditing(false);

            const newData = await apiUser.getMyProfile();
            setOriginalData(newData);
            setAvatarUrl(newData.avatar);

            if (refreshUser) refreshUser(newData);
        } catch (error: any) {
            console.error('Update profile error:', error);
            toast.error('Cập nhật thất bại, vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600"></i>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 m-0">
                        Thông tin cá nhân
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý hồ sơ công khai và chi tiết tài khoản của bạn.
                    </p>
                </div>
                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                    >
                        <i className="fa-solid fa-user-pen"></i>
                        <span>Chỉnh sửa hồ sơ</span>
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                <div className="relative mb-12">
                    <div className="h-32 w-full rounded-xl bg-gradient-to-r from-blue-400 to-purple-500"></div>

                    <div className="absolute -bottom-10 left-6 md:left-10 flex items-end gap-5">
                        <div className="relative w-28 h-28 shrink-0 rounded-full border-4 border-white shadow-md bg-white">
                            <img
                                src={
                                    imagePreview ||
                                    (avatarUrl
                                        ? `${BASE_URL.replace('/api/', '')}${avatarUrl}`
                                        : `https://placehold.co/150x150/e0e7ff/3730a3?text=${fullName?.charAt(0) || 'U'}`)
                                }
                                alt="Avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                            {isEditing && (
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                                    title="Đổi ảnh đại diện"
                                >
                                    <i className="fa-solid fa-camera text-sm"></i>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Tên đăng nhập (Username)
                        </label>
                        <div className="relative">
                            <i className="fa-solid fa-at absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                value={username}
                                readOnly
                                disabled
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Username không thể thay đổi.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Địa chỉ Email
                        </label>
                        <div className="relative">
                            <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                disabled
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Họ và Tên hiển thị{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            readOnly={!isEditing}
                            className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors ${
                                !isEditing
                                    ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-default'
                                    : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                            }`}
                            placeholder="Ví dụ: Nguyễn Văn A"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label
                            htmlFor="bio"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Tiểu sử (Bio)
                        </label>
                        <textarea
                            id="bio"
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            readOnly={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg text-sm transition-colors resize-none ${
                                !isEditing
                                    ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-default'
                                    : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                            }`}
                            placeholder={
                                isEditing
                                    ? 'Viết một chút về bản thân bạn...'
                                    : 'Người dùng chưa cập nhật tiểu sử.'
                            }
                        ></textarea>
                        <p className="text-xs text-gray-400 mt-1">
                            Thông tin này sẽ được hiển thị công khai trên các
                            bài viết của bạn.
                        </p>
                    </div>
                </div>

                {isEditing && (
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                        >
                            {isSubmitting && (
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                            )}
                            <span>Lưu thay đổi</span>
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
