'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiBook } from '@/src/services/book';
import { apiCategory, BASE_URL } from '@/src/services';
import { Category } from '@/src/types';
import Link from 'next/link';
import RichTextEditor from '@/src/components/site/RichTextEditor';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [oldThumbnail, setOldThumbnail] = useState<string | null>(null);

    const titleRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoadingData(true);
            try {
                const [catData, bookData] = await Promise.all([
                    apiCategory.getAllCategories(),
                    apiBook.getBookById(id),
                ]);

                setCategories(catData.data || catData.content || catData);

                setTitle(bookData.title || '');
                setContent(bookData.content || '');
                setSummary(bookData.summary || '');
                setCategoryId(bookData.category?.id || '');
                setOldThumbnail(bookData.thumbnail);
            } catch (error) {
                console.error(error);
                toast.error(
                    'Không thể tải dữ liệu bài viết. Có thể bài viết đã bị xóa!'
                );
                router.push('/account/posts');
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) fetchInitialData();
    }, [id, router]);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
        }
    }, [title]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isEmptyContent =
            content.replace(/<[^>]*>?/gm, '').trim().length === 0;

        if (!title.trim() || isEmptyContent || !categoryId) {
            toast.error('Vui lòng điền đủ Tiêu đề, Nội dung và Chọn Chủ đề!');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('Title', title.trim());
            formData.append('Content', content);
            formData.append('CategoryId', categoryId.toString());

            if (summary.trim()) {
                formData.append('Summary', summary.trim());
            }

            if (imageFile) {
                formData.append('ThumbnailFile', imageFile);
            }

            const response = await apiBook.updateBook(id, formData);
            toast.success(response.message || 'Cập nhật bài viết thành công!');

            router.push('/account/posts');
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Không thể cập nhật bài viết!'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600"></i>
                    <p className="text-gray-500 font-medium">
                        Đang tải dữ liệu bài viết...
                    </p>
                </div>
            </div>
        );
    }

    const displayImage = imagePreview
        ? imagePreview
        : oldThumbnail
          ? `${BASE_URL.replace('/api/', '')}${oldThumbnail}`
          : null;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 animate-fade-in-up">
            {/* Topbar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/account/posts"
                            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </Link>
                        <span className="text-gray-400 font-medium text-sm hidden sm:inline">
                            Chỉnh sửa bài viết
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-yellow-600 font-medium bg-yellow-50 px-3 py-1 rounded-full mr-2 hidden sm:inline">
                            Đang chỉnh sửa
                        </span>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-60 shadow-sm"
                        >
                            {isSubmitting ? (
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                            ) : (
                                <i className="fa-solid fa-check"></i>
                            )}
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>

            <form className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col p-8 sm:p-10">
                    <textarea
                        ref={titleRef}
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Nhập tiêu đề bài viết..."
                        className="w-full text-4xl sm:text-5xl font-extrabold text-gray-900 placeholder-gray-300 bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden leading-tight"
                        rows={1}
                    />

                    <RichTextEditor content={content} onChange={setContent} />
                </div>

                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="fa-regular fa-image text-blue-500"></i>{' '}
                            Ảnh bìa (Thumbnail)
                        </h3>

                        <div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            {displayImage ? (
                                <div className="aspect-video relative">
                                    <img
                                        src={displayImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                'https://placehold.co/800x450/f1f5f9/334155?text=Lỗi+Ảnh';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                                            Nhấn để đổi ảnh khác
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video flex flex-col items-center justify-center text-gray-400 p-6 text-center cursor-pointer">
                                    <i className="fa-solid fa-cloud-arrow-up text-3xl mb-2 text-gray-300 group-hover:text-blue-500 transition-colors"></i>
                                    <p className="text-sm font-medium">
                                        Chưa có ảnh. Nhấn để tải lên
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        </div>
                        {imageFile && (
                            <p className="text-xs text-green-600 mt-2 font-medium">
                                <i className="fa-solid fa-check-circle"></i> Đã
                                chọn ảnh mới
                            </p>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <i className="fa-solid fa-layer-group text-blue-500"></i>{' '}
                                Chủ đề <span className="text-red-500">*</span>
                            </h3>
                            <select
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(Number(e.target.value))
                                }
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                            >
                                <option value="" disabled>
                                    -- Chọn chủ đề bài viết --
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <i className="fa-solid fa-align-left text-blue-500"></i>{' '}
                                Mô tả ngắn (SEO)
                            </h3>
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Viết 1-2 câu tóm tắt nội dung..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none h-28"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
