import '../styles/Header.css';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if(storedUser) {
      setUser(JSON.parse(storedUser));
      console.log(storedUser);
    }
  }, []);

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
                <li><i className='fa fa-shopping-cart'></i></li>
                {
                  user ? (
                    <li style={{ color: '#2b2b2b' }}>{user.username}</li>
                  ) : (
                    <li onClick={() => navigate('/getStarted')} style={{ cursor: 'pointer' }}>Login</li>
                  )
                }
            </ul>
        </div>
    </div>
  );
}