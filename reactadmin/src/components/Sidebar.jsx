import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Users,
  Package,
  Layers,
  ShoppingCart,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import './Sidebar.css';

/**
 * Sidebar Navigation Component
 * Provides collapsible sidebar navigation with icons and active state highlighting
 * Features:
 * - Collapsible on mobile devices
 * - Active link highlighting
 * - Professional icon integration with Lucide React
 * - User info and logout functionality
 */
const Sidebar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/staff', icon: Users, label: 'Staff' },
    { path: '/customer', icon: Users, label: 'Customers' },
    { path: '/category', icon: Layers, label: 'Categories' },
    { path: '/product', icon: Package, label: 'Products' },
    { path: '/subscription', icon: ShoppingCart, label: 'Subscriptions' },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="sidebar-mobile-header">
        <div className="sidebar-brand">
          <Link to="/" className="sidebar-logo">
            <span className="logo-icon">🥛</span>
            <span className="logo-text">Milkman</span>
          </Link>
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar Container */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={closeSidebar}>
            <span className="logo-icon">🥛</span>
            <span className="logo-text">Milkman Admin</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <p className="nav-section-title">MAIN MENU</p>
          <ul className="nav-list">
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`nav-link ${isActive(path) ? 'active' : ''}`}
                  onClick={closeSidebar}
                >
                  <Icon className="nav-icon" size={20} />
                  <span className="nav-label">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-email">{user?.email || 'User'}</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
