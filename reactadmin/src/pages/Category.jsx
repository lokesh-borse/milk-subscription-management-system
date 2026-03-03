import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ps = {
    container: { padding: '28px', maxWidth: 1200, margin: '0 auto' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    title: { margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
    badge: { fontSize: 13, color: '#64748b', background: '#f1f5f9', borderRadius: 999, padding: '4px 12px', fontWeight: 600 },
    card: { background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(15,23,42,0.06)', marginBottom: 20 },
    cardTitle: { margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#0f172a' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 },
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
    fileInput: { width: '100%', fontSize: 12, color: '#475569' },
    imgThumb: { width: 48, height: 48, objectFit: 'cover', borderRadius: 8, display: 'block' },
    imgEditWrap: { display: 'grid', gap: 8, minWidth: 220 },
};

const Category = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    const [uploadingAdd, setUploadingAdd] = useState(false);
    const [uploadingEditId, setUploadingEditId] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editRow, setEditRow] = useState({});
    const [newItem, setNewItem] = useState({ name: '', description: '', image: '' });

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get('/category/category/');
            setItems(res.data);
            setError(null);
        } catch {
            setError('Failed to load categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const onChange = (e) => setNewItem((p) => ({ ...p, [e.target.name]: e.target.value }));

    const uploadImageFile = async (file) => {
        const fd = new FormData();
        fd.append('image', file);
        const res = await api.post('/category/upload-image/', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data?.image || '';
    };

    const onAddImageFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingAdd(true);
        setFormError(null);
        try {
            const imageUrl = await uploadImageFile(file);
            if (imageUrl) setNewItem((p) => ({ ...p, image: imageUrl }));
        } catch (err) {
            setFormError(err.response?.data?.detail || 'Failed to upload image');
        } finally {
            setUploadingAdd(false);
            e.target.value = '';
        }
    };

    const onEditImageFileChange = async (e, id) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingEditId(id);
        setError(null);
        try {
            const imageUrl = await uploadImageFile(file);
            if (imageUrl) setEditRow((r) => ({ ...r, image: imageUrl }));
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to upload image');
        } finally {
            setUploadingEditId(null);
            e.target.value = '';
        }
    };

    const addItem = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await api.post('/category/category/', newItem);
            setNewItem({ name: '', description: '', image: '' });
            load();
        } catch (err) {
            setFormError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to add category');
        }
    };

    const startEdit = (item) => {
        setEditId(item.id);
        setEditRow({ name: item.name, description: item.description, image: item.image });
    };
    const cancelEdit = () => { setEditId(null); setEditRow({}); };
    const saveEdit = async (item) => {
        try {
            await api.put(`/category/category/${item.id}/`, { ...item, ...editRow });
            setEditId(null);
            load();
        } catch {
            setError('Failed to update category.');
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await api.delete(`/category/category/${id}/`);
            load();
        } catch {
            setError('Failed to delete category.');
        }
    };

    return (
        <div style={ps.container}>
            <div style={ps.header}>
                <h1 style={ps.title}>Categories</h1>
                <span style={ps.badge}>{items.length} categories</span>
            </div>

            <div style={ps.card}>
                <p style={ps.cardTitle}>Add New Category</p>
                {formError && <div style={ps.error}>{formError}</div>}
                <form onSubmit={addItem}>
                    <div style={ps.formGrid}>
                        <div>
                            <label style={ps.label}>Name</label>
                            <input type="text" name="name" value={newItem.name} onChange={onChange} required style={ps.input}
                                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                        <div>
                            <label style={ps.label}>Description</label>
                            <input type="text" name="description" value={newItem.description} onChange={onChange} required style={ps.input}
                                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 1' }}>
                            <label style={ps.label}>Image URL</label>
                            <input type="url" name="image" value={newItem.image} onChange={onChange} placeholder="https://..." style={ps.input}
                                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={onAddImageFileChange}
                                style={ps.fileInput}
                            />
                            {uploadingAdd && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Uploading image...</div>}
                        </div>
                    </div>
                    <button type="submit" style={ps.submitBtn}>+ Add Category</button>
                </form>
            </div>

            <div style={ps.card}>
                {error && <div style={ps.error}>{error}</div>}
                {loading ? <div style={ps.loading}>Loading categories...</div> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={ps.table}>
                            <thead>
                                <tr>{['Image', 'Name', 'Description', 'Actions'].map(h => <th key={h} style={ps.th}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr><td colSpan={4} style={{ ...ps.td, textAlign: 'center', color: '#94a3b8' }}>No categories yet.</td></tr>
                                ) : items.map(item => (
                                    <tr key={item.id}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={ps.td}>
                                            {editId === item.id ? (
                                                <div style={ps.imgEditWrap}>
                                                    {editRow.image ? (
                                                        <img src={editRow.image} alt="" style={ps.imgThumb} onError={e => { e.currentTarget.style.display = 'none'; }} />
                                                    ) : <span style={{ color: '#cbd5e1' }}>-</span>}
                                                    <input
                                                        type="url"
                                                        value={editRow.image || ''}
                                                        onChange={e => setEditRow(r => ({ ...r, image: e.target.value }))}
                                                        placeholder="https://..."
                                                        style={ps.inlineInput}
                                                    />
                                                    <input
                                                        type="file"
                                                        accept="image/png,image/jpeg,image/webp"
                                                        onChange={(e) => onEditImageFileChange(e, item.id)}
                                                        style={ps.fileInput}
                                                    />
                                                    {uploadingEditId === item.id && <div style={{ fontSize: 12, color: '#64748b' }}>Uploading image...</div>}
                                                </div>
                                            ) : (
                                                item.image
                                                    ? <img src={item.image} alt="" style={ps.imgThumb} onError={e => { e.currentTarget.style.display = 'none'; }} />
                                                    : <span style={{ color: '#cbd5e1' }}>-</span>
                                            )}
                                        </td>
                                        <td style={ps.td}>
                                            {editId === item.id
                                                ? <input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} style={ps.inlineInput} />
                                                : <strong>{item.name}</strong>}
                                        </td>
                                        <td style={ps.td}>
                                            {editId === item.id
                                                ? <input value={editRow.description} onChange={e => setEditRow(r => ({ ...r, description: e.target.value }))} style={ps.inlineInput} />
                                                : item.description}
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

export default Category;
