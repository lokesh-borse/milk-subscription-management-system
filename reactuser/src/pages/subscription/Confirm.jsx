import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Confirm = () => {
  const [draft, setDraft] = useState({});
  const [product, setProduct] = useState(null);
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
      await api.post('/subscription/subscription/', payload);
      sessionStorage.removeItem('subDraft');
      navigate('/subscribe/success');
    } catch {
      // no-op for now
    } finally {
      setSubmitting(false);
    }
  };

  if (!draft) return null;

  return (
    <div className="card card-body">
      <div className="product-name" style={{ marginBottom: 8 }}>Confirm Subscription</div>
      <div className="grid cols-3" style={{ marginBottom: 12 }}>
        <div className="card card-body"><div className="muted">Product</div><strong>{product?.name || draft.product}</strong></div>
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
