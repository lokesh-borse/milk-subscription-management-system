import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ProgressStepper from '../../components/ProgressStepper';

const SelectCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const steps = [
    { id: 1, label: 'Category', description: 'Choose category' },
    { id: 2, label: 'Product', description: 'Select product' },
    { id: 3, label: 'Quantity', description: 'Pick quantity' },
    { id: 4, label: 'Duration', description: 'Select duration' },
    { id: 5, label: 'Delivery Slot', description: 'Choose slot' },
    { id: 6, label: 'Address', description: 'Delivery address' },
    { id: 7, label: 'Confirm', description: 'Review order' },
    { id: 8, label: 'Success', description: 'Complete!' },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);   
      console.debug('[SubFlow] Fetch categories');
      try {
        const res = await api.get('/category/category/');
        setCategories(res.data || []);
      } catch (e) {
        console.debug('[SubFlow] Category error', e);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const choose = (cat) => {
    sessionStorage.setItem('subDraft', JSON.stringify({ category: cat.id }));
    navigate('/subscribe/product');
  };

  return (
    <div>
      <ProgressStepper currentStep={1} steps={steps} orientation="horizontal" />
      <h3 className="title">Choose a Category</h3>
      {loading ? (
        <div className="grid cols-3">
          {[...Array(6)].map((_,i) => <div key={i} className="skeleton"></div>)}
        </div>
      ) : error ? (
        <div className="card card-body">{error}</div>
      ) : categories.length === 0 ? (
        <div className="card card-body">No categories found.</div>
      ) : (
        <div className="grid cols-3">
          {categories.map(c => (
            <div className="card card-body" key={c.id}>
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.name}
                  style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
                  loading="lazy"
                />
              ) : null}
              <div className="product-name">{c.name}</div>
              <div className="product-desc">{c.description}</div>
              <button className="btn" onClick={() => choose(c)}>Select</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectCategory;
