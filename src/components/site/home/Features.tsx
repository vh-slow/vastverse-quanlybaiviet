import React from 'react';

export default function Features() {
    return (
        <section className="features-section">
            <div className="container">
                <div className="features-grid">
                    {/* Feature Item 1 */}
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <img
                                src="/images/icons/icon-01.svg"
                                alt="Free Shipping Icon"
                                className="feature-icon"
                            />
                        </div>
                        <div className="feature-text">
                            <h3 className="feature-title">Free Shipping</h3>
                            <p className="feature-subtitle">
                                For all orders $200
                            </p>
                        </div>
                    </div>
                    {/* Feature Item 2 */}
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <img
                                src="/images/icons/icon-02.svg"
                                alt="Returns Icon"
                                className="feature-icon"
                            />
                        </div>
                        <div className="feature-text">
                            <h3 className="feature-title">1 & 1 Returns</h3>
                            <p className="feature-subtitle">
                                Cancellation after 1 day
                            </p>
                        </div>
                    </div>
                    {/* Feature Item 3 */}
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <img
                                src="/images/icons/icon-03.svg"
                                alt="Secure Payments Icon"
                                className="feature-icon"
                            />
                        </div>
                        <div className="feature-text">
                            <h3 className="feature-title">
                                100% Secure Payments
                            </h3>
                            <p className="feature-subtitle">
                                Guarantee secure payments
                            </p>
                        </div>
                    </div>
                    {/* Feature Item 4 */}
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <img
                                src="/images/icons/icon-04.svg"
                                alt="Support Icon"
                                className="feature-icon"
                            />
                        </div>
                        <div className="feature-text">
                            <h3 className="feature-title">
                                24/7 Dedicated Support
                            </h3>
                            <p className="feature-subtitle">
                                Anywhere & anytime
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
