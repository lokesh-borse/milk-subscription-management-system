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
    <div className="section">
      <div className="container">
        <div className="section-header text-center">
          <h4 className="overline">Our Full Collection</h4>
          <h1 className="title">Estate-Sourced Dairy</h1>
          <p className="subtitle" style={{ margin: '0 auto 60px' }}>Explore our range of fresh, organic, and artisan dairy products delivered daily from the pasture to your home.</p>
        </div>

        {loading ? (
          <div className="grid cols-4 gap-md">
            {[...Array(8)].map((_,i) => <div key={i} className="skeleton" style={{ height: 350, borderRadius: 16 }}></div>)}
          </div>
        ) : error ? (
          <div className="card card-body text-center">{error}</div>
        ) : products.length === 0 ? (
          <div className="card card-body text-center">No products available at the moment.</div>
        ) : (
          <div className="grid cols-4 gap-md">
            {products.map((p, idx) => (
              <div className="product-card" key={p.id}>
                <Link to={`/product/${p.id}`} className="product-img-wrapper">
                  <img
                    alt={p.name}
                    className="product-img"
                    loading="lazy"
                    src={p.image || p.image_url || `https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600&sig=${p.id || idx}`}
                    onError={(e) => { e.target.src = `https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600`; }}
                  />
                </Link>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-meta" style={{ fontSize: '0.85rem', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.8em' }}>{p.description}</p>

                  <div className="product-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                    <span className="price" style={{ fontSize: '1.25rem' }}>${p.price}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-sm"
                        style={{ padding: '8px 16px' }}
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
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.1-5.38H5.83"></path></svg>
                      </button>
                      <Link className="btn btn-sm btn-accent" style={{ padding: '8px 16px' }} to={isAuthenticated ? '/subscribe/category' : '/login'}>
                        Subscribe
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
