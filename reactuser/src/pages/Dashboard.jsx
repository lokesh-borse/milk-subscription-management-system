import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Package, Sparkles, Plus, Play, Pause, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { formatINR } from '../utils/currency';

// Empty State Milk Bottle SVG Component
const MilkBottleIllustration = () => (
  <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="milk-bottle-svg">
    <defs>
      <linearGradient id="bottleGrad" x1="60" y1="0" x2="60" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F8F9FA"/>
        <stop offset="100%" stopColor="#E5E7EB"/>
      </linearGradient>
      <linearGradient id="milkGrad" x1="60" y1="60" x2="60" y2="140" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEFEFE"/>
        <stop offset="100%" stopColor="#F3F4F6"/>
      </linearGradient>
    </defs>
    {/* Bottle neck */}
    <path d="M45 10 L45 30 Q45 35 40 40 L40 45 Q40 50 50 50 L70 50 Q80 50 80 45 L80 40 Q75 35 75 30 L75 10 Q75 5 60 5 Q45 5 45 10Z" fill="url(#bottleGrad)" stroke="#1B4332" strokeWidth="2" strokeOpacity="0.2"/>
    {/* Bottle body */}
    <path d="M35 50 Q30 55 30 70 L30 140 Q30 155 60 155 Q90 155 90 140 L90 70 Q90 55 85 50 L35 50Z" fill="url(#bottleGrad)" stroke="#1B4332" strokeWidth="2" strokeOpacity="0.2"/>
    {/* Milk level */}
    <path d="M35 80 Q32 85 32 90 L32 138 Q32 150 60 150 Q88 150 88 138 L88 90 Q88 85 85 80 L35 80Z" fill="url(#milkGrad)" stroke="#1B4332" strokeWidth="1" strokeOpacity="0.1"/>
    {/* Cap */}
    <rect x="42" y="2" width="36" height="10" rx="3" fill="#1B4332" fillOpacity="0.9"/>
    {/* Shine effect */}
    <ellipse cx="48" cy="100" rx="6" ry="20" fill="white" fillOpacity="0.5"/>
    {/* Label */}
    <rect x="40" y="95" width="40" height="25" rx="4" fill="#1B4332" fillOpacity="0.1"/>
    <text x="60" y="112" textAnchor="middle" fontSize="8" fill="#1B4332" fontWeight="600">FRESH</text>
  </svg>
);

