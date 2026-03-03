import React, { useState, useEffect } from 'react';
import api from '../services/api';

const pageStyles = {
    container: { padding: '28px', maxWidth: 1200, margin: '0 auto' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    title: { margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
    card: {
        background: '#fff', borderRadius: 16, padding: 24,
        border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(15,23,42,0.06)', marginBottom: 20,
    },
    cardTitle: { margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#0f172a' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 },
    label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' },
    input: {
        width: '100%', boxSizing: 'border-box',
        border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 12px',
        fontSize: 14, color: '#1e293b', background: '#f8fafc', outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    submitBtn: {
        marginTop: 16, background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
        border: 'none', borderRadius: 10, padding: '11px 22px',
        color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(59,130,246,0.35)', transition: 'all 0.2s',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '2px solid #f1f5f9', background: '#f8fafc' },
    td: { padding: '12px 14px', fontSize: 14, color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
    deleteBtn: { background: '#fee2e2', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
    editBtn: { background: '#eff6ff', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#2563eb', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginRight: 6, transition: 'all 0.2s' },
    saveBtn: { background: '#dcfce7', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#16a34a', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginRight: 6, transition: 'all 0.2s' },
    cancelBtn: { background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginRight: 6, transition: 'all 0.2s' },
    error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 16 },
    loading: { textAlign: 'center', padding: 40, color: '#64748b', fontSize: 14 },
    inlineInput: {
        border: '1.5px solid #bfdbfe', borderRadius: 8, padding: '6px 10px', fontSize: 13,
        width: '100%', boxSizing: 'border-box', outline: 'none', background: '#eff6ff',
    },
};

const Staff = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editRow, setEditRow] = useState({});
    const [newItem, setNewItem] = useState({ email: '', password: '', name: '', phone: '', address: '' });
    const [formError, setFormError] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get('/staff/staff/');
            setItems(res.data);
            setError(null);
        } catch {
            setError('Failed to load staff. Check that backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const addItem = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await api.post('/staff/staff/', newItem);
            setNewItem({ email: '', password: '', name: '', phone: '', address: '' });
            load();
        } catch (err) {
            setFormError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to add staff');
        }
    };

    const startEdit = (item) => {
        setEditId(item.id);
        setEditRow({ name: item.name, phone: item.phone, address: item.address });
    };

    const cancelEdit = () => { setEditId(null); setEditRow({}); };

    const saveEdit = async (item) => {
        try {
            await api.put(`/staff/staff/${item.id}/`, { ...item, ...editRow });
            setEditId(null);
            load();
        } catch (err) {
            setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to update staff');
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Delete this staff member?')) return;
        try {
            await api.delete(`/staff/staff/${id}/`);
            load();
        } catch {
            setError('Failed to delete staff member.');
        }
    };

    return (
        <div style={pageStyles.container}>
            <div style={pageStyles.header}>
                <h1 style={pageStyles.title}>Staff Management</h1>
                <span style={{ fontSize: 13, color: '#64748b', background: '#f1f5f9', borderRadius: 999, padding: '4px 12px', fontWeight: 600 }}>
                    {items.length} members
                </span>
            </div>

            {/* Add Form */}
            <div style={pageStyles.card}>
                <p style={pageStyles.cardTitle}>Add New Staff Member</p>
                {formError && <div style={pageStyles.error}>{formError}</div>}
                <form onSubmit={addItem}>
                    <div style={pageStyles.formGrid}>
                        {[
                            { key: 'email', label: 'Email', type: 'email' },
                            { key: 'password', label: 'Password', type: 'password' },
                            { key: 'name', label: 'Name', type: 'text' },
                            { key: 'phone', label: 'Phone', type: 'text' },
                            { key: 'address', label: 'Address', type: 'text' },
                        ].map(({ key, label, type }) => (
                            <div key={key}>
                                <label style={pageStyles.label}>{label}</label>
                                <input
                                    type={type} name={key} value={newItem[key]}
                                    onChange={handleInputChange} required={key !== 'address'}
                                    style={pageStyles.input}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        ))}
                    </div>
                    <button type="submit" style={pageStyles.submitBtn}>+ Add Staff</button>
                </form>
            </div>

            {/* Table */}
            <div style={pageStyles.card}>
                {error && <div style={pageStyles.error}>{error}</div>}
                {loading ? (
                    <div style={pageStyles.loading}>Loading staff members…</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={pageStyles.table}>
                            <thead>
                                <tr>
                                    {['Email', 'Name', 'Phone', 'Address', 'Actions'].map(h => (
                                        <th key={h} style={pageStyles.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr><td colSpan={5} style={{ ...pageStyles.td, textAlign: 'center', color: '#94a3b8' }}>No staff members yet.</td></tr>
                                ) : items.map(item => (
                                    <tr key={item.id} style={{ transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={pageStyles.td}>{item.email}</td>
                                        <td style={pageStyles.td}>
                                            {editId === item.id
                                                ? <input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} style={pageStyles.inlineInput} />
                                                : item.name}
                                        </td>
                                        <td style={pageStyles.td}>
                                            {editId === item.id
                                                ? <input value={editRow.phone} onChange={e => setEditRow(r => ({ ...r, phone: e.target.value }))} style={pageStyles.inlineInput} />
                                                : item.phone}
                                        </td>
                                        <td style={pageStyles.td}>
                                            {editId === item.id
                                                ? <input value={editRow.address} onChange={e => setEditRow(r => ({ ...r, address: e.target.value }))} style={pageStyles.inlineInput} />
                                                : item.address}
                                        </td>
                                        <td style={pageStyles.td}>
                                            {editId === item.id ? (
                                                <>
                                                    <button style={pageStyles.saveBtn} onClick={() => saveEdit(item)}>Save</button>
                                                    <button style={pageStyles.cancelBtn} onClick={cancelEdit}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button style={pageStyles.editBtn} onClick={() => startEdit(item)}>Edit</button>
                                                    <button style={pageStyles.deleteBtn} onClick={() => deleteItem(item.id)}>Delete</button>
                                                </>
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

export default Staff;
