import React from 'react';

export default function BookCardSkeleton() {
    return (
        <article className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 animate-pulse">
            <div className="block md:w-4/12 aspect-video md:aspect-[4/3] rounded-lg shrink-0 bg-gray-200"></div>
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4 mt-1">
                    <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2 mb-4">
                    <div className="h-6 w-full bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2 mb-6">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        </article>
    );
}