const Dashboard = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [subs, setSubs] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
  }, [user?.name, user?.email, user?.phone, user?.address]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/subscription/subscription/', { params: { customer: user?.id } });
        setSubs(res.data || []);
      } catch (e) {
        setError('Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) load();
  }, [user?.id]);

  useEffect(() => {
    const loadRecommendations = async () => {
      setProductsLoading(true);
      try {
        const res = await api.get('/product/product/', { params: { limit: 4 } });
        setRecommendedProducts(res.data || []);
      } catch (e) {
        console.error('Error loading recommendations:', e);
      } finally {
        setProductsLoading(false);
      }
    };
    loadRecommendations();
  }, []);

  const togglePause = async (s) => {
    try {
      const updated = await api.patch(`/subscription/subscription/${s.id}/`, { status: s.status === 'paused' ? 'active' : 'paused' });
      setSubs((prev) => prev.map((p) => (p.id === s.id ? updated.data : p)));
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: `Subscription ${updated.data.status === 'paused' ? 'paused' : 'resumed'}` } }));
    } catch {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'Failed to update subscription' } }));
    }
  };

  const handleAddToCart = (productId) => {
    try {
      const product = recommendedProducts.find(p => p.id === productId);
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find(i => i.id === productId);
      if (existing) existing.qty = (existing.qty || 1) + 1;
      else cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image || null,
        qty: 1
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: `Added ${product.name} to cart` } }));
    } catch (e) {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'Failed to add to cart' } }));
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getSubscriptionTotal = (s) => {
    return Number(s.outstanding_balance) || 0;
  };

  const activeTotalPayable = subs
    .filter((s) => s.status === 'active' || s.status === 'paused')
    .reduce((sum, s) => sum + getSubscriptionTotal(s), 0);

  const onProfileFieldChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const payload = {
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      address: profileForm.address.trim(),
    };
    const res = await updateProfile(payload);
    if (res.ok) {
      setIsEditingProfile(false);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: 'Profile updated successfully' } }));
    } else {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: res.error || 'Failed to update profile' } }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } }
  };

  return (
    <motion.section 
      className="section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container">
        {/* Premium Hero Section */}
        <motion.div 
          className="dashboard-hero-premium glass-card"
          variants={itemVariants}
          style={{ 
            padding: 'var(--space-7)', 
            marginBottom: 'var(--space-6)',
            background: 'linear-gradient(135deg, rgba(27, 67, 50, 0.03), rgba(201, 162, 39, 0.05))'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-5)' }}>
            <div>
              <p className="overline" style={{ marginBottom: 8 }}>Welcome back</p>
              <h2 className="title" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: 8 }}>
                {user?.name || 'Friend'}
              </h2>
              <p className="subtitle">Your premium dairy dashboard awaits. Fresh deliveries, managed effortlessly.</p>
            </div>
            <Link className="btn btn-accent" to="/subscribe/category">
              <Plus size={18} />
              New Subscription
            </Link>
          </div>
        </motion.div>

        <div className="grid" style={{ gridTemplateColumns: '340px 1fr', gap: 28 }}>
          {/* Sidebar */}
          <aside>
            {/* Profile Card */}
            <motion.div 
              className="glass-card"
              variants={itemVariants}
              style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-5)' }}
            >
              {!isEditingProfile ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', marginBottom: 4 }}>{user?.name || '-'}</h3>
                      <span className="status-badge active" style={{ fontSize: '0.7rem' }}>
                        <Sparkles size={12} />
                        Premium Member
                      </span>
                    </div>
                    <button 
                      className="btn btn-sm outline" 
                      onClick={() => setIsEditingProfile(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      <Mail size={16} /> {user?.email || '-'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      <Phone size={16} /> {user?.phone || '-'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      <MapPin size={16} style={{ flexShrink: 0, marginTop: 2 }} /> 
                      <span>{user?.address || 'No address saved'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={saveProfile}>
                  <div className="field">
                    <label className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Name</label>
                    <input className="input" name="name" value={profileForm.name} onChange={onProfileFieldChange} required />
                  </div>
                  <div className="field">
                    <label className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email</label>
                    <input className="input" type="email" name="email" value={profileForm.email} onChange={onProfileFieldChange} required />
                  </div>
                  <div className="field">
                    <label className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone</label>
                    <input className="input" name="phone" value={profileForm.phone} onChange={onProfileFieldChange} required />
                  </div>
                  <div className="field">
                    <label className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Address</label>
                    <textarea className="textarea" name="address" value={profileForm.address} onChange={onProfileFieldChange} rows={3} required />
                  </div>
                  <div className="actions">
                    <button type="submit" className="btn btn-sm" disabled={authLoading}>{authLoading ? 'Saving...' : 'Save'}</button>
                    <button
                      type="button"
                      className="btn btn-sm outline"
                      onClick={() => {
                        setProfileForm({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                        });
                        setIsEditingProfile(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Account Summary */}
            <motion.div 
              className="glass-card"
              variants={itemVariants}
              style={{ padding: 'var(--space-5)' }}
            >
              <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>Account Summary</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(27, 67, 50, 0.06), rgba(27, 67, 50, 0.02))',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: 'var(--color-brand-500)' }}>{subs.filter(s => s.status === 'active').length}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>Active Plans</div>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(201, 162, 39, 0.04))',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: 'var(--color-brand-500)' }}>{formatINR(activeTotalPayable)}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>Outstanding</div>
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Main Content */}
          <main>
            {/* Subscriptions Section */}
            <motion.div 
              className="glass-card"
              variants={itemVariants}
              style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-5)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', marginBottom: 4 }}>Your Subscriptions</h3>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>Manage your daily dairy deliveries</p>
                </div>
              </div>

              {loading ? (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} height="180px" borderRadius="16px" />
                  ))}
                </div>
              ) : error ? (
                <div className="muted">{error}</div>
              ) : subs.length === 0 ? (
                /* Empty State with Milk Bottle */
                <div className="empty-state">
                  <div style={{ marginBottom: 'var(--space-5)' }}>
                    <MilkBottleIllustration />
                  </div>
                  <h4 className="empty-state-title">No Subscriptions Yet</h4>
                  <p className="empty-state-text">
                    Start your fresh dairy journey with our premium subscription plans. Farm-fresh milk delivered to your doorstep daily.
                  </p>
                  <Link className="btn btn-accent" to="/subscribe/category">
                    <Plus size={18} />
                    Start Your First Subscription
                  </Link>
                </div>
              ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                  {subs.map((s, index) => (
                    <motion.div 
                      key={s.id} 
                      className="subscription-card-premium"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    >
                      <div style={{ display: 'flex', gap: 16 }}>
                        <img
                          src={s.product_image || `https://source.unsplash.com/140x140/?milk,dairy&sig=${s.id}`}
                          alt={s.product_name}
                          loading="lazy"
                          onError={(e) => { e.target.src = `https://source.unsplash.com/140x140/?milk&sig=${s.id || Math.random()}`; }}
                          style={{ 
                            width: 100, 
                            height: 100, 
                            objectFit: 'cover', 
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                            <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', lineHeight: 1.3 }}>
                              {s.product_name || `Product #${s.product}`}
                            </h4>
                            <span className={`status-badge ${s.status}`}>
                              {s.status === 'active' ? <Play size={12} /> : <Pause size={12} />}
                              {s.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                            {s.quantity} unit/day • {s.active_days || 0} day{s.active_days === 1 ? '' : 's'}
                          </p>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-brand-500)' }}>
                            {formatINR(getSubscriptionTotal(s))}
                            <span style={{ fontWeight: 400, fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: 4 }}>outstanding</span>
                          </div>
                        </div>
                      </div>
                      <div className="actions" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border-light)' }}>
                        <motion.button 
                          className="btn btn-sm"
                          onClick={() => togglePause(s)}
                          whileTap={{ scale: 0.97 }}
                        >
                          {s.status === 'paused' ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
                        </motion.button>
                        <Link className="btn btn-sm outline" to={`/subscription-details/${s.id}`}>
                          Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recommendations Section */}
            <motion.div 
              className="glass-card"
              variants={itemVariants}
              style={{ padding: 'var(--space-6)' }}
            >
              <div className="section-header split" style={{ marginBottom: 'var(--space-5)' }}>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', marginBottom: 4 }}>Recommended For You</h3>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>Curated selections from our farm</p>
                </div>
                <Link className="link-arrow" to="/products">See all <ArrowRight size={16} /></Link>
              </div>
              {productsLoading ? (
                <div className="grid cols-4 gap-sm">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} height="280px" borderRadius="16px" />
                  ))}
                </div>
              ) : (
                <div className="grid cols-4 gap-sm">
                  {recommendedProducts.length > 0 ? (
                    recommendedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        price={Number(p.price) || 0}
                        image={p.image || p.image_url}
                        category={p.category_name || p.category || 'Dairy'}
                        rating={4.5}
                        reviewCount={0}
                        badge={p.is_popular ? 'Popular' : null}
                        onViewDetails={handleViewDetails}
                        onAddToCart={handleAddToCart}
                      />
                    ))
                  ) : (
                    <div className="empty-state" style={{ gridColumn: '1 / -1', padding: 'var(--space-8) 0' }}>
                      <Package size={48} strokeWidth={1.5} style={{ opacity: 0.4, marginBottom: 'var(--space-4)' }} />
                      <p className="muted">No products available at the moment</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </motion.section>
  );
};

export default Dashboard;
