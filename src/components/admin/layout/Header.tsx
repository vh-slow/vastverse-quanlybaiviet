import Link from 'next/link';
import React from 'react';

export interface Breadcrumb {
    name: string;
    href?: string;
}

interface AdminHeader {
    title: string;
    breadcrumbs: Breadcrumb[];
}

export default function AdminHeader({ title, breadcrumbs }: AdminHeader) {
    return (
        <header className="flex justify-between items-center p-6 border-gray-200 shrink-0">
            <div>
                <h2 className="text-xl font-semibold text-text-primary">
                    {title}
                </h2>

                <nav
                    className="flex items-center text-sm text-gray-700 mt-1"
                    aria-label="Breadcrumb"
                >
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <React.Fragment key={index}>
                                {isLast ? (
                                    <span
                                        className="font-normal text-gray-900"
                                        aria-current="page"
                                    >
                                        {item.name}
                                    </span>
                                ) : (
                                    <>
                                        <Link
                                            href={item.href || '#'}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                        <i className="fa-solid fa-chevron-right text-xs mx-2"></i>
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Export
                </button>
                <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2 transition-colors">
                    <span>September, 2024</span>
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>
            </div>
        </header>
    );
}
