import React from 'react';
import Link from 'next/link';
import { Book } from '@/src/types';
import { BASE_URL } from '@/src/services';
import { formatDate } from '@/src/utils/formatters';

export default function BookCard({ book }: { book: Book }) {
    const imageUrl = book.thumbnail
        ? `${BASE_URL.replace('/api/', '')}${book.thumbnail}`
        : 'https://placehold.co/600x400/f1f5f9/334155?text=Thumbnail';

    const avatarUrl = book.user?.avatar
        ? `${BASE_URL.replace('/api/', '')}${book.user.avatar}`
        : `https://placehold.co/32x32/e0e7ff/3730a3?text=${book.user?.fullName?.charAt(0) || 'U'}`;

    return (
        <article className="group flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden">
            <Link
                href={`/${book.slug}`}
                className="relative md:w-[40%] aspect-video md:aspect-[4/3] lg:aspect-[3/2] overflow-hidden shrink-0 block bg-gray-100"
            >
                <img
                    src={imageUrl}
                    alt={book.title}
                    onError={(e) => {
                        e.currentTarget.src =
                            'https://placehold.co/600x400/f1f5f9/334155?text=Lỗi+Ảnh';
                    }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </Link>

            <div className="flex flex-col flex-1 p-5 md:p-4 lg:p-5">
                <Link href={`/${book.slug}`}>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 leading-snug">
                        {book.title}
                    </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                        <img
                            src={avatarUrl}
                            alt={book.user?.fullName}
                            className="w-6 h-6 rounded-full border border-gray-200 object-cover"
                        />
                        <span className="font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                            {book.user?.fullName || 'Tác giả'}
                        </span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <div className="flex items-center gap-1.5">
                        <i className="fa-regular fa-calendar"></i>
                        <span>{formatDate(book.createdAt)}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                        {book.category?.name || 'Không phân loại'}
                    </span>
                </div>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-2 mb-5">
                    {book.summary || 'Không có mô tả tóm tắt cho bài viết này.'}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {(book as any).tags && (book as any).tags.length > 0 ? (
                            <>
                                {(book as any).tags
                                    .slice(0, 2)
                                    .map((tag: string, index: number) => (
                                        <Link
                                            key={index}
                                            href={`/?query=${encodeURIComponent('#' + tag)}`}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        >
                                            <i className="fa-solid fa-hashtag text-[10px] text-gray-400"></i>
                                            {tag}
                                        </Link>
                                    ))}
                                {(book as any).tags.length > 2 && (
                                    <span className="text-xs text-gray-400 font-medium">
                                        +{(book as any).tags.length - 2}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-xs text-gray-400 italic"></span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 shrink-0 ml-2">
                        <div
                            className="flex items-center gap-1.5"
                            title="Lượt xem"
                        >
                            <i className="fa-regular fa-eye text-gray-400"></i>
                            <span>
                                {(
                                    (book as any).viewCount || 0
                                ).toLocaleString()}
                            </span>
                        </div>
                        <div
                            className="flex items-center gap-1.5"
                            title="Lượt yêu thích"
                        >
                            <i
                                className={`fa-heart ${
                                    (book as any).isFavorited
                                        ? 'fa-solid text-red-500'
                                        : 'fa-regular text-gray-400'
                                }`}
                            ></i>
                            <span
                                className={
                                    (book as any).isFavorited
                                        ? 'text-red-500'
                                        : ''
                                }
                            >
                                {(book as any).favoriteCount || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
