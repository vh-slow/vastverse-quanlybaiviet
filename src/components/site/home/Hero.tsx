'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Banner, Product } from '@/src/types';
import { apiBanner, apiProduct, BASE_IMAGE_URL } from '@/src/services';
import { initBannerCarousel } from '@/src/utils/bannerCarousel';
import { formatCurrency } from '@/src/utils/formatters';
import Spinner from '../../Spinner';

export default function Hero() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [isCarouselInitialized, setIsCarouselInitialized] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await apiBanner.getAllBanners();
                setBanners(data);
                console.log('Fetched banners:', data);
            } catch (error) {
                console.error('Failed to load banners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiProduct.getHeroSaleProducts();
                setProducts(response);
            } catch (error) {
                console.error('Failed to load featured products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (!loading && banners.length > 0 && !isCarouselInitialized) {
            const timeoutId = setTimeout(() => {
                initBannerCarousel();
                setIsCarouselInitialized(true);
            }, 0);

            return () => clearTimeout(timeoutId);
        }
    }, [loading, banners, isCarouselInitialized]);

    return (
        <section className="hero-section" id="hero">
            <div className="container">
                <div className="hero-grid">
                    {/* Carousel */}
                    <div className="hero-main-col">
                        <div className="banner-carousel relative min-h-[350px]">
                            {loading ? (
                                <div className="banner-carousel relative min-h-[35px] pt-[110px]">
                                    <Spinner />
                                </div>
                            ) : banners.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                                    <p className="text-gray-500">
                                        No banners available
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {banners.map((banner, index) => (
                                        <div
                                            key={banner.id}
                                            className={`carousel-slide ${index === 0 ? 'active-slide' : ''}`}
                                        >
                                            <div className="slide-content">
                                                <div className="flex items-baseline gap-3 mb-2">
                                                    <h2 className="sale-text">
                                                        {index === 0
                                                            ? 'New!'
                                                            : index === 1
                                                              ? '99%!'
                                                              : 'HOT!'}
                                                    </h2>
                                                    <small className="sale-text-desc font-bold">
                                                        {index === 2
                                                            ? 'Secret today'
                                                            : 'Sale Off'}
                                                    </small>
                                                </div>
                                                <h4 className="slide-title text-2xl">
                                                    {banner.title}
                                                </h4>
                                                <p className="slide-desc text-xs font-semibold">
                                                    {banner.description}
                                                </p>
                                                <Link
                                                    href={
                                                        '/shop' + banner.targetUrl ||
                                                        '/shop'
                                                    }
                                                    className="btn btn-primary mt-6"
                                                >
                                                    {index === 1
                                                        ? 'Discover'
                                                        : index === 2
                                                          ? 'Explore'
                                                          : 'Shop Now'}
                                                </Link>
                                            </div>
                                            <div className="slide-image">
                                                <div className="w-full max-w-[300px] aspect-square">
                                                    <img
                                                        src={
                                                            banner.imageUrl.startsWith(
                                                                'http'
                                                            )
                                                                ? banner.imageUrl
                                                                : `${BASE_IMAGE_URL}${banner.imageUrl}`
                                                        }
                                                        alt={banner.title}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                'https://placehold.co/300x300/f1f5f9/334155?text=Img';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {banners.length > 1 && (
                                        <>
                                            <button className="carousel-btn prev-btn">
                                                <i className="fa-solid fa-chevron-left"></i>
                                            </button>
                                            <button className="carousel-btn next-btn">
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </button>
                                            <div className="carousel-indicators"></div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="hero-side-col">
                        {products.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-sm text-gray-400 bg-gray-50 rounded-xl">
                                No sale products
                            </div>
                        ) : (
                            products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`shop/products/${product.id}`}
                                    className="side-product"
                                >
                                    <div className="side-product-image">
                                        <img
                                            src={
                                                product.imageUrl?.startsWith(
                                                    'http'
                                                )
                                                    ? product.imageUrl
                                                    : `${BASE_IMAGE_URL}${product.imageUrl}`
                                            }
                                            alt={product.productName}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    'https://placehold.co/150x150/f1f5f9/334155?text=Img';
                                            }}
                                        />
                                    </div>
                                    <div className="side-product-info">
                                        <h3
                                            className="side-product-title text-sm font-bold truncate block w-[160px] sm:w-full"
                                            title={product.productName}
                                        >
                                            {product.productName}
                                        </h3>
                                        <p className="offer-text text-xs font-semibold">
                                            limited time offer
                                        </p>
                                        <p className="price">
                                            {product.salePrice &&
                                            product.salePrice <
                                                product.price ? (
                                                <>
                                                    <span className="current-price">
                                                        {formatCurrency(
                                                            product.salePrice
                                                        )}
                                                    </span>
                                                    <span className="original-price">
                                                        {formatCurrency(
                                                            product.price
                                                        )}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="current-price">
                                                    {formatCurrency(
                                                        product.price
                                                    )}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
