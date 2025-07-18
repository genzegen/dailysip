import React, { useState } from 'react';
import '../styles/Login.css';
import cappu from '../assets/cappu.png';

export default function Register({ switchToLogin}) {
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register submitted:', form);
    }

    return (
        <div className="login-register-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <input
                    type="password"
                    name="confirmpassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                />
                <p>Already have an account? <button type='button' className='switch-button' onClick={switchToLogin}>Login Now</button></p>
                <button type="submit">Register</button>
            </form>
            <div className='cappu-container'>
                <img src={cappu} alt="Cappucino" className='cappu-img' />
                <label style={{ fontSize: '1rem', color: '#fcf7f8', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>dailyCappu</label>
            </div>
        </div>
    )
}