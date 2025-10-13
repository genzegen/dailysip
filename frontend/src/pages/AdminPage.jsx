import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import '../styles/AdminPage.css';

export default function AdminPage() {
    const navigate = useNavigate();
    const admin = JSON.parse(localStorage.getItem('admin'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Admin Data:', { admin, token });
        if (!token || !admin?.isStaff) {
            navigate('/admin/login');
        }
    }, [navigate, admin]);

    return (
        <div className="admin-main">
            <div className="admin-sidebar">
                <Sidebar />
            </div>
            <div className="admin-content"></div>
        </div>
    );
}

