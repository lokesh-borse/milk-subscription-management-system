import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../../services/api';
import ProgressStepper from '../../components/ProgressStepper';

const SelectProduct = () => {
  const [products, setProducts] = useState([]);
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

  const fallbackImage = 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=900';

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    if (imageUrl.startsWith('//')) return `${window.location.protocol}${imageUrl}`;
    return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

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
      <ProgressStepper currentStep={2} steps={steps} orientation="horizontal" />
      <h3 className="title" style={{ marginBottom: 16, paddingInline: 8 }}>Choose a Product</h3>
      {loading ? (
        <div className="grid cols-3" style={{ paddingInline: 8, gap: 24 }}>
          {[...Array(6)].map((_,i) => <div key={i} className="skeleton"></div>)}
        </div>
      ) : error ? (
        <div className="card card-body" style={{ marginInline: 8 }}>{error}</div>
      ) : products.length === 0 ? (
        <div className="card card-body" style={{ marginInline: 8 }}>No products available.</div>
      ) : (
        <div className="grid cols-3" style={{ paddingInline: 8, gap: 24 }}>
          {products.map(p => (
            <div className="product-card" key={p.id}>
              <img
                src={resolveImageUrl(p.image) || `${fallbackImage}&sig=${p.id}`}
                alt={p.name}
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = `${fallbackImage}&sig=${p.id}`;
                }}
              />
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
