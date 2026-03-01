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
      console.debug('[Dashboard] Fetching subscriptions for', user?.id);
      try {
        const res = await api.get('/subscription/subscription/', { params: { customer: user?.id } });
        setSubs(res.data || []);
        console.debug('[Dashboard] Loaded', res.data?.length);
      } catch (e) {
        console.debug('[Dashboard] Error', e);
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
    } catch {
      // noop
    }
  };

  return (
    <div>
      <h2 className="title">My Dashboard</h2>
      <div className="sidebar-layout">
        <aside className="sidebar">
          <div className="card sidecard">
            <div className="product-name">Profile</div>
            <div className="muted">Name</div>
            <div style={{ marginBottom: 8 }}>{user?.name || '—'}</div>
            <div className="muted">Email</div>
            <div style={{ marginBottom: 8 }}>{user?.email || '—'}</div>
            <div className="muted" style={{ fontSize: 12 }}>Manage address during subscription flow.</div>
          </div>
        </aside>
        <section>
          <div className="card card-body">
            <div className="product-name">Active Subscriptions</div>
            {loading ? (
              <div className="grid cols-3" style={{ marginTop: 12 }}>
                {[...Array(3)].map((_,i) => <div key={i} className="skeleton"></div>)}
              </div>
            ) : error ? (
              <div>{error}</div>
            ) : subs.length === 0 ? (
              <div className="muted">No subscriptions yet.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Duration</th>
                    <th>Slot</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map(s => (
                    <tr key={s.id}>
                      <td>{s.product_name || `#${s.product}`}</td>
                      <td>{s.quantity}</td>
                      <td>{s.duration} mo</td>
                      <td>{s.delivery_slot}</td>
                      <td><span className={`status ${s.status}`}>{s.status}</span></td>
                      <td>
                        <button onClick={() => togglePause(s)} className="btn outline">{s.status === 'paused' ? 'Resume' : 'Pause'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
