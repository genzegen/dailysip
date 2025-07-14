import React from 'react';
import API from '../api/axios';
import '../styles/LandingPage.css';
import Header from '../components/Header';
import heroImage from '../assets/coffeehero.jpg';

export default function LandingPage() {
    return (
        <div className="container">
            <Header />
            <div className="hero-intro" style={{ marginTop: '10vh' }}>
                <h1 style={{ fontSize: '2.3rem', marginTop: '1.6rem' }}>Simplicity in Every Sips</h1>
                <p style={{ marginTop: '0.5rem', marginBottom: '0', fontSize: '1.1rem' }}>Premium blends. Minimum effort.</p>
                <button className='shop-now-button'>Shop Now</button>
                <img src={heroImage} alt="Coffee Hero" className='hero-image' />
            </div>
        </div>
    );
}