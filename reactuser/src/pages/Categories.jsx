import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      console.debug('[Categories] Fetching...');
      try {
        const res = await api.get('/category/category/');
        if (!mounted) return;
        setCategories(res.data || []);
        console.debug('[Categories] Loaded', res.data?.length);
      } catch (e) {
        if (!mounted) return;
        console.debug('[Categories] Error', e);
        setError('Failed to load categories');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2 className="title">Categories</h2>
      {loading ? (
        <div className="grid cols-4">
          {[...Array(8)].map((_,i) => <div key={i} className="skeleton"></div>)}
        </div>
      ) : error ? (
        <div className="card card-body">{error}</div>
      ) : categories.length === 0 ? (
        <div className="card card-body">No categories found.</div>
      ) : (
        <div className="grid cols-4">
          {categories.map(cat => (
            <div className="card card-body" key={cat.id}>
              <div className="product-name">{cat.name}</div>
              <div className="product-desc">{cat.description}</div>
              <Link className="btn outline" to={`/products?category=${cat.id}`}>View Products</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
