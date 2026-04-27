'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/src/components/admin/layout/Header';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Category } from '@/src/types';
import { apiCategory, apiBook } from '@/src/services';
import RichTextEditor from '@/src/components/site/RichTextEditor';

export default function CreateBookPage() {
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [title, setTitle] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const titleRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiCategory.getAdminCategories({
                    page: 1,
                    size: 100,
                });
                setCategories(data.data || data.content || data);
            } catch (error) {
                console.error('Failed to load categories', error);
                toast.error('Không thể tải danh mục');
            }
        };
        fetchCategories();
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(e.target.value);
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                toast.error('Kích thước ảnh tối đa là 3MB!');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (
        e: React.FormEvent,
        asDraft: boolean = false
    ) => {
        e.preventDefault();

        const isEmptyContent =
            content.replace(/<[^>]*>?/gm, '').trim().length === 0;

        if (!title.trim() || !categoryId || isEmptyContent || !imageFile) {
            toast.error(
                'Vui lòng điền đầy đủ Tiêu đề, Nội dung, Danh mục và Ảnh đại diện!'
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('Title', title.trim());
            formData.append('CategoryId', categoryId);
            formData.append('Content', content);
            formData.append('ThumbnailFile', imageFile);

            if (summary.trim()) {
                formData.append('Summary', summary.trim());
            }

            await apiBook.createBookForAdmin(formData);

            toast.success('Đăng bài viết thành công!');
            router.push('/admin/books');
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi trong quá trình lưu bài viết!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const breadcrumbs = [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Bài viết', href: '/admin/books' },
        { name: 'Viết bài mới' },
    ];

    return (
        <>
            <Header title="Viết bài mới" breadcrumbs={breadcrumbs} />

            <div className="flex-1 px-6 py-6 bg-gray-50/50">
                <form
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto"
                    onSubmit={(e) => handleSubmit(e, false)}
                >
                    <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col p-8">
                        <textarea
                            ref={titleRef}
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="w-full text-3xl md:text-4xl font-extrabold text-gray-900 placeholder-gray-300 bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden leading-tight mb-4"
                            rows={1}
                        />

                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                        />
                    </div>

                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <i className="fa-regular fa-image text-blue-500"></i>{' '}
                                Ảnh đại diện{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group rounded-lg overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors min-h-[160px] flex items-center justify-center">
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
                                            <span className="text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-md">
                                                Đổi ảnh khác
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-400 p-4">
                                        <i className="fa-solid fa-cloud-arrow-up text-3xl mb-2 group-hover:text-blue-500 transition-colors"></i>
                                        <p className="text-sm font-medium text-gray-600">
                                            Click hoặc kéo thả ảnh
                                        </p>
                                        <p className="text-xs mt-1 text-gray-400">
                                            JPG, PNG (Khuyên dùng 16:9)
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    required={!imagePreview}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"
                                >
                                    <i className="fa-solid fa-layer-group text-blue-500"></i>{' '}
                                    Danh mục{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    value={categoryId}
                                    onChange={(e) =>
                                        setCategoryId(e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>
                                        -- Chọn danh mục --
                                    </option>
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="summary"
                                    className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"
                                >
                                    <i className="fa-solid fa-align-left text-blue-500"></i>{' '}
                                    Mô tả tóm tắt
                                </label>
                                <textarea
                                    id="summary"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none h-28"
                                    placeholder="Đoạn giới thiệu ngắn về bài viết..."
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={(e) => router.back()}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-70 text-sm"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-sm shadow-sm"
                            >
                                {isSubmitting && (
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                )}
                                Xuất Bản
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
