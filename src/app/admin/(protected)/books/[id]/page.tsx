'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/src/components/admin/layout/Header';
import Link from 'next/link';
import { apiBook } from '@/src/services/book';
import { BASE_URL } from '@/src/services';
import toast from 'react-hot-toast';
import { formatDate, formatDateTime } from '@/src/utils/formatters';

export default function BookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const bookId = Number(params.id);

    const [book, setBook] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [expandedHistory, setExpandedHistory] = useState<number[]>([]);

    const fetchDetailAndHistory = async () => {
        try {
            const [bookData, historyData] = await Promise.all([
                apiBook.getBookByIdForAdmin(bookId),
                apiBook.getBookHistoryForAdmin(bookId),
            ]);

            setBook(bookData);
            setHistory(historyData);
        } catch (error) {
            console.error('Failed to fetch book details', error);
            toast.error('Không tìm thấy thông tin bài viết!');
            router.push('/admin/books');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (bookId) {
            fetchDetailAndHistory();
        }
    }, [bookId]);

    // --- Các hàm xử lý Action ---
    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
        try {
            await apiBook.deleteBook(bookId);
            toast.success('Đã xóa bài viết!');
            router.push('/admin/books');
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Xóa bài viết thất bại!'
            );
        }
    };

    const handleToggleVisibility = async () => {
        try {
            const res = await apiBook.toggleVisibility(bookId);
            toast.success(res.message || 'Đã thay đổi trạng thái!');
            fetchDetailAndHistory(); // Tải lại để cập nhật Badge
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Thao tác thất bại!');
        }
    };

    const handleApprove = async () => {
        // Giả sử gọi chung toggleVisibility hoặc bạn có 1 API approve riêng
        if (!confirm('Bạn muốn duyệt bài viết này hiển thị công khai?')) return;
        try {
            const res = await apiBook.toggleVisibility(bookId); // Hoặc apiBook.approveBook(bookId)
            toast.success('Đã duyệt bài viết thành công!');
            fetchDetailAndHistory();
        } catch (error: any) {
            toast.error('Duyệt bài viết thất bại!');
        }
    };

    const toggleHistoryContent = (historyId: number) => {
        setExpandedHistory((prev) =>
            prev.includes(historyId)
                ? prev.filter((id) => id !== historyId)
                : [...prev, historyId]
        );
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex justify-center items-center h-full min-h-[500px]">
                <div className="text-gray-500 flex flex-col items-center gap-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600"></i>
                    <p className="font-medium">
                        Đang tải thông tin bài viết...
                    </p>
                </div>
            </div>
        );
    }

    if (!book) return null;

    const breadcrumbs = [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Bài viết', href: '/admin/books' },
        { name: 'Chi tiết' },
    ];

    return (
        <>
            <Header title="Chi tiết Bài viết" breadcrumbs={breadcrumbs} />

            <div className="flex-1 p-6 md:p-8 bg-gray-50/50 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
                    {/* --- CỘT TRÁI --- */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                        {/* Card Thông tin Tác giả (Author Details) */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 self-start">
                                Thông tin tác giả
                            </h3>
                            <div className="relative mb-4">
                                <img
                                    src={
                                        book.user?.avatar
                                            ? `${BASE_URL.replace('/api/', '')}${book.user.avatar}`
                                            : `https://placehold.co/128x128/e0e7ff/3730a3?text=${book.user?.fullName?.charAt(0) || 'U'}`
                                    }
                                    alt={book.user?.fullName}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-white"
                                />
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <h4 className="font-bold text-gray-900 text-xl mb-1">
                                {book.user?.fullName || 'Người dùng ẩn danh'}
                            </h4>
                            <p className="text-sm text-gray-500 mb-6">
                                @{book.user?.username}
                            </p>

                            <Link
                                href={`/admin/users/${book.user?.id}`}
                                className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="fa-regular fa-id-badge"></i> Xem
                                hồ sơ người dùng
                            </Link>
                        </div>

                        {/* Card Thông tin Bài viết (Article Info) */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">
                                Thông tin bài viết
                            </h3>
                            <ul className="space-y-5 text-sm">
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-500 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <i className="fa-solid fa-signal"></i>
                                        </div>
                                        Trạng thái
                                    </span>
                                    <span
                                        className={`px-3 py-1 text-xs font-bold rounded-lg
                                        ${
                                            book.status === 1
                                                ? 'bg-green-100 text-green-700'
                                                : book.status === 0
                                                  ? 'bg-yellow-100 text-yellow-700'
                                                  : book.status === 2
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {book.status === 1
                                            ? 'CÔNG KHAI'
                                            : book.status === 0
                                              ? 'CHỜ DUYỆT'
                                              : book.status === 2
                                                ? 'ĐÃ ẨN'
                                                : 'BỊ KHÓA'}
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-500 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <i className="fa-solid fa-layer-group"></i>
                                        </div>
                                        Danh mục
                                    </span>
                                    <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                        {book.category?.name || 'N/A'}
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-500 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400">
                                            <i className="fa-regular fa-eye"></i>
                                        </div>
                                        Lượt xem
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        {book.viewCount.toLocaleString()}
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-500 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-400">
                                            <i className="fa-regular fa-heart"></i>
                                        </div>
                                        Yêu thích
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        {book.favoriteCount?.toLocaleString() ||
                                            0}
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-500 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <i className="fa-regular fa-calendar"></i>
                                        </div>
                                        Ngày tạo
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {formatDate(book.createdAt)}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* --- CỘT PHẢI --- */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Main Content Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-gray-100">
                                <div className="flex justify-between items-start gap-4 mb-2">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                                            {book.title}
                                        </h1>
                                        <p className="text-sm text-gray-400 italic mt-2">
                                            Slug: /{book.slug}
                                        </p>
                                    </div>

                                    {/* ACTION BUTTONS: Kỹ thuật Hover Bridge */}
                                    <div className="relative group/action shrink-0 flex justify-end">
                                        <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors relative z-10">
                                            <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
                                        </button>

                                        <div className="absolute right-full top-1/2 -translate-y-1/2 pr-2 py-4 flex items-center gap-2 opacity-0 translate-x-4 pointer-events-none group-hover/action:pointer-events-auto group-hover/action:opacity-100 group-hover/action:translate-x-0 transition-all duration-300 ease-out z-0">
                                            {/* Nút Duyệt: Chỉ hiện khi trạng thái là Chờ duyệt (0) */}
                                            {book.status === 0 && (
                                                <button
                                                    onClick={handleApprove}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-green-600 hover:bg-green-50 hover:border-green-300 shadow-sm transition-all"
                                                    title="Duyệt hiển thị"
                                                >
                                                    <i className="fa-solid fa-check"></i>
                                                </button>
                                            )}

                                            {/* Nút Ẩn/Hiện: Chỉ hiện khi Công khai(1) hoặc Ẩn(2) */}
                                            {(book.status === 1 ||
                                                book.status === 2) && (
                                                <button
                                                    onClick={
                                                        handleToggleVisibility
                                                    }
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 shadow-sm transition-all"
                                                    title={
                                                        book.status === 1
                                                            ? 'Ẩn bài viết'
                                                            : 'Hiện bài viết'
                                                    }
                                                >
                                                    <i
                                                        className={`fa-solid ${book.status === 1 ? 'fa-eye-slash' : 'fa-eye'}`}
                                                    ></i>
                                                </button>
                                            )}

                                            <Link
                                                href={`/admin/books/update/${book.id}`}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-sm transition-all"
                                                title="Sửa bài viết"
                                            >
                                                <i className="fa-solid fa-pen"></i>
                                            </Link>

                                            <button
                                                onClick={handleDelete}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm transition-all"
                                                title="Xóa bài viết"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full bg-gray-100 border-b border-gray-100 relative group overflow-hidden">
                                <img
                                    src={
                                        book.thumbnail
                                            ? `${BASE_URL.replace('/api/', '')}${book.thumbnail}`
                                            : 'https://placehold.co/1200x400/f1f5f9/334155?text=Thumbnail+Image'
                                    }
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            'https://placehold.co/1200x400/f1f5f9/334155?text=Thumbnail+Image';
                                    }}
                                    alt="Thumbnail"
                                    className={`w-full max-h-[350px] object-cover transition-transform duration-500 ${book.status === 0 ? 'grayscale opacity-80' : ''}`}
                                />
                            </div>

                            <div className="p-6 md:p-8">
                                {book.summary && (
                                    <div className="mb-8 p-5 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-xl">
                                        <h4 className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wider">
                                            Mô tả tóm tắt (Summary)
                                        </h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {book.summary}
                                        </p>
                                    </div>
                                )}

                                <h4 className="text-sm font-bold text-gray-400 mb-5 uppercase tracking-wider">
                                    Nội dung chính
                                </h4>
                                <div
                                    className="prose prose-lg prose-blue max-w-none text-gray-800 prose-p:my-2 prose-headings:my-4"
                                    dangerouslySetInnerHTML={{
                                        __html: book.content,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {history.length > 0 && (
                            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">
                                    Lịch sử chỉnh sửa
                                    <small className="text-xs text-gray-500 ml-2 mt-[-4px]">
                                        ({history.length} phiên bản)
                                    </small>
                                </h3>

                                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                                    {history.map((item, index) => {
                                        const isFirst = index === 0;

                                        const isExpanded =
                                            expandedHistory.includes(item.id);

                                        return (
                                            <div
                                                key={item.id}
                                                className="relative pl-6"
                                            >
                                                <div
                                                    className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white ${isFirst ? 'bg-blue-500 shadow-sm' : 'bg-gray-300'}`}
                                                ></div>

                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-900 flex items-center flex-wrap gap-2 text-sm sm:text-base">
                                                        Chỉnh sửa bởi{' '}
                                                        <Link
                                                            href={`/admin/users/${item.editedByUserId}`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {
                                                                item.editedByUserName
                                                            }
                                                        </Link>
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded border border-gray-200">
                                                            ID: #
                                                            {
                                                                item.editedByUserId
                                                            }
                                                        </span>
                                                    </h4>

                                                    <span className="text-xs text-gray-500 mt-1 sm:mt-0 font-medium">
                                                        {formatDateTime(
                                                            item.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 relative opacity-80 hover:opacity-100 transition-opacity">
                                                    <span className="absolute -top-2.5 left-4 px-2 bg-gray-50 text-xs font-semibold text-gray-400">
                                                        Nội dung cũ
                                                    </span>

                                                    <div
                                                        className={`prose prose-sm max-w-none overflow-hidden ${!isExpanded ? 'line-clamp-3' : ''}`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: item.oldContent,
                                                        }}
                                                    ></div>

                                                    <button
                                                        onClick={() =>
                                                            toggleHistoryContent(
                                                                item.id
                                                            )
                                                        }
                                                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-xs"
                                                    >
                                                        {isExpanded
                                                            ? 'Thu gọn'
                                                            : 'Xem thêm'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
