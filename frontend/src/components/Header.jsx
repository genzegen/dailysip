import '../styles/Header.css';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY - lastScrollY.current > 2) {
        setShow(false); // Hide on scroll down
      } else if (lastScrollY.current - currentScrollY > 2) {
        setShow(true); // Show on scroll up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`header-container ${show ? 'show' : 'hide'}`}>
        <div className="left">
            <ul>
                <li style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#A31621' }}>dailySips</li>
                <li>Shop</li>
                <li>About</li>
                <li>Search</li>
            </ul>
        </div>
        <div className="right">
            <ul>
                <li><i className='fab cart'></i></li>
                <li onClick={() => navigate('/getstarted')} style={{ pointerEvents: 'all', cursor: 'pointer' }}>Login</li>
            </ul>
        </div>
    </div>
  );
}