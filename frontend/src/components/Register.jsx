import React, { useState } from 'react';
import '../styles/Login.css';
import cappu from '../assets/cappu.png';
import API from '../api/axios'

export default function Register({ switchToLogin}) {
    const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError('');

        try {
            const response = await API.post('accounts/register/', {
                username: form.username,
                email: form.email,
                password: form.password,
                confirm_password: form.confirmPassword,
            });
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data || "Registration failed.");
        }

        console.log('Register submitted:', form);
    }

    return (
        <div className="login-register-container">
            <form style={{ gap: '0.55rem' }} onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
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
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                />
                <p>Already have an account? <button type='button' className='switch-button' onClick={switchToLogin}>Login Now</button></p>
                <button type="submit">Register</button>
                {error && <p style={{ color: 'yellow', fontSize: '0.8rem' }}>{error}</p>}
            </form>
            <div className='cappu-container'>
                <img src={cappu} alt="Cappucino" className='cappu-img' />
                <label style={{ fontSize: '1rem', color: '#fcf7f8', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>dailyCappu</label>
            </div>
        </div>
    )
}