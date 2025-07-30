import React from 'react';
import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import '../styles/LandingPage.css';
import Header from '../components/Header';
import heroImage from '../assets/coffeehero.jpg';
import Footer from '../components/Footer';
import Instagram from '../components/Instagram';

export default function LandingPage() {
    const [scrollY, setScrollY] = useState(0);
    const [showProducts, setShowProducts] = useState(false);
    const latestRef = useRef(null);

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
                        {/* <img src="/placeholder.png" alt="bg" /> */}
                        <h1>Product 1</h1>
                        <p>Description of product</p>
                        <p>Price</p>
                    </div>
                    <div className={`landing-product-card center ${showProducts ? 'animate' : ''}`}>
                        {/* <img src="/placeholder.png" alt="bg" /> */}
                        <h1>Product 1</h1>
                        <p>Description of product</p>
                        <p>Price</p>
                    </div>
                    <div className={`landing-product-card right ${showProducts ? 'animate' : ''}`}>
                        {/* <img src="/placeholder.png" alt="bg" /> */}
                        <h1>Product 1</h1>
                        <p>Description of product</p>
                        <p>Price</p>
                    </div>
                </div>
            </div>
            <Instagram />
            <Footer />
        </div>
    );
}