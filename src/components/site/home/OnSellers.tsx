'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/src/types';
import { apiProduct } from '@/src/services';
import RatingProductCard from '../RattingProductCard';

export default function OnSellers() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                const data = await apiProduct.getSaleProducts();
                setProducts(data || []);
            } catch (error) {
                console.error('Failed to fetch trending products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaleProducts();
    }, []);

    return (
        <section className="section-wrapper" id="on-sellers">
            <div className="container">
                <div className="section-header">
                    <div className="section-title-group">
                        <p className="section-subtitle">
                            <i className="fa-solid fa-arrow-trend-up"></i>{' '}
                            Trending Now
                        </p>
                        <h2 className="section-title">On Sale Products</h2>
                    </div>
                    <div className="section-controls">
                        <Link
                            href="/shop?sale=true"
                            className="control-btn btn-outline"
                        >
                            View All
                        </Link>
                    </div>
                </div>

                {/* PRODUCT GRID */}
                <div className="product-grid relative min-h-[300px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fa-solid fa-circle-notch fa-spin text-3xl text-gray-400"></i>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No trending products available.
                        </div>
                    ) : (
                        products.map((product) => (
                            <RatingProductCard
                                key={product.id}
                                product={product}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
