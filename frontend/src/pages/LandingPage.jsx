import React from 'react';
import { useState, useEffect } from 'react';
import API from '../api/axios';
import '../styles/LandingPage.css';
import Header from '../components/Header';
import heroImage from '../assets/coffeehero.jpg';

export default function LandingPage() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    setScrollY(currentScrollY > 500 ? 500 : currentScrollY);
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

    const imageScale = Math.max(0.8, 1 - scrollY * 0.00028);

    return (
        <div className="container" style={{ position: 'relative', overflowX: 'hidden' }}>
            <Header />
            <div className="hero-intro" style={{ marginTop: '10vh' }}>
                <h1 style={{ fontSize: '2.3rem', marginTop: '1.6rem' }}>Simplicity in Every Sips</h1>
                <p style={{ marginTop: '0.5rem', marginBottom: '0', fontSize: '1.1rem' }}>Premium blends. Minimum effort.</p>
                <button className='shop-now-button'>Shop Now</button>
                <img src={heroImage} alt="Coffee Hero" className='hero-image' style={{ transform: `scale(${imageScale})` }} />
            </div>
            <div className='latest-arrivals'>
                <h1 style={{ fontSize: '2.3rem', marginTop: '1.6rem' }}>
                    Our Hottest Products</h1>
                <p style={{ marginTop: '0.5rem', marginBottom: '0', fontSize: '1.1rem' }}>
                    Signature selections that define our taste and quality.</p>
                <div className='latest-products'>

                </div>
            </div>
        </div>
    );
}