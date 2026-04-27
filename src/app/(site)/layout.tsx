import React from 'react';
import Header from '@/src/components/site/Header';
import Footer from '@/src/components/site/Footer';
import BackToTop from '@/src/components/site/BackToTop';

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="site-wrapper app-wrap">
            <Header />
            <main>{children}</main>
            <Footer />
            <BackToTop />
        </div>
    );
}
