import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Subscription = () => {
    const [items, setItems] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItem, setNewItem] = useState({
        customer: '',
        product: '',
        quantity: '',
        duration: '',
        delivery_slot: '',
        address: '',
        status: 'active'
    });

    const loadItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const [sRes, cRes, pRes] = await Promise.all([
                api.get('/subscription/subscription/'),
                api.get('/customer/customer/'),
                api.get('/product/product/'),
            ]);
            setItems(sRes.data);
            setCustomers(cRes.data);
            setProducts(pRes.data);
        } catch (err) {
            setError('Failed to load subscriptions, customers, or products');
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
            await api.post('/subscription/subscription/', newItem);
            setNewItem({ customer: '', product: '', quantity: '', duration: '', delivery_slot: '', address: '', status: 'active' });
            loadItems();
        } catch (err) {
            console.error('Error adding subscription:', err);
        }
    };

    const deleteItem = async (id) => {
        try {
            await api.delete(`/subscription/subscription/${id}/`);
            loadItems();
        } catch (err) {
            console.error('Error deleting subscription:', err);
        }
    };

    const toggleStatus = async (row) => {
        const next = row.status === 'paused' ? 'active' : 'paused';
        await api.patch(`/subscription/subscription/${row.id}/`, { status: next });
        loadItems();
    };

    const nameById = (list, id) => {
        const f = list.find(x => x.id === id);
        return f ? f.name : id;
    };

    return (
        <div className="mt-4">
            <h2>Subscription Management</h2>
            <div className="card mb-4 mt-3">
                <div className="card-body">
                    <h5 className="card-title">Add New Subscription</h5>
                    <form onSubmit={addItem} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">CUSTOMER ID</label>
                            <input
                                type="number"
                                className="form-control"
                                name="customer"
                                value={newItem.customer}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">PRODUCT ID</label>
                            <input
                                type="number"
                                className="form-control"
                                name="product"
                                value={newItem.product}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">QUANTITY</label>
                            <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                value={newItem.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">DURATION (months)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="duration"
                                value={newItem.duration}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">DELIVERY SLOT</label>
                            <select
                                className="form-select"
                                name="delivery_slot"
                                value={newItem.delivery_slot}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select slot</option>
                                <option value="morning">Morning</option>
                                <option value="noon">Noon</option>
                                <option value="evening">Evening</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">ADDRESS</label>
                            <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={newItem.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">STATUS</label>
                            <select
                                className="form-select"
                                name="status"
                                value={newItem.status}
                                onChange={handleInputChange}
                            >
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-success">Add Subscription</button>
                        </div>
                    </form>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? <div>Loading...</div> : (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>CUSTOMER</th>
                        <th>PRODUCT</th>
                        <th>QUANTITY</th>
                        <th>DURATION</th>
                        <th>SLOT</th>
                        <th>ADDRESS</th>
                        <th>STATUS</th>
                        <th>START DATE</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{nameById(customers, item.customer)}</td>
                            <td>{nameById(products, item.product)}</td>
                            <td>{item.quantity}</td>
                            <td>{item.duration}</td>
                            <td>{item.delivery_slot}</td>
                            <td>{item.address}</td>
                            <td>{item.status}</td>
                            <td>{new Date(item.start_date).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-secondary btn-sm me-2" onClick={() => toggleStatus(item)}>{item.status === 'paused' ? 'Resume' : 'Pause'}</button>
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

export default Subscription;
