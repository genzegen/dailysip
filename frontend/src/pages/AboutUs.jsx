import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/AboutUs.css';

export default function AboutUs() {
  useEffect(() => {
    document.title = 'About Us | dailySips';
  }, []);

  return (
    <div className="about-page">
      <Header />
      <main className="about-main">
        <h1 className="about-title">About dailySips</h1>
        <p className="about-intro">
          dailySips is a specialty coffee and tea experience built for everyday moments. This page gives a
          short overview of who we are, what we care about, and how we serve our customers.
        </p>

        <section className="about-section">
          <h2 className="about-section-title">Who we are</h2>
          <p className="about-text">
            We are a small team of coffee and tea enthusiasts who believe that a good cup can set the tone
            for your entire day. dailySips was created to make quality, thoughtfully sourced drinks more
            accessible and enjoyable from home, work, or your favorite corner spot.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">Our mission</h2>
          <p className="about-text">
            Our mission is simple: to help you discover drinks you genuinely love. We focus on consistent
            quality, clear information, and a smooth online experience so you can spend less time searching
            and more time enjoying each sip.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">What we offer</h2>
          <ul className="about-list">
            <li>Carefully selected coffees, teas, and cups for different tastes and brewing styles.</li>
            <li>Clear product details so you know what you are ordering before it arrives.</li>
            <li>A simple ordering flow with order history so you can easily reorder your favorites.</li>
          </ul>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">How we serve you</h2>
          <p className="about-text">
            This project currently runs as an online store where you can browse products, place orders, and
            track your past purchases. Over time, you can extend this page with real photos, team
            information, and details about your sourcing and roasting process.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
