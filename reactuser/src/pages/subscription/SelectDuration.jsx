import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Repeat, Clock, ArrowRight, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import ProgressStepper from '../../components/ProgressStepper';
import api from '../../services/api';
import { formatINR } from '../../utils/currency';

const SelectDuration = () => {
  const [duration, setDuration] = useState(1);
  const [frequency, setFrequency] = useState('weekly');
  const [perDeliveryTotal, setPerDeliveryTotal] = useState(0);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [supportsDaily, setSupportsDaily] = useState(false);
  const navigate = useNavigate();

  const durationOptions = [
    { value: 1, label: '1 Month', popular: false },
    { value: 3, label: '3 Months', popular: true, discount: '5% savings' },
    { value: 6, label: '6 Months', popular: false, discount: '10% savings' },
    { value: 12, label: '12 Months', popular: false, discount: '15% savings' },
  ];

  const frequencyOptions = [
    { value: 'once', label: 'One-time', icon: Clock, description: 'Single delivery' },
    { value: 'weekly', label: 'Weekly', icon: Calendar, description: 'Every week' },
    { value: 'daily', label: 'Daily', icon: Zap, description: 'Fresh every day', requiresDaily: true },
  ];

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

  const isOneTime = frequency === 'once';

  const recurrenceMultiplier = useMemo(() => {
    if (frequency === 'once') return 1;
    if (frequency === 'daily') return Number(duration) * 30;
    return Number(duration) * 4;
  }, [duration, frequency]);

  const estimatedTotal = useMemo(
    () => perDeliveryTotal * recurrenceMultiplier,
    [perDeliveryTotal, recurrenceMultiplier],
  );

  useEffect(() => {
    const d = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    setDuration(Number(d.duration) || 1);
    setFrequency(d.frequency || 'weekly');

    const loadPricing = async () => {
      setPricingLoading(true);
      let dailyEligible = false;

      try {
        if (Array.isArray(d.cartItems) && d.cartItems.length > 0) {
          const rawCart = localStorage.getItem('cart');
          const cart = rawCart ? JSON.parse(rawCart) : [];
          const cartById = new Map(cart.map((item) => [Number(item.id), item]));

          let sum = 0;
          for (const item of d.cartItems) {
            const cartItem = cartById.get(Number(item.product));
            const unitPrice = Number(cartItem?.price) || 0;
            const qty = Number(item.quantity) || 1;
            sum += unitPrice * qty;

            const name = String(cartItem?.name || '').toLowerCase();
            if (name.includes('milk')) dailyEligible = true;
          }

          setPerDeliveryTotal(sum);
          setSupportsDaily(dailyEligible);
          return;
        }

        if (d.product) {
          const res = await api.get(`/product/product/${d.product}/`);
          const unitPrice = Number(res.data?.price) || 0;
          const qty = Number(d.quantity) || 1;
          setPerDeliveryTotal(unitPrice * qty);

          const productName = String(res.data?.name || '').toLowerCase();
          const categoryName = String(res.data?.category_name || '').toLowerCase();
          dailyEligible = productName.includes('milk') || categoryName.includes('milk');
          setSupportsDaily(dailyEligible);
          return;
        }

        setPerDeliveryTotal(0);
        setSupportsDaily(false);
      } catch {
        setPerDeliveryTotal(0);
        setSupportsDaily(false);
      } finally {
        setPricingLoading(false);
      }
    };

    loadPricing();
  }, []);

  useEffect(() => {
    if (!supportsDaily && frequency === 'daily') {
      setFrequency('weekly');
    }
  }, [supportsDaily, frequency]);

  const next = () => {
    const currentDraft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    const finalDuration = isOneTime ? 1 : Number(duration);

    sessionStorage.setItem('subDraft', JSON.stringify({
      ...currentDraft,
      duration: finalDuration,
      frequency,
      per_delivery_total: Number(perDeliveryTotal.toFixed(2)),
      estimated_total: Number(estimatedTotal.toFixed(2)),
    }));

    navigate('/subscribe/slot');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="page-container"
    >
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <ProgressStepper currentStep={4} steps={steps} orientation="horizontal" />
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <span className="overline">STEP 4</span>
          <h2 className="title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>
            Subscription Preferences
          </h2>
          <p className="subtitle">Choose how often you'd like your fresh dairy delivered</p>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
          {/* Frequency Selection */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label className="label" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              marginBottom: 'var(--space-4)',
              fontWeight: 600
            }}>
              <Repeat size={18} />
              Delivery Frequency
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 'var(--space-3)'
            }}>
              {frequencyOptions.map(opt => {
                const isDisabled = opt.requiresDaily && !supportsDaily;
                const isSelected = frequency === opt.value;
                const Icon = opt.icon;
                
                return (
                  <motion.button
                    key={opt.value}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    onClick={() => !isDisabled && setFrequency(opt.value)}
                    disabled={isDisabled}
                    style={{
                      position: 'relative',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected 
                        ? '2px solid var(--color-brand-500)' 
                        : '1px solid var(--color-border)',
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(27, 67, 50, 0.06), rgba(201, 162, 39, 0.04))' 
                        : 'var(--color-surface)',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.5 : 1,
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          background: 'var(--color-brand-500)',
                          borderRadius: '50%',
                          padding: 2
                        }}
                      >
                        <CheckCircle2 size={16} color="white" />
                      </motion.div>
                    )}
                    <Icon size={24} color={isSelected ? 'var(--color-brand-500)' : 'var(--color-text-muted)'} style={{ marginBottom: 8 }} />
                    <div style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: isSelected ? 'var(--color-brand-500)' : 'var(--color-text)'
                    }}>
                      {opt.label}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      marginTop: 4
                    }}>
                      {opt.description}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Duration Selection */}
          <div style={{ marginBottom: 'var(--space-6)', opacity: isOneTime ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
            <label className="label" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              marginBottom: 'var(--space-4)',
              fontWeight: 600
            }}>
              <Calendar size={18} />
              Subscription Length
              {isOneTime && <span style={{ fontWeight: 400, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>(N/A for one-time)</span>}
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 'var(--space-3)'
            }}>
              {durationOptions.map(opt => {
                const isSelected = duration === opt.value && !isOneTime;
                
                return (
                  <motion.button
                    key={opt.value}
                    whileHover={!isOneTime ? { scale: 1.02 } : {}}
                    whileTap={!isOneTime ? { scale: 0.98 } : {}}
                    onClick={() => !isOneTime && setDuration(opt.value)}
                    disabled={isOneTime}
                    style={{
                      position: 'relative',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected 
                        ? '2px solid var(--color-brand-500)' 
                        : '1px solid var(--color-border)',
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(27, 67, 50, 0.06), rgba(201, 162, 39, 0.04))' 
                        : 'var(--color-surface)',
                      cursor: isOneTime ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {opt.popular && !isOneTime && (
                      <div style={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--color-accent-gold)',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '2px 10px',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Popular
                      </div>
                    )}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          background: 'var(--color-brand-500)',
                          borderRadius: '50%',
                          padding: 2
                        }}
                      >
                        <CheckCircle2 size={16} color="white" />
                      </motion.div>
                    )}
                    <div style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      color: isSelected ? 'var(--color-brand-500)' : 'var(--color-text)',
                      marginBottom: 4
                    }}>
                      {opt.label}
                    </div>
                    {opt.discount && (
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#059669',
                        fontWeight: 500
                      }}>
                        {opt.discount}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Pricing Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, rgba(27, 67, 50, 0.06), rgba(201, 162, 39, 0.08))',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              marginBottom: 'var(--space-6)',
              textAlign: 'center'
            }}
          >
            <div style={{ 
              fontSize: '0.8rem', 
              color: 'var(--color-text-muted)', 
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Estimated Total
            </div>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--color-brand-500)',
              marginBottom: 8
            }}>
              {pricingLoading ? 'Calculating...' : formatINR(estimatedTotal)}
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              color: 'var(--color-text-muted)' 
            }}>
              {pricingLoading
                ? 'Loading product pricing...'
                : `${formatINR(perDeliveryTotal)} × ${recurrenceMultiplier} deliver${recurrenceMultiplier > 1 ? 'ies' : 'y'}`}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-accent" onClick={next}>
              Continue
              <ArrowRight size={18} />
            </button>
            <Link className="btn outline" to="/subscribe/quantity">
              <ArrowLeft size={18} />
              Back
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SelectDuration;
