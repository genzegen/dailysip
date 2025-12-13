import React from 'react';
import { useState, useEffect, useRef } from 'react';

import API from '../api/axios';
import '../styles/LandingPage.css';
import Header from '../components/Header';
import heroImage from '../assets/coffeehero.jpg';
import Footer from '../components/Footer';
import Instagram from '../components/Instagram';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function LandingPage() {

    const [scrollY, setScrollY] = useState(0);
    const [showProducts, setShowProducts] = useState(false);
    const latestRef = useRef(null);
    const [topProducts, setTopProducts] = useState([]);

    // SEO: page title
    useEffect(() => {
        document.title = 'dailySips – Home';
    }, []);

    // Fetch top products by relevance (backend already orders by popularity / newest)
    useEffect(() => {
        const fetchTop = async () => {
            try {
                // FIXED: Changed from 'products/' to '' (empty string)
                // Since API baseURL is already '/api/', this becomes '/api/'
                const res = await API.get('');
                const data = Array.isArray(res.data) ? res.data : [];
                setTopProducts(data.slice(0, 3));
            } catch (err) {
                console.error('Error fetching top products for landing page', err);
            }
        };

        fetchTop();
    }, []);

    // for scale animation on scroll
    useEffect(() => {

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    setScrollY(currentScrollY > 50 ? 50 : currentScrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowProducts(entry.isIntersecting);
            },
            { threshold: 0.6 }
        );

        const target = latestRef.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) observer.unobserve(target);
        };
    }, []);

    const imageScale = Math.max(0.8, 1 - scrollY * 0.00098);

    return (
        <div className="container" style={{ position: 'relative', overflowX: 'hidden' }}>
            <Header />
            <div className="hero-intro" style={{ marginTop: '10vh' }}>
                <h1 style={{ fontSize: '2rem', marginTop: '1.6rem' }}>Simplicity in Every Sips</h1>
                <p style={{ marginTop: '0.5rem', marginBottom: '0', fontSize: '1rem' }}>Premium blends. Minimum effort.</p>
                <button className='shop-now-button'>Shop Now</button>
                <img src={heroImage} alt="Coffee Hero" className='hero-image' style={{ transform: `scale(${imageScale})` }} />
            </div>
            <div className='latest-arrivals' ref={latestRef} style={{ marginBottom: '5vh' }}>
                <h1 style={{ fontSize: '2rem', marginTop: '0' }}>
                    Our Hottest Products</h1>
                <p style={{ marginTop: '0.5rem', marginBottom: '1.6rem', fontSize: '1rem' }}>
                    Signature selections that define our taste and quality.</p>
                <div className='latest-products'>
                    <div className={`landing-product-card left ${showProducts ? 'animate' : ''}`}>
                        {topProducts[0] ? (() => {
                            const imgPath = topProducts[0].images?.[0]?.image;
                            const imgUrl = imgPath
                                ? (imgPath.startsWith('http') ? imgPath : `${API_URL}${imgPath}`)
                                : '/no-image.png';
                            return (
                                <>
                                    <img src={imgUrl} alt={topProducts[0].name} style={{ width: '100%', borderRadius: '8px', marginBottom: '0.8rem' }} />
                                    <h1>{topProducts[0].name}</h1>
                                    <p>{topProducts[0].description?.slice(0, 80) || 'Customer favorite from our catalog.'}</p>
                                    <p>Rs. {topProducts[0].final_price ?? topProducts[0].price}</p>
                                </>
                            );
                        })() : (
                            <>
                                <h1>Featured Product</h1>
                                <p>Description of product</p>
                                <p>Price</p>
                            </>
                        )}
                    </div>
                    <div className={`landing-product-card center ${showProducts ? 'animate' : ''}`}>
                        {topProducts[1] ? (() => {
                            const imgPath = topProducts[1].images?.[0]?.image;
                            const imgUrl = imgPath
                                ? (imgPath.startsWith('http') ? imgPath : `${API_URL}${imgPath}`)
                                : '/no-image.png';
                            return (
                                <>
                                    <img src={imgUrl} alt={topProducts[1].name} style={{ width: '100%', borderRadius: '8px', marginBottom: '0.8rem' }} />
                                    <h1>{topProducts[1].name}</h1>
                                    <p>{topProducts[1].description?.slice(0, 80) || 'Highly rated by our customers.'}</p>
                                    <p>Rs. {topProducts[1].final_price ?? topProducts[1].price}</p>
                                </>
                            );
                        })() : (
                            <>
                                <h1>Product 2</h1>
                                <p>Description of product</p>
                                <p>Price</p>
                            </>
                        )}
                    </div>
                    <div className={`landing-product-card right ${showProducts ? 'animate' : ''}`}>
                        {topProducts[2] ? (() => {
                            const imgPath = topProducts[2].images?.[0]?.image;
                            const imgUrl = imgPath
                                ? (imgPath.startsWith('http') ? imgPath : `${API_URL}${imgPath}`)
                                : '/no-image.png';
                            return (
                                <>
                                    <img src={imgUrl} alt={topProducts[2].name} style={{ width: '100%', borderRadius: '8px', marginBottom: '0.8rem' }} />
                                    <h1>{topProducts[2].name}</h1>
                                    <p>{topProducts[2].description?.slice(0, 80) || 'Trending in our store right now.'}</p>
                                    <p>Rs. {topProducts[2].final_price ?? topProducts[2].price}</p>
                                </>
                            );
                        })() : (
                            <>
                                <h1>Product 3</h1>
                                <p>Description of product</p>
                                <p>Price</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Instagram />
            <Footer />
        </div>
    );
}