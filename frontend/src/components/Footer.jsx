import '../styles/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="branding">
                    <h1 style={{ fontStyle: 'italic' }}>dailySips</h1>
                    <p>Your daily dose of premium brews.</p>
                </div>

                <div className="footer-section">
                    <h3>Shop</h3>
                    <ul>
                        <li>Coffee</li>
                        <li>Tea</li>
                        <li>Accessories</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>Email: us@dailysips.com</p>
                    <p>Address: Kathmandu, Nepal</p>
                </div>

                <div className="footer-section newsletter">
                    <h3>Newsletter</h3>
                    <input type="email" placeholder="Your email" />
                    <button>Subscribe</button>
                </div>
            </div>

            <hr />

            <div className="footer-bottom">
                <p>&copy; 2025 DailySips. All rights reserved.</p>
                <div className="social-icons">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                </div>
            </div>
        </footer>
    );
}
