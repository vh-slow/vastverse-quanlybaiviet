import React from 'react';
import PageHeader from '@/src/components/site/PageHeader';
import AccountSidebar from '@/src/components/site/account/AccountSidebar';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const breadcrumbs = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Tài khoản của tôi' },
    ];

    return (
        <main className="bg-gray-50 min-h-screen pb-12">
            <PageHeader title="Tài khoản của tôi" breadcrumbs={breadcrumbs} />

            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN */}
                        <AccountSidebar />

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            {children}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
