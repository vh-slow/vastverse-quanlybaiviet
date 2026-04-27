'use client';

import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!user || user.role !== 'admin') {
            if (!user) {
                toast.error('Vui lòng đăng nhập để truy cập trang quản trị.');
            } else {
                toast.error('Bạn không có quyền truy cập trang này.');
            }

            router.push('/admin/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                Đang tải...
            </div>
        );
    }

    if (user && user.role === 'admin') {
        return <>{children}</>;
    }

    return null;
}
