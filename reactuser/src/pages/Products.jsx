import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';

const useQuery = () => new URLSearchParams(useLocation().search);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const q = useQuery();
  const category = q.get('category');
  const search = q.get('search');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      console.debug('[Products] Fetching...', { category, search });
      try {
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;
        const res = await api.get('/api/products/product/', { params });
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
  }, [category, search]);

  const handleAddToCart = (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find(i => i.id === productId);
      if (existing) existing.qty = (existing.qty || 1) + 1;
      else cart.push({ 
        id: product.id, 
        name: product.name, 
        price: Number(product.price) || 0, 
        image: product.image || null, 
        qty: 1 
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', message: `Added ${product.name} to cart` } }));
    } catch (e) { 
      console.error('Error adding to cart:', e);
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: 'Failed to add to cart' } }));
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header text-center">
          <h4 className="overline">{search ? 'Search Results' : 'Our Full Collection'}</h4>
          <h1 className="title">{search ? `Results for "${search}"` : 'Estate-Sourced Dairy'}</h1>
          <p className="subtitle" style={{ margin: '0 auto 60px' }}>
            {search 
              ? (loading ? 'Searching...' : `Found ${products.length} product${products.length !== 1 ? 's' : ''} matching your search.`)
              : 'Explore our range of fresh, organic, and artisan dairy products delivered daily from the pasture to your home.'
            }
          </p>
          {search && (
            <button 
              onClick={() => navigate('/products')} 
              className="btn btn-outline"
              style={{ marginBottom: '20px' }}
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid cols-4 gap-md">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} height="350px" borderRadius="16px" />
            ))}
          </div>
        ) : error ? (
          <div className="card card-body text-center">{error}</div>
        ) : products.length === 0 ? (
          <div className="card card-body text-center">No products available at the moment.</div>
        ) : (
          <div className="grid cols-4 gap-md">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={Number(p.price) || 0}
                image={p.image || p.image_url || `https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600&sig=${p.id}`}
                category={p.category_name || p.category || 'Dairy'}
                rating={4.5}
                reviewCount={0}
                badge={p.is_popular ? 'Popular' : p.is_new ? 'New' : null}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
