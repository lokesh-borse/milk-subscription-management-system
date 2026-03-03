import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('staffUser') || '{}');
    const isLoggedIn = !!localStorage.getItem('staffToken');

    const handleLogout = () => {
        localStorage.removeItem('staffToken');
        localStorage.removeItem('staffUser');
        navigate('/login');
    };

    if (!isLoggedIn) return <>{children}</>;

    return (
        <div className="layout-container">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="layout-main">
                {children}
            </main>
        </div>
    );
};

export default Layout;
