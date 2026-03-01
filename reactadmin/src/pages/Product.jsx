import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Product = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        category: '',
        description: ''
    });

    const loadItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const [pRes, cRes] = await Promise.all([
                api.get('/product/product/'),
                api.get('/category/category/'),
            ]);
            setItems(pRes.data);
            setCategories(cRes.data);
        } catch (err) {
            setError('Failed to load products or categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const addItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/product/product/', newItem);
            setNewItem({ name: '', price: '', category: '', description: '' });
            loadItems();
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

    const deleteItem = async (id) => {
        try {
            await api.delete(`/product/product/${id}/`);
            loadItems();
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    return (
        <div className="mt-4">
            <h2>Product Management</h2>
            <div className="card mb-4 mt-3">
                <div className="card-body">
                    <h5 className="card-title">Add New Product</h5>
                    <form onSubmit={addItem} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">NAME</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={newItem.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">PRICE</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                name="price"
                                value={newItem.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">CATEGORY</label>
                            <select
                                className="form-select"
                                name="category"
                                value={newItem.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">DESCRIPTION</label>
                            <input
                                type="text"
                                className="form-control"
                                name="description"
                                value={newItem.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-success">Add Product</button>
                        </div>
                    </form>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? <div>Loading...</div> : (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>DESCRIPTION</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>${parseFloat(item.price).toFixed(2)}</td>
                            <td>{item.category}</td>
                            <td>{item.description}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
    );
};

export default Product;
