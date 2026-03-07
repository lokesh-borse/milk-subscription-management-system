import React, { useState, useEffect } from 'react';
import { Users, Package, Zap, TrendingUp } from 'lucide-react';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [customers, products, subscriptions] = await Promise.all([
          api.get('/customer/customer/'),
          api.get('/product/product/'),
          api.get('/subscription/subscription/'),
        ]);
        const activeSubs = subscriptions.data.filter(s => s.status === 'active');
        const revenue = subscriptions.data.reduce((acc, s) => {
          return acc + (Number(s.product_price) || 0) * (Number(s.quantity) || 1) * (Number(s.duration) || 1);
        }, 0);
        setStats({
          totalCustomers: customers.data.length,
          totalProducts: products.data.length,
          activeSubscriptions: activeSubs.length,
          totalRevenue: revenue,
        });
      } catch {
        // fallback to placeholder values
        setStats({ totalCustomers: 0, totalProducts: 0, activeSubscriptions: 0, totalRevenue: 0 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, change, bgColor }) => (
    <div className="stat-card" style={{ borderLeftColor: bgColor }}>
      <div className="stat-icon-wrapper" style={{ backgroundColor: `${bgColor}18` }}>
        <Icon size={22} style={{ color: bgColor }} />
      </div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <div className="stat-value-row">
          <p className="stat-value">{isLoading ? '—' : value}</p>
          {!isLoading && change && (
            <span className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const activeTotalRevenue = stats.totalRevenue;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back — here's what's happening with your business.</p>
        </div>
        <div className="dashboard-header-badge">Live Data</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={Users} title="Total Customers" value={stats.totalCustomers.toLocaleString()} change={12.5} bgColor="#3b82f6" />
        <StatCard icon={Package} title="Total Products" value={stats.totalProducts} change={8.2} bgColor="#10b981" />
        <StatCard icon={Zap} title="Active Subscriptions" value={stats.activeSubscriptions.toLocaleString()} change={18.7} bgColor="#f59e0b" />
        <StatCard icon={TrendingUp} title="Total Revenue" value={`₹${activeTotalRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`} change={24.3} bgColor="#8b5cf6" />
      </div>

      {/* Quick Stats */}
      <div className="activity-section">
        <div className="activity-card">
          <h2 className="activity-title">Quick Stats</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-label">Avg. Revenue per Subscription</span>
              <span className="activity-value">
                ₹{stats.activeSubscriptions > 0 ? (stats.totalRevenue / stats.activeSubscriptions).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="activity-item">
              <span className="activity-label">Subscription Rate (Customers)</span>
              <span className="activity-value">
                {stats.totalCustomers > 0 ? ((stats.activeSubscriptions / stats.totalCustomers) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="activity-item">
              <span className="activity-label">Total Customers</span>
              <span className="activity-value">{isLoading ? '—' : stats.totalCustomers}</span>
            </div>
            <div className="activity-item">
              <span className="activity-label">Total Products Listed</span>
              <span className="activity-value">{isLoading ? '—' : stats.totalProducts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
