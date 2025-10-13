import '../styles/Sidebar.css';
import cappu from '../assets/cappu.png';

export default function Sidebar() {

    const handleAdminLogout = () => {
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
    }

    return (
        <div className='sidebar'>
            <div className="sidebar-header">
                <h2>dailySips</h2>
                <img src={cappu} alt="Cappuccino" />
            </div>
            <div className="sidebar-content">
                <ul>
                    <li><i className="fa fa-tachometer-alt"></i>Dashboard</li>
                    <li><i className="fa fa-shopping-bag"></i>Orders</li>
                    <li><i className="fa fa-chart-line"></i>Reports</li>
                    <li><i className="fa fa-box"></i>Products</li>
                    <li><i className="fa fa-cog"></i>Settings</li>
                </ul>
                <button onClick={handleAdminLogout}>Logout</button>
            </div>
        </div>
    );
}