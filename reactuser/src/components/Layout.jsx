import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cart from './Cart.jsx';
import Toast from './Toast.jsx';

const Layout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="layout-wrapper">
      <div className="announcement-bar">
        <span>Complimentary morning delivery on all subscription plans.</span>
      </div>

      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <nav className="nav-group left nav-links-wrap">
            <NavLink className={({ isActive }) => `nav-link nav-pill ${isActive ? 'active' : ''}`} to="/categories">Collections</NavLink>
            <NavLink className={({ isActive }) => `nav-link nav-pill ${isActive ? 'active' : ''}`} to="/products">Our Dairy</NavLink>
          </nav>

          <div className="nav-group center">
            <Link className="brand brand-main" to="/">
              <span className="brand-text">Milkman.</span>
            </Link>
          </div>

          <nav className="nav-group right nav-actions-wrap">
            <Cart />
            {!isAuthenticated ? (
              <>
                <Link className="nav-link nav-pill" to="/login">Sign In</Link>
                <Link className="btn btn-sm nav-cta" to="/signup">Subscribe</Link>
              </>
            ) : (
              <>
                <Link className="nav-icon" to="/dashboard" title="Dashboard">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </Link>
                <button className="nav-link nav-pill btn-text" onClick={logout} title="Sign Out">Sign Out</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">{children}</main>
      <Toast />

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h2 className="brand light">Milkman.</h2>
            <p className="footer-text">Purveyors of fine, estate-sourced dairy. Delivered fresh to your doorstep before the sun rises.</p>
          </div>
          <div>
            <h4 className="footer-title">Explore</h4>
            <Link className="footer-link" to="/products">All Products</Link>
            <Link className="footer-link" to="/categories">Categories</Link>
            <Link className="footer-link" to="/subscribe/category">Subscription Plans</Link>
          </div>
          <div>
            <h4 className="footer-title">Support</h4>
            <span className="footer-link">Contact Us</span>
            <span className="footer-link">FAQ</span>
            <span className="footer-link">Delivery Areas</span>
          </div>
        </div>
        <div className="footer-bottom container">
          &copy; {new Date().getFullYear()} Milkman Artisanal Dairy. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
