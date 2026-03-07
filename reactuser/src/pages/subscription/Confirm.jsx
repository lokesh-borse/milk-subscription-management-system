import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Calendar, Clock, MapPin, Repeat, CreditCard, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProgressStepper from '../../components/ProgressStepper';
import { formatINR } from '../../utils/currency';

const Confirm = () => {
  const [draft, setDraft] = useState({});
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = [
    { id: 1, label: 'Category' },
    { id: 2, label: 'Product' },
    { id: 3, label: 'Quantity' },
    { id: 4, label: 'Duration' },
    { id: 5, label: 'Delivery Slot' },
    { id: 6, label: 'Address' },
    { id: 7, label: 'Confirm' },
    { id: 8, label: 'Success' },
  ];

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
      const effectiveDuration = draft.frequency === 'once' ? 1 : (draft.duration || 1);
      const selectedItems = Array.isArray(draft.cartItems) && draft.cartItems.length > 0
        ? draft.cartItems
        : [{ product: draft.product, quantity: draft.quantity || 1 }];

      const payloads = selectedItems.map((item) => ({
        customer: user.id,
        product: item.product,
        quantity: item.quantity || 1,
        duration: effectiveDuration,
        frequency: draft.frequency || 'weekly',
        delivery_slot: draft.delivery_slot || 'morning',
        address: draft.address || '',
        status: 'active',
      }));

      const responses = await Promise.all(payloads.map((p) => api.post('/subscription/subscription/', p)));
      const hasFailure = responses.some((res) => res.status !== 201 && res.status !== 200);
      if (hasFailure) throw new Error('Subscription failed');

      const purchasedProductIds = selectedItems.map((item) => Number(item.product));
      sessionStorage.setItem('purchasedProductIds', JSON.stringify(purchasedProductIds));

      sessionStorage.removeItem('subDraft');
      navigate('/subscribe/success');
    } catch {
      setError('Failed to create subscription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!draft) return null;

  const frequencyLabel = draft.frequency
    ? `${draft.frequency.charAt(0).toUpperCase()}${draft.frequency.slice(1)}`
    : 'Weekly';
  const effectiveDuration = draft.frequency === 'once' ? 1 : (draft.duration || 1);
  const computedPerDelivery = Number(draft.per_delivery_total) || (Number(product?.price || 0) * Number(draft.quantity || 1));
  const recurrenceMultiplier = draft.frequency === 'once'
    ? 1
    : draft.frequency === 'daily'
      ? Number(effectiveDuration) * 30
      : Number(effectiveDuration) * 4;
  const estimatedTotal = Number(draft.estimated_total) || (computedPerDelivery * recurrenceMultiplier);

  const slotLabels = {
    morning: 'Morning (6-9 AM)',
    afternoon: 'Afternoon (12-3 PM)',
    evening: 'Evening (5-8 PM)'
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1], staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-container"
    >
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <ProgressStepper currentStep={7} steps={steps} orientation="horizontal" />
        
        <motion.div className="glass-card" variants={itemVariants} style={{ padding: 'var(--space-6)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <span className="overline">ALMOST THERE</span>
            <h2 className="title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>
              Review Your Subscription
            </h2>
            <p className="subtitle">Please confirm the details below before proceeding</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#dc2626',
                textAlign: 'center'
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Order Summary Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)'
          }}>
            {/* Product Card */}
            <motion.div variants={itemVariants} className="confirm-detail-card" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: 'var(--color-surface-alt)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <img 
                    src={product?.image || `https://source.unsplash.com/160x160/?${encodeURIComponent(product?.name||'milk')}`} 
                    alt={product?.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div>
                  <div className="detail-label">
                    <Package size={14} style={{ marginRight: 6 }} />
                    Product
                  </div>
                  <div className="detail-value">{product?.name || draft.product}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {formatINR(product?.price || 0)} per unit
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quantity */}
            <motion.div variants={itemVariants} className="confirm-detail-card">
              <div className="detail-label">
                <Package size={14} style={{ marginRight: 6 }} />
                Quantity
              </div>
              <div className="detail-value">{draft.quantity} units/day</div>
            </motion.div>

            {/* Duration */}
            <motion.div variants={itemVariants} className="confirm-detail-card">
              <div className="detail-label">
                <Calendar size={14} style={{ marginRight: 6 }} />
                Duration
              </div>
              <div className="detail-value">
                {draft.frequency === 'once' ? 'One-time' : `${effectiveDuration} month${effectiveDuration > 1 ? 's' : ''}`}
              </div>
            </motion.div>

            {/* Frequency */}
            <motion.div variants={itemVariants} className="confirm-detail-card">
              <div className="detail-label">
                <Repeat size={14} style={{ marginRight: 6 }} />
                Frequency
              </div>
              <div className="detail-value">{frequencyLabel}</div>
            </motion.div>

            {/* Delivery Slot */}
            <motion.div variants={itemVariants} className="confirm-detail-card">
              <div className="detail-label">
                <Clock size={14} style={{ marginRight: 6 }} />
                Delivery Slot
              </div>
              <div className="detail-value">{slotLabels[draft.delivery_slot] || draft.delivery_slot}</div>
            </motion.div>

            {/* Address */}
            <motion.div variants={itemVariants} className="confirm-detail-card" style={{ gridColumn: 'span 2' }}>
              <div className="detail-label">
                <MapPin size={14} style={{ marginRight: 6 }} />
                Delivery Address
              </div>
              <div className="detail-value" style={{ fontSize: '0.95rem' }}>{draft.address}</div>
            </motion.div>
          </div>

          {/* Total Section */}
          <motion.div
            variants={itemVariants}
            style={{
              background: 'linear-gradient(135deg, rgba(27, 67, 50, 0.06), rgba(201, 162, 39, 0.08))',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-3)'
            }}
          >
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                color: 'var(--color-text-muted)',
                fontSize: '0.9rem',
                marginBottom: 4
              }}>
                <CreditCard size={16} />
                Estimated Total
              </div>
              <div style={{ 
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-brand-500)'
              }}>
                {formatINR(estimatedTotal)}
              </div>
            </div>
            <div style={{ 
              background: 'rgba(5, 150, 105, 0.1)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              color: '#059669',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <CheckCircle2 size={16} />
              Ready to Subscribe
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="actions" style={{ justifyContent: 'center' }}>
            <button 
              disabled={submitting} 
              className="btn btn-accent" 
              onClick={confirm}
              style={{ minWidth: 200 }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="spinning" />
                  Processing...
                </>
              ) : (
                'Confirm Subscription'
              )}
            </button>
            <Link className="btn outline" to="/subscribe/address">
              <ArrowLeft size={18} />
              Back
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .confirm-detail-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          transition: all 0.2s ease;
        }
        .confirm-detail-card:hover {
          border-color: var(--color-border-hover);
          box-shadow: var(--shadow-sm);
        }
        .detail-label {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          margin-bottom: 6px;
        }
        .detail-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default Confirm;
