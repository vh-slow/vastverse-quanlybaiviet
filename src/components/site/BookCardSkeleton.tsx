import React from 'react';

export default function BookCardSkeleton() {
    return (
        <article className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="relative md:w-[40%] aspect-video md:aspect-[4/3] lg:aspect-[3/2] shrink-0 bg-gray-200"></div>

            <div className="flex flex-col flex-1 p-3 md:p-4 lg:p-5">
                <div className="h-6 md:h-8 bg-gray-200 rounded-lg w-full mb-2"></div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>

                <div className="space-y-2.5 mb-6">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-4 w-10 bg-gray-200 rounded"></div>
                        <div className="h-4 w-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </article>
    );
}
