import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/products/product/${id}/`);
        setProduct(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>Loading...</div>;
  if (!product) return <div className="container">Not found.</div>;

  const categoryLabel = product.category_name || 'Dairy';

  const handleStartSubscription = () => {
    const draft = {
      category: product.category,
      product: product.id,
    };
    sessionStorage.setItem('subDraft', JSON.stringify(draft));

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    navigate('/subscribe/quantity');
  };

  return (
    <div className="section">
      <div className="container">
        <Link to="/products" className="link-arrow" style={{ marginBottom: '40px' }}>&larr; Back to Selection</Link>

        <div className="grid cols-2 gap-lg align-center">
          <div className="product-image-display" style={{ position: 'relative' }}>
            <div className="image-wrapper" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', aspectRatio: '4/5' }}>
              <img
                alt={product.name}
                loading="lazy"
                src={
                  product.image || product.image_url || (() => {
                    const categoryFallbacks = {
                      'milk': [248412, 1251175, 416978],
                      'curd & yogurt': [4006347, 5946688, 4669024],
                      'paneer & cheese': [10585061, 4198019, 821365],
                      'butter & ghee': [5313343, 7262897, 6660185],
                      'buttermilk & lassi': [6544370, 5946639, 6544370],
                      'flavored milk & shakes': [5946633, 5946082, 5946973],
                      'eggs': [162712, 6941036, 1759279],
                      'bread & bakery': [1775043, 2434, 2067396],
                    };
                    const categoryKey = (product.category_name || 'milk').toLowerCase();
                    const fallbackIds = categoryFallbacks[categoryKey] || [248412];
                    const fallbackId = fallbackIds[(product.id || 0) % fallbackIds.length];
                    return `https://images.pexels.com/photos/${fallbackId}/pexels-photo-${fallbackId}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
                  })()
                }
                onError={(e) => { e.target.src = `https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1200`; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="badge-premium" style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--accent)', color: '#fff', padding: '8px 16px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Estate Bottled
            </div>
          </div>

          <div className="product-details-content">
            <h4 className="overline">Premium Selection</h4>
            <h1 className="title" style={{ fontSize: '4rem', marginBottom: '24px' }}>{product.name}</h1>
            <p className="subtitle" style={{ marginBottom: '8px', color: 'var(--muted)' }}>
              Category: <strong style={{ color: 'var(--primary)' }}>{categoryLabel}</strong>
            </p>
            <div className="price-tag" style={{ fontSize: '2.5rem', marginBottom: '32px', color: 'var(--primary)', fontWeight: 500 }}>{formatINR(product.price)}</div>

            <p className="subtitle" style={{ fontSize: '1.25rem', lineHeight: '1.7', marginBottom: '40px' }}>{product.description}</p>

            <div className="feature-list" style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                <span style={{ fontWeight: 600 }}>Farm-to-table freshness guaranteed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                <span style={{ fontWeight: 600 }}>Cold-pressed processing to retain nutrients</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                <span style={{ fontWeight: 600 }}>Available for recurring sunrise delivery</span>
              </div>
            </div>

            <div className="actions" style={{ display: 'flex', gap: '24px' }}>
              <button className="btn btn-large btn-accent" style={{ flex: 1 }} onClick={handleStartSubscription}>
                Start Subscription
              </button>
              <button
                className="btn btn-large btn-outline"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                onClick={() => {
                  try {
                    const raw = localStorage.getItem('cart');
                    const cart = raw ? JSON.parse(raw) : [];
                    const existing = cart.find(i => i.id === product.id);
                    if (existing) existing.qty = (existing.qty || 1) + 1;
                    else cart.push({ id: product.id, name: product.name, price: Number(product.price) || 0, image: product.image || null, qty: 1 });
                    localStorage.setItem('cart', JSON.stringify(cart));
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: `Added ${product.name} to cart` } }));
                  } catch (e) { }
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
