import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Confirm = () => {
  const [draft, setDraft] = useState({});
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const d = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    setDraft(d);
    if (d.product) {
      api.get(`/product/product/${d.product}/`).then(res => setProduct(res.data)).catch(() => {});
    }
  }, []);

  const confirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        customer: user.id,
        product: draft.product,
        quantity: draft.quantity || 1,
        duration: draft.duration || 1,
        delivery_slot: draft.delivery_slot || 'morning',
        address: draft.address || '',
        status: 'active',
      };
      const res = await api.post('/subscription/subscription/', payload);
      if (res.status !== 201 && res.status !== 200) throw new Error('Subscription failed');
      sessionStorage.removeItem('subDraft');
      navigate('/subscribe/success');
    } catch {
      // show error to the user if available
      setError('Failed to create subscription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!draft) return null;

  return (
    <div className="card card-body">
      {error && <div className="card card-body" style={{ marginBottom: 12, borderColor: '#f8d7da', background: '#fff0f0' }}>{error}</div>}
      <div className="product-name" style={{ marginBottom: 8 }}>Confirm Subscription</div>
      <div className="grid cols-3" style={{ marginBottom: 12 }}>
        <div className="card card-body">
          <div className="muted">Product</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={product?.image || `https://source.unsplash.com/128x128/?${encodeURIComponent(product?.name||'milk')}`} alt={product?.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
            <strong>{product?.name || draft.product}</strong>
          </div>
        </div>
        <div className="card card-body"><div className="muted">Quantity</div><strong>{draft.quantity}</strong></div>
        <div className="card card-body"><div className="muted">Duration</div><strong>{draft.duration} months</strong></div>
        <div className="card card-body"><div className="muted">Delivery Slot</div><strong>{draft.delivery_slot}</strong></div>
        <div className="card card-body" style={{ gridColumn:'span 2' }}><div className="muted">Address</div><strong>{draft.address}</strong></div>
      </div>
      <div className="actions">
        <button disabled={submitting} className="btn" onClick={confirm}>Confirm Subscription</button>
        <Link className="btn outline" to="/subscribe/address">Back</Link>
      </div>
    </div>
  );
};

export default Confirm;
