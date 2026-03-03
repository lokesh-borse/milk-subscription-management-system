import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ps = {
    container: { padding: '28px', maxWidth: 1200, margin: '0 auto' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    title: { margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
    badge: { fontSize: 13, color: '#64748b', background: '#f1f5f9', borderRadius: 999, padding: '4px 12px', fontWeight: 600 },
    card: { background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(15,23,42,0.06)', marginBottom: 20 },
    cardTitle: { margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#0f172a' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 },
    label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' },
    input: { width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#1e293b', background: '#f8fafc', outline: 'none' },
    submitBtn: { marginTop: 16, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: 10, padding: '11px 22px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.35)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '2px solid #f1f5f9', background: '#f8fafc' },
    td: { padding: '12px 14px', fontSize: 14, color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
    deleteBtn: { background: '#fee2e2', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
    editBtn: { background: '#eff6ff', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#2563eb', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginRight: 6 },
    saveBtn: { background: '#dcfce7', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#16a34a', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginRight: 6 },
    cancelBtn: { background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginRight: 6 },
    error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 },
    loading: { textAlign: 'center', padding: 40, color: '#64748b', fontSize: 14 },
    inlineInput: { border: '1.5px solid #bfdbfe', borderRadius: 8, padding: '6px 10px', fontSize: 13, width: '100%', boxSizing: 'border-box', outline: 'none', background: '#eff6ff' },
};

const Customer = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editRow, setEditRow] = useState({});
    const [newItem, setNewItem] = useState({ name: '', email: '', phone: '', address: '', password: '' });

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get('/customer/customer/');
            setItems(res.data);
            setError(null);
        } catch { setError('Failed to load customers.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const onChange = e => setNewItem(p => ({ ...p, [e.target.name]: e.target.value }));

    const addItem = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await api.post('/customer/customer/', newItem);
            setNewItem({ name: '', email: '', phone: '', address: '', password: '' });
            load();
        } catch (err) { setFormError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to add customer'); }
    };

    const startEdit = (item) => { setEditId(item.id); setEditRow({ name: item.name, phone: item.phone, address: item.address }); };
    const cancelEdit = () => { setEditId(null); setEditRow({}); };
    const saveEdit = async (item) => {
        try {
            await api.put(`/customer/customer/${item.id}/`, { ...item, ...editRow });
            setEditId(null); load();
        } catch { setError('Failed to update customer.'); }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Delete this customer?')) return;
        try { await api.delete(`/customer/customer/${id}/`); load(); }
        catch { setError('Failed to delete customer.'); }
    };

    return (
        <div style={ps.container}>
            <div style={ps.header}>
                <h1 style={ps.title}>Customer Management</h1>
                <span style={ps.badge}>{items.length} customers</span>
            </div>

            <div style={ps.card}>
                <p style={ps.cardTitle}>Add New Customer</p>
                {formError && <div style={ps.error}>{formError}</div>}
                <form onSubmit={addItem}>
                    <div style={ps.formGrid}>
                        {[
                            { key: 'name', label: 'Full Name', type: 'text' },
                            { key: 'email', label: 'Email', type: 'email' },
                            { key: 'phone', label: 'Phone', type: 'text' },
                            { key: 'address', label: 'Address', type: 'text' },
                            { key: 'password', label: 'Password', type: 'password' },
                        ].map(({ key, label, type }) => (
                            <div key={key}>
                                <label style={ps.label}>{label}</label>
                                <input type={type} name={key} value={newItem[key]} onChange={onChange} required style={ps.input}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        ))}
                    </div>
                    <button type="submit" style={ps.submitBtn}>+ Add Customer</button>
                </form>
            </div>

            <div style={ps.card}>
                {error && <div style={ps.error}>{error}</div>}
                {loading ? <div style={ps.loading}>Loading customers…</div> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={ps.table}>
                            <thead>
                                <tr>{['Name', 'Email', 'Phone', 'Address', 'Actions'].map(h => <th key={h} style={ps.th}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr><td colSpan={5} style={{ ...ps.td, textAlign: 'center', color: '#94a3b8' }}>No customers yet.</td></tr>
                                ) : items.map(item => (
                                    <tr key={item.id}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={ps.td}>
                                            {editId === item.id
                                                ? <input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} style={ps.inlineInput} />
                                                : <><span style={{ fontWeight: 600 }}>{item.name}</span></>}
                                        </td>
                                        <td style={ps.td}>{item.email}</td>
                                        <td style={ps.td}>
                                            {editId === item.id
                                                ? <input value={editRow.phone} onChange={e => setEditRow(r => ({ ...r, phone: e.target.value }))} style={ps.inlineInput} />
                                                : item.phone}
                                        </td>
                                        <td style={ps.td}>
                                            {editId === item.id
                                                ? <input value={editRow.address} onChange={e => setEditRow(r => ({ ...r, address: e.target.value }))} style={ps.inlineInput} />
                                                : item.address}
                                        </td>
                                        <td style={ps.td}>
                                            {editId === item.id ? (
                                                <><button style={ps.saveBtn} onClick={() => saveEdit(item)}>Save</button><button style={ps.cancelBtn} onClick={cancelEdit}>Cancel</button></>
                                            ) : (
                                                <><button style={ps.editBtn} onClick={() => startEdit(item)}>Edit</button><button style={ps.deleteBtn} onClick={() => deleteItem(item.id)}>Delete</button></>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customer;
