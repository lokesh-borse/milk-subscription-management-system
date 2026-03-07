import React from 'react';
import { Link } from 'react-router-dom';
import PremiumNavbar from './PremiumNavbar';
import Toast from './Toast.jsx';

const Layout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>Complimentary morning delivery on all subscription plans.</span>
      </div>

      {/* Premium Navbar */}
      <PremiumNavbar />

      <main id="main-content" className="main-content">{children}</main>
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
        </div>
        <div className="footer-bottom container">
          &copy; {new Date().getFullYear()} Milkman Artisanal Dairy. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
