import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const admin = JSON.parse(localStorage.getItem("admin") || '{}');

    useEffect(() => {
        if (!token || !admin.isStaff) {
            navigate('/admin/login');
        }
    }, [navigate, token, admin.isStaff]);

    if (!token || !admin.isStaff) {
        return <div>Redirecting...</div>
    }

    return children;
}