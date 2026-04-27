'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { Book, Category, Pagination } from '@/src/types';
import { apiBook } from '@/src/services/book';
import { apiCategory } from '@/src/services';
import BookCard from '@/src/components/site/BookCard';
import BookCardSkeleton from '@/src/components/site/BookCardSkeleton';
import { useSearchParams } from 'next/navigation';

function HomePageContent() {
    const searchParams = useSearchParams();
    const queryFromUrl = searchParams.get('query') || '';

    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const pageSize = 5;
    const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(
        null
    );

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null
    );

    useEffect(() => {
        setSearchQuery(queryFromUrl);
    }, [queryFromUrl]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiCategory.getAllCategories();
                console.log('Fetched categories: ', data);
                setCategories(data.data || data.content || data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                pageNumber: currentPage + 1,
                pageSize: pageSize,
            };

            if (debouncedSearch) params.searchQuery = debouncedSearch;
            if (selectedCategoryId) params.categoryId = selectedCategoryId;

            const response = await apiBook.getPublicBooks(params);
            console.log('Fetched books: ', response.data);
            setBooks(response.data);
            setPaginationInfo(response);
        } catch (error) {
            console.error('Failed to fetch books:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearch, selectedCategoryId]);

    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedSearch, selectedCategoryId]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return (
        <section className="py-12 lg:py-16 bg-gray-50 min-h-screen bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {loading ? (
                            <>
                                <BookCardSkeleton />
                                <BookCardSkeleton />
                                <BookCardSkeleton />
                            </>
                        ) : books.length > 0 ? (
                            books.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))
                        ) : (
                            <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
                                <i className="fa-solid fa-folder-open text-4xl text-gray-300 mb-3"></i>
                                <p className="text-gray-500">
                                    Không tìm thấy bài viết nào.
                                </p>
                            </div>
                        )}

                        {paginationInfo && paginationInfo.totalPages > 1 && (
                            <nav className="mt-12 flex justify-center">
                                <ul className="inline-flex items-center gap-2">
                                    <li>
                                        <button
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.max(0, p - 1)
                                                )
                                            }
                                            disabled={
                                                paginationInfo.pageNumber === 1
                                            }
                                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                                        >
                                            Prev
                                        </button>
                                    </li>

                                    {Array.from({
                                        length: paginationInfo.totalPages,
                                    }).map((_, idx) => (
                                        <li key={idx}>
                                            <button
                                                onClick={() =>
                                                    setCurrentPage(idx)
                                                }
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === idx
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {idx + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li>
                                        <button
                                            onClick={() =>
                                                setCurrentPage((p) => p + 1)
                                            }
                                            disabled={
                                                paginationInfo.pageNumber ===
                                                paginationInfo.totalPages
                                            }
                                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>

                    <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Tìm kiếm bài viết
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Nhập từ khóa..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                />
                                <button className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-blue-600">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Chủ đề
                            </h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="topic"
                                            className="h-4 w-4 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={
                                                selectedCategoryId === null
                                            }
                                            onChange={() =>
                                                setSelectedCategoryId(null)
                                            }
                                        />
                                        <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                                            Tất cả chủ đề
                                        </span>
                                    </label>
                                </li>

                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <label className="flex items-center cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="topic"
                                                className="h-4 w-4 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={
                                                    selectedCategoryId ===
                                                    cat.id
                                                }
                                                onChange={() =>
                                                    setSelectedCategoryId(
                                                        cat.id
                                                    )
                                                }
                                            />
                                            <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                                                {cat.name}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export default function Header() {
    return (
        <Suspense fallback={null}>
            <HomePageContent />
        </Suspense>
    );
}