import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const useQuery = () => new URLSearchParams(useLocation().search);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const q = useQuery();
  const category = q.get('category');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      console.debug('[Products] Fetching...', { category });
      try {
        const res = await api.get('/product/product/', { params: category ? { category } : {} });
        setProducts(res.data || []);
        console.debug('[Products] Loaded', res.data?.length);
      } catch (e) {
        console.debug('[Products] Error', e);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  return (
    <div>
      <h2 className="title">Products</h2>
      {loading ? (
        <div className="grid cols-4">
          {[...Array(8)].map((_,i) => <div key={i} className="skeleton"></div>)}
        </div>
      ) : error ? (
        <div className="card card-body">{error}</div>
      ) : products.length === 0 ? (
        <div className="card card-body">No products available.</div>
      ) : (
        <div className="grid cols-4 gap-sm">
          {products.map((p, idx) => (
            <div className="product-card card" key={p.id} style={{ padding: 16 }}>
                <div className="product-img-wrapper">
                  {/* Use Image with fallback to avoid broken icons when src is invalid */}
                  <img
                    alt={p.name}
                    className="product-img"
                    loading="lazy"
                    src={p.image || p.image_url || `https://source.unsplash.com/600x600/?${encodeURIComponent(p.name || (p.category && p.category.name) || 'food')}&sig=${p.id || idx}`}
                    onError={(e) => { e.target.src = `https://source.unsplash.com/600x600/?food&sig=${p.id||idx}`; }}
                  />
                </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <p className="product-meta">{p.description}</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                  <Link className="btn outline btn-sm" to={`/product/${p.id}`}>Details</Link>
                  <Link className="btn btn-sm" to={isAuthenticated ? '/subscribe/category' : '/login'}>Subscribe</Link>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      try {
                        const raw = localStorage.getItem('cart');
                        const cart = raw ? JSON.parse(raw) : [];
                        const existing = cart.find(i => i.id === p.id);
                        if (existing) existing.qty = (existing.qty || 1) + 1;
                        else cart.push({ id: p.id, name: p.name, price: Number(p.price) || 0, image: p.image || null, qty: 1 });
                        localStorage.setItem('cart', JSON.stringify(cart));
                        window.dispatchEvent(new Event('storage'));
                        window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: `Added ${p.name} to cart` } }));
                      } catch (e) { /* noop */ }
                    }}
                  >Add to cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
