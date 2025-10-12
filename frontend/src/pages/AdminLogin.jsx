import API from '../api/axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/AdminLogin.css';

export default function AdminLogin() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post('accounts/admin-login/', {
                username: form.username,
                password: form.password
            });

            localStorage.setItem('admin', JSON.stringify({
                username: res.data.username,
                email: res.data.email
            }));

            navigate('/admin/dashboard');
        } catch (err) {
            console.log(err);
            setError('Invalid Admin Credentials');
        }
    };

    return (
        <div className="full">
            <div className="admin-login-container">
                <form onSubmit={handleSubmit}>
                    <h2 style={{margin: '0'}}>Admin Login</h2>
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
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}
