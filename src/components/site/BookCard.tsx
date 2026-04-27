import React from 'react';
import Link from 'next/link';
import { Book } from '@/src/types';
import { BASE_URL } from '@/src/services';
import { formatDate } from '@/src/utils/formatters';

export default function BookCard({ book }: { book: Book }) {
    const imageUrl = book.thumbnail
        ? `${BASE_URL.replace('/api/', '')}${book.thumbnail}`
        : 'https://placehold.co/600x400/f1f5f9/334155?text=Thumbnail';

    return (
        <article className="blog-card bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
            <Link
                href={`/${book.slug}`}
                className="block md:w-4/12 aspect-video md:aspect-[4/3] overflow-hidden rounded-lg shrink-0 group"
            >
                <img
                    src={imageUrl}
                    alt={book.title}
                    onError={(e) => {
                        e.currentTarget.src =
                            'https://placehold.co/600x400/f1f5f9/334155?text=Thumbnail';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </Link>
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {book.category?.name || 'Không phân loại'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                        <i className="fa-regular fa-calendar mr-1"></i>{' '}
                        {formatDate(book.createdAt)}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <Link
                        href={`/${book.slug}`}
                        className="hover:text-blue-600 transition-colors line-clamp-2"
                    >
                        {book.title}
                    </Link>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                    {book.summary || 'Không có mô tả tóm tắt cho bài viết này.'}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <img
                            src={
                                book.user?.avatar
                                    ? `${BASE_URL.replace('/api/', '')}${book.user.avatar}`
                                    : `https://placehold.co/32x32/e0e7ff/3730a3?text=${book.user?.fullName?.charAt(0) || 'U'}`
                            }
                            alt={book.user?.fullName}
                            className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            {book.user?.fullName || 'Tác giả'}
                        </span>
                    </div>
                    <Link
                        href={`/${book.slug}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                        Xem chi tiết{' '}
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                    </Link>
                </div>
            </div>
        </article>
    );
}
