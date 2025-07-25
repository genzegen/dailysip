import '../styles/Header.css';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const popupRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if(storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY - lastScrollY.current > 2) {
        setShow(false);
      } else if (lastScrollY.current - currentScrollY > 2) {
        setShow(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if(popupRef.current && !popupRef.current.contains(e.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowLogout(false);
    navigate('/');
  }

  const handleLoginClick = () => {
    console.log("Login clicked - navigating to /getstarted");
    navigate('/getstarted');
  }

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
                {user ? (
                    <li 
                      onClick={() => setShowLogout(prev => !prev)} 
                      style={{ color: '#2b2b2b', cursor: 'pointer', position: 'relative' }}
                    >
                      {user.username}
                      {showLogout && (
                        <div className='logout-popup' ref={popupRef}>
                          <button onClick={handleLogout} className='logout-button'>Logout</button>
                        </div>
                      )}
                    </li>
                  ) : (
                    <li 
                      onClick={handleLoginClick}
                      style={{ cursor: 'pointer' }}
                    >
                      Login
                    </li>
                  )
                }
            </ul>
        </div>
    </div>
  );
}