import React, { useState } from 'react';
import '../styles/Login.css';
import cappu from '../assets/cappu.png';
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'


export default function Login({ switchToRegister }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('accounts/login/', {
                username: form.username,
                password: form.password
            });

            localStorage.setItem('user', JSON.stringify({
                username: res.data.username,
                email: res.data.email
            }))

            console.log("Login successful", res.data)
            navigate('/home')
        } catch (err) {
            setError('Invalid Credentials')
            console.log(err)
        }
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
                <p>Don't have an account? <button type='button' className='switch-button' onClick={switchToRegister}>Register Now</button></p>
                <button type="submit">Login</button>
                {error && <p style={{ color: 'yellow', fontSize: '0.8rem' }}>{error}</p>}
            </form>
            <div className='cappu-container'>
                <img src={cappu} alt="Cappucino" className='cappu-img' />
                <label style={{ fontSize: '1rem', color: '#fcf7f8', fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>dailyCappu</label>
            </div>
        </div>
    )
}