import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/product/product/${id}/`);
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

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <Link to="/products" className="link" style={{ display: 'inline-block', marginBottom: '32px' }}>&larr; Back to Selection</Link>
      
      <div className="grid cols-2" style={{ alignItems: 'center', gap: '64px' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', borderRadius: '24px' }}>
          <img
            alt={product.name}
            loading="lazy"
            src={product.image || product.image_url || `https://source.unsplash.com/1000x600/?${encodeURIComponent(product.name || 'milk')}`}
            onError={(e) => { e.target.src = `https://source.unsplash.com/1000x600/?milk&sig=${product.id || Math.random()}`; }}
            style={{ width: '100%', height: '600px', objectFit: 'cover', display: 'block' }}
          />
        </div>
        
        <div>
          <h2 className="title" style={{ fontSize: '48px', marginBottom: '16px' }}>{product.name}</h2>
          <div className="price" style={{ fontSize: '28px', marginBottom: '32px' }}>${product.price}</div>
          
          <p className="subtitle" style={{ fontSize: '18px' }}>{product.description}</p>
          
          <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '32px 0' }} />
          
          <ul style={{ color: 'var(--muted)', lineHeight: '2', paddingLeft: '20px', marginBottom: '40px' }}>
            <li>Farm-to-table freshness guaranteed</li>
            <li>Cold-pressed processing to retain nutrients</li>
            <li>Available for recurring delivery</li>
          </ul>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to={isAuthenticated ? '/subscribe/category' : '/login'} className="btn" style={{ padding: '18px 40px', fontSize: '16px' }}>
              Subscribe to Delivery
            </Link>
            <button
              className="btn btn-outline-light"
              style={{ padding: '16px 28px' }}
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
            >Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;