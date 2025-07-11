import React from 'react';
import API from '../api/axios';
import '../styles/LandingPage.css';
import Header from '../components/Header';

export default function LandingPage() {
    return (
        <div className="container">
            <Header />
            <div className="hero-intro">
                <h1 style={{ fontSize: '2.3rem' }}>Simplicity in Every Sips</h1>
                <p>Premium blends. Minimum effort.</p>
            </div>
        </div>
    );
}