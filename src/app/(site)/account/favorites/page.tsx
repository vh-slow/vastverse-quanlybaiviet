'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiBook } from '@/src/services/book';
import { apiFavorite, BASE_URL } from '@/src/services';
import { Book } from '@/src/types';

export default function MyFavoritesPage() {
    const [favorites, setFavorites] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const response = await apiFavorite.getMyFavorites();
                setFavorites(response);
            } catch (error) {
                console.error('Lỗi tải danh sách yêu thích:', error);
                toast.error('Không thể tải danh sách bài viết yêu thích!');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 m-0">
                        Bài viết đã lưu
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Đọc lại những bài viết mà bạn đã yêu thích trên hệ
                        thống.
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors border border-gray-200 shrink-0"
                >
                    <i className="fa-solid fa-compass"></i>
                    <span>Khám phá thêm</span>
                </Link>
            </div>

            <div>
                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex gap-4 p-4 rounded-xl border border-gray-100 animate-pulse"
                            >
                                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rounded-xl shrink-0"></div>
                                <div className="flex-1 space-y-3 py-1">
                                    <div className="h-5 w-full bg-gray-200 rounded"></div>
                                    <div className="h-4 w-1/3 bg-gray-200 rounded mt-2"></div>
                                    <div className="h-4 w-1/4 bg-gray-200 rounded mt-auto pt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-pink-400 text-2xl">
                            <i className="fa-regular fa-heart"></i>
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg">
                            Chưa có bài viết yêu thích
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 mb-6">
                            Bạn chưa thả tim hoặc lưu bài viết nào.
                        </p>
                        <Link
                            href="/posts"
                            className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
                        >
                            Bắt đầu khám phá
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {favorites.map((favBook) => (
                            <div key={favBook.id} className="flex gap-4 group">
                                <Link
                                    href={`/${favBook.slug}`}
                                    className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-200"
                                >
                                    <img
                                        src={
                                            favBook.thumbnail
                                                ? `${BASE_URL.replace('/api/', '')}${favBook.thumbnail}`
                                                : 'https://placehold.co/150x150/f1f5f9/334155?text=Img'
                                        }
                                        alt="Saved"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                'https://placehold.co/150x100/f1f5f9/334155?text=Img';
                                        }}
                                    />
                                </Link>
                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        <Link href={`/${favBook.slug}`}>
                                            {favBook.title}
                                        </Link>
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Bởi {favBook.user?.fullName}
                                    </p>
                                    <button
                                        onClick={async () => {
                                            await apiFavorite.toggleFavorite(
                                                favBook.id
                                            );
                                            setFavorites((prev) =>
                                                prev.filter(
                                                    (b) => b.id !== favBook.id
                                                )
                                            );
                                        }}
                                        className="mt-auto text-xs font-semibold text-gray-400 text-pink-600 hover:text-yellow-600 flex items-center gap-1.5 self-start transition-colors"
                                    >
                                        <i className="fa-solid fa-bookmark"></i>{' '}
                                        Bỏ lưu
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
