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
        <div className="grid cols-4">
          {products.map(p => (
            <div className="product-card" key={p.id}>
              <div className="product-name">{p.name}</div>
              <p className="product-desc">{p.description}</p>
              <div className="actions">
                <Link className="btn outline" to={`/product/${p.id}`}>Details</Link>
                <Link className="btn" to={isAuthenticated ? '/subscribe/category' : '/login'}>Subscribe</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
