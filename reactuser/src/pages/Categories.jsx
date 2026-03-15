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
      try {
        const res = await api.get('/api/categories/');
        if (!mounted) return;
        setCategories(res.data || []);
      } catch (e) {
        if (!mounted) return;
        setError('Failed to load categories');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header text-center">
          <h4 className="overline">Collections</h4>
          <h2 className="title">Browse by Category</h2>
          <p className="subtitle" style={{ margin: '12px auto 0', maxWidth: 740 }}>
            Find products by type and start your recurring delivery plan in a few steps.
          </p>
        </div>

        {loading ? (
          <div className="grid cols-4">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 184 }}></div>)}
          </div>
        ) : error ? (
          <div className="card card-body">{error}</div>
        ) : categories.length === 0 ? (
          <div className="card card-body">No categories found.</div>
        ) : (
          <div className="grid cols-4">
            {categories.map((cat) => (
              <article className="card card-body" key={cat.id}>
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }}
                    loading="lazy"
                  />
                ) : null}
                <div className="product-name">{cat.name}</div>
                <p className="product-desc" style={{ margin: '8px 0 18px' }}>{cat.description || 'Fresh curated category'}</p>
                <Link className="btn btn-sm outline" to={`/products?category=${cat.id}`}>View Products</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
