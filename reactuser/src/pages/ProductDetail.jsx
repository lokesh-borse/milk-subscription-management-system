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
            src="https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=1000&auto=format&fit=crop" 
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;