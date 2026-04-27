'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/src/types';
import { apiProduct } from '@/src/services';
import ProductCard from '@/src/components/site/ProductCard';

export default function NewArrivals() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const data = await apiProduct.getLatestProducts();
                setProducts(data || []);
            } catch (error) {
                console.error('Failed to fetch new arrivals', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    return (
        <section className="section-wrapper" id="new-arrivals">
            <div className="container">
                <div className="section-header">
                    <div className="section-title-group">
                        <p className="section-subtitle">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>{' '}
                            This Week's
                        </p>
                        <h2 className="section-title">New Arrivals</h2>
                    </div>
                    <div className="section-controls">
                        <Link href="/shop" className="control-btn btn-outline">
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
                            No products found.
                        </div>
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
