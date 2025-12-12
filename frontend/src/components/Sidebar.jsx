import '../styles/Sidebar.css';
import cappu from '../assets/cappu.png';

export default function Sidebar({ activeTab, setActiveTab }) {

    const handleAdminLogout = () => {
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
    }

    const menuItems = [
        { key: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
        { key: 'orders', label: 'Orders', icon: 'fa-shopping-bag' },
        { key: 'products', label: 'Products', icon: 'fa-box' },
        { key: 'settings', label: 'Settings', icon: 'fa-cog' }
    ]

    return (
        <div className='sidebar'>
            <div className="sidebar-header">
                <h2>dailySips</h2>
                <img src={cappu} alt="Cappuccino" />
            </div>
            <div className="sidebar-content">
                <ul>
                    {menuItems.map(item => (
                        <li
                            key={item.key}
                            className={activeTab === item.key ? 'active' : ''}
                            onClick={() => setActiveTab(item.key)}
                        >
                            <i className={`fas ${item.icon}`}></i>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
                <button onClick={handleAdminLogout}>Logout</button>
            </div>
        </div>
    );
}