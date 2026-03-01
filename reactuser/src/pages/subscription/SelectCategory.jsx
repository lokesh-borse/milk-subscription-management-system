import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SelectCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
