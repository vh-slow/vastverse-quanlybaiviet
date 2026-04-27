import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'VastVerse - Nền tảng chia sẻ kiến thức',
    description: 'VastVerse, nền tảng chia sẻ kiến thức và khám phá tri thức mới.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
                <link rel="stylesheet" href="/css/admin-style.css" />
                <link rel="stylesheet" href="/css/style.css" />
            </head>
            <body>
                <AuthProvider>
                    <Toaster position="top-center" />
                    {children}
                </AuthProvider>
                <Script src="/js/script.js" strategy="afterInteractive" />
            </body>
        </html>
    );
}
