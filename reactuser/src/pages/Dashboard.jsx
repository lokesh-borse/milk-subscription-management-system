import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [subs, setSubs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const togglePause = async (s) => {
    try {
      const updated = await api.patch(`/subscription/subscription/${s.id}/`, { status: s.status === 'paused' ? 'active' : 'paused' });
      setSubs(prev => prev.map(p => p.id === s.id ? updated.data : p));
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: `Subscription ${updated.data.status === 'paused' ? 'paused' : 'resumed'}` } }));
    } catch {
      // noop
    }
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div className="dashboard-hero card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <img src={`https://source.unsplash.com/140x140/?farm,milk`} alt="Profile farm" style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }} loading="lazy" />
          <div>
            <h2 className="title">Welcome back, {user?.name || 'Friend'}</h2>
            <p className="subtitle">Here's a snapshot of your active subscriptions and recent recommendations.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button className="btn btn-sm">Manage Profile</button>
              <button className="btn btn-sm btn-outline-light">Edit Addresses</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '320px 1fr', gap: 28 }}>
        <aside>
          <div className="card sidecard" style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <img src={`https://source.unsplash.com/80x80/?portrait,person`} alt="avatar" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }} loading="lazy" />
              <div>
                <div className="product-name">{user?.name || '—'}</div>
                <div className="muted" style={{ fontSize: 13 }}>{user?.email || '—'}</div>
              </div>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '14px 0' }} />
            <div style={{ display: 'grid', gap: 10 }}>
              <div className="muted" style={{ fontSize: 13 }}>Saved Addresses</div>
              <div className="card" style={{ padding: 12 }}>
                <div style={{ fontWeight: 600 }}>{user?.address || 'No saved address'}</div>
                <div className="muted" style={{ fontSize: 13 }}>You can edit addresses during checkout.</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div className="product-name">Account Summary</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <div className="stat-card">
                <div className="stat-value">{subs.length}</div>
                <div className="muted">Active subscriptions</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">—</div>
                <div className="muted">Rewards</div>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <div className="card card-body" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="product-name">Active Subscriptions</div>
                <div className="muted" style={{ marginTop: 6 }}>Manage deliveries, pause or resume plans.</div>
              </div>
              <div>
                <button className="btn btn-sm">New Subscription</button>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              {loading ? (
                <div className="grid cols-3" style={{ gap: 16 }}>
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
                </div>
              ) : error ? (
                <div className="muted">{error}</div>
              ) : subs.length === 0 ? (
                <div className="muted">You have no active subscriptions. Explore our plans to get started.</div>
              ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 8 }}>
                  {subs.map(s => (
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 700 }}>{s.product_name || `Product #${s.product}`}</div>
                            <div className={`status ${s.status}`}>{s.status}</div>
                          </div>
                          <div className="muted" style={{ marginTop: 8 }}>{s.quantity} x • {s.duration} month</div>
                          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                            <button className="btn btn-sm" onClick={() => togglePause(s)}>{s.status === 'paused' ? 'Resume' : 'Pause'}</button>
                            <a className="btn btn-sm btn-outline-light" href={`/product/${s.product}`}>Details</a>
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
            <div className="section-header split">
              <h3 className="title" style={{ fontSize: 20 }}>Recommended for you</h3>
              <a className="link-arrow" href="/products">See all &rarr;</a>
            </div>
            <div className="grid cols-4 gap-sm" style={{ marginTop: 12 }}>
              {["yogurt","cheese","milk","butter"].map((term, i) => (
                <div key={i} className="product-card card" style={{ padding: 12 }}>
                  <div className="product-img-wrapper">
                    <img loading="lazy" className="product-img" src={`https://source.unsplash.com/600x600/?${term}&sig=${i}`} alt={term} />
                  </div>
                  <div className="product-info">
                    <div className="product-name">{term.charAt(0).toUpperCase()+term.slice(1)}</div>
                    <div className="product-meta muted">Handpicked from local farms</div>
                    <div style={{ marginTop: 12 }}>
                      <button className="btn btn-sm">Add</button>
                      <button className="btn btn-sm btn-outline-light" style={{ marginLeft: 8 }}>View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
