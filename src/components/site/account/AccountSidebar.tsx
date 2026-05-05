'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { apiUser, BASE_URL } from '@/src/services';
import { formatDate } from '@/src/utils/formatters';
import toast from 'react-hot-toast';

export default function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user: contextUser, logout, isLoading: isAuthLoading } = useAuth();

    const [profileData, setProfileData] = useState<any>(null);
    const [isFetchingProfile, setIsFetchingProfile] = useState(true);

    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [followModalType, setFollowModalType] = useState<
        'followers' | 'following'
    >('followers');
    const [followData, setFollowData] = useState<any[]>([]);
    const [isLoadingFollowData, setIsLoadingFollowData] = useState(false);

    useEffect(() => {
        const fetchMyProfile = async () => {
            if (!contextUser) {
                setIsFetchingProfile(false);
                return;
            }
            try {
                const data = await apiUser.getMyProfile();
                setProfileData(data);
            } catch (error) {
                console.error('Lỗi khi tải thông tin cá nhân:', error);
            } finally {
                setIsFetchingProfile(false);
            }
        };

        fetchMyProfile();
    }, [contextUser]);

    const isActive = (path: string) => {
        if (path === '/account') {
            return pathname === path;
        }
        return pathname.startsWith(path);
    };

    const getMenuClass = (path: string) => {
        return isActive(path)
            ? 'flex items-center gap-3 px-4 py-3 rounded-lg text-white bg-[#3c50e0] font-semibold shadow-sm'
            : 'flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors';
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        router.push('/login');
    };

    const avatarUrl = profileData?.avatar
        ? `${BASE_URL.replace('/api/', '')}${profileData.avatar}`
        : `https://placehold.co/128x128/e0e7ff/3730a3?text=${profileData?.fullName?.charAt(0) || 'U'}`;

    const openFollowModal = async (type: 'followers' | 'following') => {
        if (!profileData) return;
        setFollowModalType(type);
        setIsFollowModalOpen(true);
        setIsLoadingFollowData(true);
        setFollowData([]);
        try {
            const data =
                type === 'followers'
                    ? await apiUser.getFollowers(profileData.username)
                    : await apiUser.getFollowing(profileData.username);
            setFollowData(data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách!');
        } finally {
            setIsLoadingFollowData(false);
        }
    };

    const isLoading = isAuthLoading || isFetchingProfile;

    return (
        <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="animate-pulse p-6 border-b border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-20 h-20 rounded-full bg-gray-200 shrink-0"></div>
                            <div className="flex-1">
                                <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded-md w-1/3"></div>
                            </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-5"></div>
                        <div className="flex gap-6">
                            <div className="h-4 bg-gray-200 rounded-md w-24"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-24"></div>
                        </div>
                    </div>
                ) : profileData ? (
                    <div className="px-6 py-4">
                        <div className="flex items-center gap-4 mb-2">
                            <img
                                src={avatarUrl}
                                alt="User Avatar"
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-100 shadow-sm shrink-0 bg-white"
                            />
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-1.5 leading-tight truncate">
                                    <span className="truncate">
                                        {profileData.fullName ||
                                            profileData.username}
                                    </span>
                                    {profileData.role === 'admin' && (
                                        <i
                                            className="fa-solid fa-circle-check text-blue-500 text-base shrink-0"
                                            title="Quản trị viên"
                                        ></i>
                                    )}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5 truncate">
                                    @{profileData.username}
                                </p>
                                <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-2">
                                    <i className="fa-regular fa-calendar"></i>
                                    Tham gia{' '}
                                    {profileData.createdAt
                                        ? formatDate(profileData.createdAt)
                                        : '...'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-5 text-sm mb-2">
                                <button
                                    onClick={() => openFollowModal('following')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <strong className="text-gray-900">
                                        {profileData.followingCount || 0}
                                    </strong>{' '}
                                    Đang theo dõi
                                </button>
                                <button
                                    onClick={() => openFollowModal('followers')}
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <strong className="text-gray-900">
                                        {profileData.followersCount || 0}
                                    </strong>{' '}
                                    Người theo dõi
                                </button>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {profileData.bio || (
                                    <span className="italic text-gray-400">
                                        Chưa cập nhật tiểu sử.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center px-6 border-b border-gray-100">
                        <p className="text-gray-600">
                            Vui lòng đăng nhập để xem tài khoản.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                )}

                {profileData && (
                    <div className="px-4 pb-4">
                        <nav className="space-y-1 text-left pt-4 border-t border-gray-100">
                            <Link
                                href="/account"
                                className={getMenuClass('/account')}
                            >
                                <i className="fa-solid fa-table-columns fa-fw w-5"></i>
                                <span>Trang chủ</span>
                            </Link>

                            <Link
                                href="/account/posts"
                                className={getMenuClass('/account/posts')}
                            >
                                <i className="fa-solid fa-pen-nib fa-fw w-5"></i>
                                <span>Bài viết của tôi</span>
                            </Link>
                            <Link
                                href="/account/favorites"
                                className={getMenuClass('/account/favorites')}
                            >
                                <i className="fa-solid fa-heart fa-fw w-5"></i>
                                <span>Bài viết yêu thích</span>
                            </Link>

                            <Link
                                href="/account/details"
                                className={getMenuClass('/account/details')}
                            >
                                <i className="fa-solid fa-user-pen fa-fw w-5"></i>
                                <span>Thông tin cá nhân</span>
                            </Link>
                            <Link
                                href="/account/change-password"
                                className={getMenuClass(
                                    '/account/change-password'
                                )}
                            >
                                <i className="fa-solid fa-shield-halved fa-fw w-5"></i>
                                <span>Đổi mật khẩu</span>
                            </Link>

                            <a
                                href="#"
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors mt-2"
                            >
                                <i className="fa-solid fa-right-from-bracket fa-fw w-5"></i>
                                <span>Đăng xuất</span>
                            </a>
                        </nav>
                    </div>
                )}
            </div>

            {isFollowModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div
                        className="absolute inset-0"
                        onClick={() => setIsFollowModalOpen(false)}
                    ></div>

                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[75vh] relative z-10 animate-zoom-in overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
                            <h3 className="text-lg font-bold text-gray-900">
                                {followModalType === 'followers'
                                    ? 'Người theo dõi'
                                    : 'Đang theo dõi'}
                            </h3>
                            <button
                                onClick={() => setIsFollowModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-2 flex-1 custom-scrollbar">
                            {isLoadingFollowData ? (
                                <div className="flex justify-center items-center py-12">
                                    <i className="fa-solid fa-circle-notch fa-spin text-blue-500 text-2xl"></i>
                                </div>
                            ) : followData.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 text-xl">
                                        <i className="fa-solid fa-users-slash"></i>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">
                                        {followModalType === 'followers'
                                            ? 'Chưa có người theo dõi nào.'
                                            : 'Chưa theo dõi ai.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {followData.map((u) => (
                                        <Link
                                            href={`/u/${u.username}`}
                                            onClick={() =>
                                                setIsFollowModalOpen(false)
                                            }
                                            key={u.id}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors group"
                                        >
                                            <img
                                                src={
                                                    u.avatar
                                                        ? `${BASE_URL.replace('/api/', '')}${u.avatar}`
                                                        : `https://placehold.co/100x100/e0e7ff/3730a3?text=${u.fullName.charAt(0)}`
                                                }
                                                alt={u.fullName}
                                                className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                                    {u.fullName}
                                                </h4>
                                                <p className="text-gray-500 text-xs truncate">
                                                    @{u.username}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
