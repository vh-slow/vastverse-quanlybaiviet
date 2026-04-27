'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/src/components/admin/layout/Header';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiCategory, BASE_URL } from '@/src/services';

export default function UpdateCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = Number(params.id);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const data = await apiCategory.getCategoryById(categoryId);
                setName(data.name);
                setDescription(data.description || '');
                if (data.image) {
                    setImagePreview(
                        `${BASE_URL.replace('/api/', '')}${data.image}`
                    );
                }
            } catch (error) {
                toast.error('Không thể tải thông tin danh mục!');
                router.push('/admin/categories');
            } finally {
                setIsLoading(false);
            }
        };
        if (categoryId) fetchCategory();
    }, [categoryId, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast.error('Vui lòng nhập tên danh mục!');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('Name', name);
            if (description) formData.append('Description', description);

            if (imageFile) formData.append('ImageFile', imageFile);

            await apiCategory.updateCategory(categoryId, formData);

            toast.success('Cập nhật danh mục thành công!');
            router.push('/admin/categories');
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi cập nhật!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: 'Home', href: '/admin' },
        { name: 'Danh mục', href: '/admin/categories' },
        { name: 'Cập nhật' },
    ];

    if (isLoading) {
        return (
            <div className="flex-1 flex justify-center items-center h-full">
                <div className="text-gray-500">
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>{' '}
                    Đang tải dữ liệu...
                </div>
            </div>
        );
    }

    return (
        <>
            <Header title="Cập nhật Danh mục" breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-2">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                            Chỉnh sửa Danh mục
                        </h2>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="name" className="form-label">
                                    Tên danh mục{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="form-label"
                                >
                                    Mô tả
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="form-input"
                                ></textarea>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="form-label">Ảnh đại diện</label>
                            <div
                                id="image-upload-zone"
                                className="file-upload-zone relative overflow-hidden flex justify-center items-center min-h-[160px] border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-contain p-2 z-0"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex justify-center items-center z-10">
                                            <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg">
                                                <i className="fa-solid fa-camera mr-2"></i>{' '}
                                                Nhấn để đổi ảnh mới
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        id="upload-prompt"
                                        className="text-center z-10 pointer-events-none"
                                    >
                                        <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400"></i>
                                        <p className="mt-2 text-sm text-gray-600">
                                            <span className="font-semibold text-blue-600">
                                                Click để tải lên
                                            </span>{' '}
                                            hoặc kéo thả ảnh
                                        </p>
                                    </div>
                                )}
                                <input
                                    id="image-input"
                                    type="file"
                                    onChange={handleImageChange}
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-20"
                                    accept="image/*"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                * Bỏ trống nếu bạn muốn giữ lại ảnh đại diện cũ.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pb-8">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/categories')}
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting && (
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                            )}
                            Lưu Thay Đổi
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
