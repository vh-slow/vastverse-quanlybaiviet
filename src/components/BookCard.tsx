'use client';

import React from 'react';
import Link from 'next/link';
import { BASE_URL } from '../services';
import { formatDateTime } from '../utils/formatters';
export default function BookCard({ book }: { book: any }) {
    return (
        <div className="flex flex-col sm:flex-row gap-5 p-4 bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all group">
            <Link
                href={`/${book.slug}`}
                className="w-full sm:w-36 h-32 rounded-xl bg-gray-100 shrink-0 overflow-hidden block"
            >
                <img
                    src={
                        book.thumbnail
                            ? `${BASE_URL.replace('/api/', '')}${book.thumbnail}`
                            : 'https://placehold.co/200x150/f1f5f9/334155?text=Img'
                    }
                    alt={book.title}
                    onError={(e) => {
                        e.currentTarget.src =
                            'https://placehold.co/200x150/f1f5f9/334155?text=Img';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2">
                    <Link
                        href={`/${book.slug}`}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {book.title}
                    </Link>
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3">
                    {book.summary}
                </p>

                <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mt-auto text-xs font-medium text-gray-500">
                    {book.category && (
                        <Link
                            href={`/?categoryId=${book.category.id}`}
                            className="text-blue-600 hover:underline uppercase tracking-wider font-bold"
                        >
                            {book.category.name}
                        </Link>
                    )}
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className="text-gray-400">
                        {formatDateTime(book.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
}
