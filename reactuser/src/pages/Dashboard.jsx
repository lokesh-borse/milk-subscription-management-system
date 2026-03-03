import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { formatINR } from '../utils/currency';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subs, setSubs] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

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
    const price = Number(s.product_price) || 0;
    const quantity = Number(s.quantity) || 0;
    const duration = Number(s.duration) || 0;
    return price * quantity * 30 * duration;
  };

  const activeTotalPayable = subs
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + getSubscriptionTotal(s), 0);

  return (
    <section className="section">
      <div className="container">
        <div className="dashboard-hero card card-body" style={{ marginBottom: 24 }}>
          <div>
            <h2 className="title">Welcome back, {user?.name || 'Friend'}</h2>
            <p className="subtitle">Here is a snapshot of your active subscriptions and recommendations.</p>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '320px 1fr', gap: 28 }}>
          <aside>
            <div className="card card-body" style={{ marginBottom: 20 }}>
              <div>
                <div className="product-name">{user?.name || '-'}</div>
                <div className="muted" style={{ fontSize: 13 }}>{user?.email || '-'}</div>
              </div>
            </div>

            <div className="card card-body">
              <div className="product-name">Account Summary</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <div className="stat-card">
                  <div className="stat-value">{subs.length}</div>
                  <div className="muted">Active subscriptions</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{formatINR(activeTotalPayable)}</div>
                  <div className="muted">Total payable</div>
                </div>
              </div>
            </div>
          </aside>

          <main>
            <div className="card card-body" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div className="product-name">Active Subscriptions</div>
                  <div className="muted" style={{ marginTop: 6 }}>Manage deliveries, pause or resume plans.</div>
                  <div className="muted" style={{ marginTop: 6, fontWeight: 700 }}>
                    Total payable: {formatINR(activeTotalPayable)}
                  </div>
                </div>
                <Link className="btn btn-sm" to="/subscribe/category">New Subscription</Link>
              </div>

              <div style={{ marginTop: 18 }}>
                {loading ? (
                  <div className="grid cols-3" style={{ gap: 16 }}>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} height="120px" borderRadius="12px" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="muted">{error}</div>
                ) : subs.length === 0 ? (
                  <div className="muted">You have no active subscriptions. Explore our plans to get started.</div>
                ) : (
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 8 }}>
                    {subs.map((s) => (
                      <div key={s.id} className="subscription-card card" style={{ padding: 12 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <img
                            src={s.product_image || `https://source.unsplash.com/120x120/?milk,product&sig=${s.id}`}
                            alt={s.product_name}
                            loading="lazy"
                            onError={(e) => { e.target.src = `https://source.unsplash.com/120x120/?milk&sig=${s.id || Math.random()}`; }}
                            style={{ width: 120, height: 96, objectFit: 'cover', borderRadius: 8 }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                              <div style={{ fontWeight: 700 }}>{s.product_name || `Product #${s.product}`}</div>
                              <div className={`status ${s.status}`}>{s.status}</div>
                            </div>
                            <div className="muted" style={{ marginTop: 8 }}>{s.quantity} x {s.duration} month</div>
                            <div style={{ marginTop: 6, fontWeight: 700 }}>
                              Total fee: {formatINR(getSubscriptionTotal(s))}
                            </div>
                            <div className="actions" style={{ marginTop: 12 }}>
                              <button className="btn btn-sm" onClick={() => togglePause(s)}>{s.status === 'paused' ? 'Resume' : 'Pause'}</button>
                              <Link className="btn btn-sm outline" to={`/product/${s.product}`}>Details</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="card card-body">
              <div className="section-header split" style={{ marginBottom: 12 }}>
                <h3 className="title" style={{ fontSize: 20 }}>Recommended for you</h3>
                <Link className="link-arrow" to="/products">See all &rarr;</Link>
              </div>
              {productsLoading ? (
                <div className="grid cols-4 gap-sm">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} height="280px" borderRadius="12px" />
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
                        isFavorite={false}
                        onFavoriteToggle={() => { }}
                        onViewDetails={handleViewDetails}
                        onAddToCart={handleAddToCart}
                      />
                    ))
                  ) : (
                    <div className="muted" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                      No products available
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
