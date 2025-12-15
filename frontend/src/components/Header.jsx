import '../styles/Header.css';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import CartDropdown from './CartDropdown';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Header() {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const popupRef = useRef();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load user from localStorage (just for UI)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY - lastScrollY.current > 2) setShow(false);
      else if (lastScrollY.current - currentScrollY > 2) setShow(true);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside logout popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem('user'); // clear UI state
    setUser(null);
    setShowLogout(false);
    navigate('/');
    window.location.reload();
  };

  const handleLoginClick = () => navigate('/getstarted');

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      const trimmed = searchTerm.trim();
      if (trimmed.length > 0) {
        navigate(`/home?search=${encodeURIComponent(trimmed)}`);
      } else {
        navigate('/home');
      }
    }
  };

  const handleGoToOrders = () => {
    setShowLogout(false);
    navigate('/my-orders');
  };

  return (
    <div className={`header-container ${show ? 'show' : 'hide'}`}>
      <div className="left">
        <ul>
          <li onClick={() => navigate('/')} style={{ fontWeight: 'bold', fontStyle: 'italic', color: '#A31621' }}>
            dailySips
          </li>
          <li onClick={() => navigate('/home')}>Shop</li>
          <li onClick={() => navigate('/about')}>About</li>
          <li className='search-bar-container'>
            <i className='fa fa-search'></i>
            <input
              type="text"
              className='search-bar'
              placeholder='Search ...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </li>
        </ul>
      </div>

      <div className="right">
        <ul>
          <li className="cart-icon" onClick={() => setIsCartOpen(prev => !prev)}>
            <i className='fa fa-shopping-cart'></i>
            <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </li>

          {user ? (
            <li onClick={() => setShowLogout(prev => !prev)} style={{ color: '#2b2b2b', cursor: 'pointer', position: 'relative' }}>
              <span className="username">
                {user.first_name || user.username}
                {user.is_staff && <span className="staff-badge">Staff</span>}
              </span>

              {showLogout && (
                <div className='logout-popup' ref={popupRef}>
                  <div className="user-info">
                    <strong>{user.first_name || user.username}</strong>
                    <span>{user.email}</span>
                    {user.is_staff && <span className="staff-label">Staff Member</span>}
                  </div>
                  <button onClick={handleGoToOrders} className='logout-button' style={{ marginBottom: '8px', width: '70%' }}>
                    My Orders
                  </button>
                  <button onClick={handleLogout} className='logout-button'>Logout</button>
                </div>
              )}
            </li>
          ) : (
            <li onClick={handleLoginClick} style={{ cursor: 'pointer' }} className="login-button">
              Login
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
