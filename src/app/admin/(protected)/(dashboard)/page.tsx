'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/src/components/admin/layout/Header';
import { apiDashboard, BASE_URL } from '@/src/services';
import Link from 'next/link';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [summaryRes, analyticsRes] = await Promise.all([
                    apiDashboard.getSummary(),
                    apiDashboard.getAnalytics(),
                ]);
                setData(summaryRes);
                setAnalytics(analyticsRes);
            } catch (error) {
                console.error('Lỗi tải dashboard', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const chartData = useMemo(() => {
        if (!analytics || !analytics.viewsChart || !analytics.usersChart)
            return [];

        return analytics.viewsChart.map((viewItem: any, index: number) => {
            const userItem = analytics.usersChart[index];
            return {
                date: viewItem.date,
                views: viewItem.value,
                users: userItem ? userItem.value : 0,
            };
        });
    }, [analytics]);

    const breadcrumbs = [
        { name: 'Admin', href: '/admin' },
        { name: 'Dashboard' },
    ];

    if (loading) {
        return (
            <>
                <Header title="Dashboard" breadcrumbs={breadcrumbs} />
                <div className="flex-1 flex justify-center items-center h-full min-h-[500px]">
                    <div className="text-gray-500 flex flex-col items-center gap-3">
                        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-600"></i>
                        <p className="font-medium">
                            Đang tải dữ liệu tổng quan...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Tổng quan Hệ thống" breadcrumbs={breadcrumbs} />

            <div className="flex-1 p-6 md:p-8 bg-gray-50/50 animate-fade-in-up">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">
                                        Tổng Người Dùng
                                    </p>
                                    <h3 className="text-3xl font-extrabold text-gray-900">
                                        {data?.stats.totalUsers.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                                    <i className="fa-solid fa-users"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">
                                        Bài Đã Xuất Bản
                                    </p>
                                    <h3 className="text-3xl font-extrabold text-gray-900">
                                        {data?.stats.totalPosts.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
                                    <i className="fa-solid fa-file-lines"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 mb-1">
                                        Tổng Lượt Xem
                                    </p>
                                    <h3 className="text-3xl font-extrabold text-gray-900">
                                        {data?.stats.totalViews.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                                    <i className="fa-solid fa-chart-simple"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow text-white">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-orange-100 mb-1">
                                        Bài Chờ Duyệt
                                    </p>
                                    <h3 className="text-3xl font-extrabold">
                                        {data?.stats.pendingPosts}
                                    </h3>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl backdrop-blur-sm">
                                    <i className="fa-solid fa-hourglass-half"></i>
                                </div>
                            </div>
                            {data?.stats.pendingPosts > 0 && (
                                <Link
                                    href="/admin/books?status=0"
                                    className="relative z-10 block mt-4 text-sm font-medium text-orange-100 hover:text-white transition-colors"
                                >
                                    Xử lý ngay &rarr;
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <i className="fa-solid fa-chart-line text-blue-600"></i>
                                Lưu lượng truy cập (7 ngày gần nhất)
                            </h3>
                        </div>

                        {chartData.length > 0 ? (
                            <div className="w-full h-[350px] md:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 5,
                                            right: 20,
                                            left: -20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#e5e7eb"
                                        />

                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#6b7280',
                                                fontSize: 13,
                                            }}
                                            dy={10}
                                        />

                                        <YAxis
                                            yAxisId="left"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#6b7280',
                                                fontSize: 13,
                                            }}
                                        />

                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#6b7280',
                                                fontSize: 13,
                                            }}
                                        />

                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow:
                                                    '0 4px 12px rgba(0,0,0,0.1)',
                                            }}
                                            labelStyle={{
                                                fontWeight: 'bold',
                                                color: '#111827',
                                                marginBottom: '4px',
                                            }}
                                        />
                                        <Legend
                                            iconType="circle"
                                            wrapperStyle={{
                                                paddingTop: '15px',
                                            }}
                                        />

                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="views"
                                            name="Lượt xem"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            dot={{
                                                r: 4,
                                                strokeWidth: 2,
                                                fill: '#fff',
                                            }}
                                            activeDot={{ r: 7 }}
                                        />

                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="users"
                                            name="Người đăng ký mới"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            dot={{
                                                r: 4,
                                                strokeWidth: 2,
                                                fill: '#fff',
                                            }}
                                            activeDot={{ r: 7 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[350px] flex items-center justify-center text-gray-400">
                                Chưa có dữ liệu biểu đồ
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <i className="fa-solid fa-crown text-yellow-500"></i>{' '}
                                    Top Tác Giả Đóng Góp
                                </h3>
                                <Link
                                    href="/admin/users"
                                    className="text-sm text-blue-600 font-medium hover:underline"
                                >
                                    Xem tất cả
                                </Link>
                            </div>

                            <div className="p-2 flex-1">
                                {data?.topAuthors.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        Chưa có dữ liệu tác giả.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-100">
                                        {data?.topAuthors.map(
                                            (author: any, index: number) => (
                                                <li
                                                    key={author.id}
                                                    className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 rounded-xl"
                                                >
                                                    <div
                                                        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0 ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-200 text-gray-700' : index === 2 ? 'bg-orange-100 text-orange-700' : 'text-gray-400'}`}
                                                    >
                                                        #{index + 1}
                                                    </div>
                                                    <img
                                                        src={
                                                            author.avatar
                                                                ? `${BASE_URL.replace('/api/', '')}${author.avatar}`
                                                                : `https://placehold.co/100x100/e0e7ff/3730a3?text=${author.fullName.charAt(0)}`
                                                        }
                                                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                                        alt={author.fullName}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-900 truncate">
                                                            <Link
                                                                href={`/admin/users/${author.id}`}
                                                                className="hover:text-blue-600 transition-colors"
                                                            >
                                                                {
                                                                    author.fullName
                                                                }
                                                            </Link>
                                                        </h4>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            @{author.username} •{' '}
                                                            {author.role ===
                                                            'admin'
                                                                ? 'Quản trị viên'
                                                                : 'Thành viên'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="block text-lg font-bold text-gray-900">
                                                            {author.postCount}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            Bài viết
                                                        </span>
                                                    </div>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <i className="fa-solid fa-fire text-red-500"></i>{' '}
                                    Bài Viết Thịnh Hành
                                </h3>
                                <Link
                                    href="/admin/books"
                                    className="text-sm text-blue-600 font-medium hover:underline"
                                >
                                    Quản lý bài viết
                                </Link>
                            </div>

                            <div className="p-2 flex-1">
                                {data?.trendingPosts.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        Chưa có bài viết nào.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-100">
                                        {data?.trendingPosts.map(
                                            (post: any) => (
                                                <li
                                                    key={post.id}
                                                    className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 rounded-xl group"
                                                >
                                                    <Link
                                                        href={`/admin/books/${post.id}`}
                                                        className="w-20 h-16 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-200 block"
                                                    >
                                                        <img
                                                            src={
                                                                post.thumbnail
                                                                    ? `${BASE_URL.replace('/api/', '')}${post.thumbnail}`
                                                                    : 'https://placehold.co/150x100/f1f5f9/334155?text=Img'
                                                            }
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                            alt={post.title}
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    'https://placehold.co/150x100/f1f5f9/334155?text=Img';
                                                            }}
                                                        />
                                                    </Link>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-900 line-clamp-2 text-sm leading-snug mb-1">
                                                            <Link
                                                                href={`/admin/books/${post.id}`}
                                                                className="hover:text-blue-600 transition-colors"
                                                            >
                                                                {post.title}
                                                            </Link>
                                                        </h4>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <span className="truncate max-w-[100px]">
                                                                Bởi:{' '}
                                                                {
                                                                    post.authorName
                                                                }
                                                            </span>
                                                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                                                                <i className="fa-solid fa-eye"></i>{' '}
                                                                {post.viewCount.toLocaleString()}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-pink-500 font-medium">
                                                                <i className="fa-solid fa-heart"></i>{' '}
                                                                {
                                                                    post.favoriteCount
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
