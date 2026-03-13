import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ps = {
    container: { padding: '28px', maxWidth: 1400, margin: '0 auto' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    title: { margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
    badge: { fontSize: 13, color: '#64748b', background: '#f1f5f9', borderRadius: 999, padding: '4px 12px', fontWeight: 600 },
    card: { background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(15,23,42,0.06)', marginBottom: 20 },
    cardTitle: { margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#0f172a' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 },
    label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' },
    input: { width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#1e293b', background: '#f8fafc', outline: 'none' },
    select: { width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#1e293b', background: '#f8fafc', outline: 'none', cursor: 'pointer' },
    submitBtn: { marginTop: 16, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: 10, padding: '11px 22px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.35)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '2px solid #f1f5f9', background: '#f8fafc' },
    td: { padding: '12px 14px', fontSize: 14, color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
    deleteBtn: { background: '#fee2e2', border: 'none', borderRadius: 8, padding: '5px 10px', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
    pauseBtn: { background: '#fef9c3', border: 'none', borderRadius: 8, padding: '5px 10px', color: '#a16207', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginRight: 6 },
    resumeBtn: { background: '#dcfce7', border: 'none', borderRadius: 8, padding: '5px 10px', color: '#16a34a', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginRight: 6 },
    error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 },
    loading: { textAlign: 'center', padding: 40, color: '#64748b', fontSize: 14 },
};

const STATUS_COLORS = {
    active: { bg: '#f0fdf4', color: '#16a34a' },
    paused: { bg: '#fef9c3', color: '#a16207' },
};

const Subscription = () => {
    const [items, setItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [newItem, setNewItem] = useState({
        customer: '', product: '', quantity: '1', duration: '1',
        delivery_slot: 'morning', address: '', status: 'active',
    });

    const load = async () => {
        setLoading(true);
        try {
            const [sRes, cRes, pRes] = await Promise.all([
                api.get('/subscription/subscription/'),
                api.get('/customer/customer/'),
                api.get('/product/product/'),
            ]);
            setItems(sRes.data);
            setCustomers(cRes.data);
            setProducts(pRes.data);
            setError(null);
        } catch { setError('Failed to load data. Ensure the backend is running.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const onChange = e => setNewItem(p => ({ ...p, [e.target.name]: e.target.value }));

    const addItem = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await api.post('/subscription/subscription/', newItem);
            setNewItem({ customer: '', product: '', quantity: '1', duration: '1', delivery_slot: 'morning', address: '', status: 'active' });
            load();
        } catch (err) { setFormError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to add subscription'); }
    };

    const toggleStatus = async (row) => {
        const next = row.status === 'paused' ? 'active' : 'paused';
        try { await api.patch(`/subscription/subscription/${row.id}/`, { status: next }); load(); }
        catch { setError('Failed to update subscription status.'); }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Delete this subscription?')) return;
        try { await api.delete(`/subscription/subscription/${id}/`); load(); }
        catch { setError('Failed to delete subscription.'); }
    };

    const getName = (list, id) => list.find(x => x.id === id || x.id === Number(id))?.name || `#${id}`;

    return (
        <div style={ps.container}>
            <div style={ps.header}>
                <h1 style={ps.title}>Subscriptions</h1>
                <span style={ps.badge}>{items.length} total · {items.filter(s => s.status === 'active').length} active</span>
            </div>

            <div style={ps.card}>
                <p style={ps.cardTitle}>Add New Subscription</p>
                {formError && <div style={ps.error}>{formError}</div>}
                <form onSubmit={addItem}>
                    <div style={ps.formGrid}>
                        <div>
                            <label style={ps.label}>Customer</label>
                            <select name="customer" value={newItem.customer} onChange={onChange} required style={ps.select}>
                                <option value="">Select customer…</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={ps.label}>Product</label>
                            <select name="product" value={newItem.product} onChange={onChange} required style={ps.select}>
                                <option value="">Select product…</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={ps.label}>Quantity</label>
                            <input type="number" min="1" name="quantity" value={newItem.quantity} onChange={onChange} required style={ps.input}
                                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                        <div>
                            <label style={ps.label}>Duration (months)</label>
                            <input type="number" min="1" max="4" name="duration" value={newItem.duration} onChange={onChange} required style={ps.input}
                                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                        <div>
                            <label style={ps.label}>Delivery Slot</label>
                            <select name="delivery_slot" value={newItem.delivery_slot} onChange={onChange} required style={ps.select}>
                                <option value="morning">Morning</option>
                                <option value="noon">Noon</option>
                                <option value="evening">Evening</option>
                            </select>
                        </div>
                        <div>
                            <label style={ps.label}>Status</label>
                            <select name="status" value={newItem.status} onChange={onChange} style={ps.select}>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={ps.label}>Delivery Address</label>
                            <input type="text" name="address" value={newItem.address} onChange={onChange} required style={ps.input}
                                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>
                    <button type="submit" style={ps.submitBtn}>+ Add Subscription</button>
                </form>
            </div>

            <div style={ps.card}>
                {error && <div style={ps.error}>{error}</div>}
                {loading ? <div style={ps.loading}>Loading subscriptions…</div> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={ps.table}>
                            <thead>
                                <tr>
                                    {['Customer', 'Product', 'Qty', 'Duration', 'Slot', 'Address', 'Status', 'Start Date', 'Actions'].map(h => (
                                        <th key={h} style={ps.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr><td colSpan={9} style={{ ...ps.td, textAlign: 'center', color: '#94a3b8' }}>No subscriptions yet.</td></tr>
                                ) : items.map(item => {
                                    const sc = STATUS_COLORS[item.status] || {};
                                    return (
                                        <tr key={item.id}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={ps.td}><strong>{item.customer_name || getName(customers, item.customer)}</strong></td>
                                            <td style={ps.td}>{item.product_name || getName(products, item.product)}</td>
                                            <td style={ps.td}>{item.quantity}</td>
                                            <td style={ps.td}>{item.duration}mo</td>
                                            <td style={ps.td}><span style={{ textTransform: 'capitalize' }}>{item.delivery_slot}</span></td>
                                            <td style={ps.td}><span style={{ color: '#64748b', fontSize: 13 }}>{item.address || '—'}</span></td>
                                            <td style={ps.td}>
                                                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.color, textTransform: 'capitalize' }}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td style={ps.td}><span style={{ fontSize: 13, color: '#64748b' }}>{item.start_date ? new Date(item.start_date).toLocaleDateString() : '—'}</span></td>
                                            <td style={ps.td}>
                                                <button
                                                    style={item.status === 'paused' ? ps.resumeBtn : ps.pauseBtn}
                                                    onClick={() => toggleStatus(item)}
                                                >
                                                    {item.status === 'paused' ? 'Resume' : 'Pause'}
                                                </button>
                                                <button style={ps.deleteBtn} onClick={() => deleteItem(item.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscription;
