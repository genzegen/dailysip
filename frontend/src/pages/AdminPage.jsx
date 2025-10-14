import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import '../styles/AdminPage.css';
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminOrders from "../components/admin/AdminOrders";
import AdminReports from "../components/admin/AdminReports";
import AdminProducts from "../components/admin/AdminProducts";
import AdminSettings from "../components/admin/AdminSettings";

export default function AdminPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const admin = JSON.parse(localStorage.getItem('admin'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Admin Data:', { admin, token });
        if (!token || !admin?.isStaff) {
            navigate('/admin/login');
        }
    }, [navigate, admin]);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'orders':
                return <AdminOrders />;
            case 'reports':
                return <AdminReports />;
            case 'products':
                return <AdminProducts />;
            case 'settings':
                return <AdminSettings />;
            default:
                return <AdminDashboard />;
        }
    }

    return (
        <div className="admin-main">
            <div className="admin-sidebar">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="admin-content">
                <div className="admin-content-header">
                    <i className="fa fa-bell"></i>
                    <i className="fa fa-user"></i>
                </div>
                <div className="admin-content-renders">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

