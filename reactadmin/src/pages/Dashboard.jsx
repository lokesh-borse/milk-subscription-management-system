import React, { useState, useEffect } from 'react';
import { Users, Package, Zap, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

/**
 * Admin Dashboard Page
 * Displays KPI statistics and analytics charts
 * Features:
 * - Stat cards with icons and trend indicators
 * - Line chart for subscription trends
 * - Bar chart for comparison data
 * - Responsive grid layout
 * - Loading states
 */
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 1240,
    totalProducts: 48,
    activeSubscriptions: 892,
    totalRevenue: 54320,
  });

  // Mock trend data
  const subscriptionTrendData = [
    { month: 'Jan', subscriptions: 400, revenue: 2400 },
    { month: 'Feb', subscriptions: 520, revenue: 3221 },
    { month: 'Mar', subscriptions: 645, revenue: 4290 },
    { month: 'Apr', subscriptions: 723, revenue: 4891 },
    { month: 'May', subscriptions: 812, revenue: 5490 },
    { month: 'Jun', subscriptions: 892, revenue: 6200 },
  ];

  const productCategoryData = [
    { category: 'Regular Milk', sales: 420 },
    { category: 'Organic Milk', sales: 310 },
    { category: 'Yogurt', sales: 280 },
    { category: 'Cheese', sales: 200 },
  ];

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ icon: Icon, title, value, change, bgColor }) => (
    <div className="stat-card" style={{ borderLeftColor: bgColor }}>
      <div className="stat-icon-wrapper" style={{ backgroundColor: `${bgColor}15` }}>
        <Icon size={24} style={{ color: bgColor }} />
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-value-row">
          <p className="stat-value">{isLoading ? '-' : value}</p>
          {!isLoading && change && (
            <span className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Premium analytics for your daily operations</p>
        </div>
        <div className="dashboard-header-badge">Updated 5 min ago</div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={Users}
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          change={12.5}
          bgColor="#3b82f6"
        />
        <StatCard
          icon={Package}
          title="Total Products"
          value={stats.totalProducts}
          change={8.2}
          bgColor="#10b981"
        />
        <StatCard
          icon={Zap}
          title="Active Subscriptions"
          value={stats.activeSubscriptions.toLocaleString()}
          change={18.7}
          bgColor="#f59e0b"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`}
          change={24.3}
          bgColor="#8b5cf6"
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Subscription Trends Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Subscription Trends</h2>
            <p className="chart-subtitle">Last 6 months performance</p>
          </div>
          {isLoading ? (
            <div className="chart-skeleton"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={subscriptionTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Product Sales Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Product Category Sales</h2>
            <p className="chart-subtitle">Sales by product category</p>
          </div>
          {isLoading ? (
            <div className="chart-skeleton"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productCategoryData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="sales"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="activity-section">
        <div className="activity-card">
          <h2 className="activity-title">Quick Stats</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-label">Avg. Revenue per Subscription</span>
              <span className="activity-value">${(stats.totalRevenue / stats.activeSubscriptions).toFixed(2)}</span>
            </div>
            <div className="activity-item">
              <span className="activity-label">Customer Retention Rate</span>
              <span className="activity-value">94.2%</span>
            </div>
            <div className="activity-item">
              <span className="activity-label">New Subscriptions This Month</span>
              <span className="activity-value">142</span>
            </div>
            <div className="activity-item">
              <span className="activity-label">Avg. Subscription Duration</span>
              <span className="activity-value">6.5 months</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
