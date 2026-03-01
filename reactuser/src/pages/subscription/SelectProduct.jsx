import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SelectProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    const load = async () => {
      setLoading(true);
      setError(null);
      console.debug('[SubFlow] Fetch products for category', draft.category);
      try {
        const res = await api.get('/product/product/', { params: draft.category ? { category: draft.category } : {} });
        setProducts(res.data || []);
      } catch (e) {
        console.debug('[SubFlow] Product error', e);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const choose = (p) => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, product: p.id }));
    navigate('/subscribe/quantity');
  };

  return (
    <div>
      <h3 className="title">Choose a Product</h3>
      {loading ? (
        <div className="grid cols-3">
          {[...Array(6)].map((_,i) => <div key={i} className="skeleton"></div>)}
        </div>
      ) : error ? (
        <div className="card card-body">{error}</div>
      ) : products.length === 0 ? (
        <div className="card card-body">No products available.</div>
      ) : (
        <div className="grid cols-3">
          {products.map(p => (
            <div className="product-card" key={p.id}>
              <div className="product-name">{p.name}</div>
              <div className="product-desc">{p.description}</div>
              <button className="btn" onClick={() => choose(p)}>Select</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectProduct;
