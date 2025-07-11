import React from "react";
import '../styles/Header.css';export default function Header() {
  return (
    <div className="header-container">
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
                <li>Cart</li>
                <li>Login</li>
            </ul>
        </div>
    </div>
  );
}