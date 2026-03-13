import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Calendar, Settings, ArrowRight } from 'lucide-react';
import ProgressStepper from '../../components/ProgressStepper';

const Success = () => {
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
    try {
      const rawIds = sessionStorage.getItem('purchasedProductIds');
      const purchasedIds = rawIds ? JSON.parse(rawIds) : [];
      if (!Array.isArray(purchasedIds) || purchasedIds.length === 0) return;

      const rawCart = localStorage.getItem('cart');
      const cart = rawCart ? JSON.parse(rawCart) : [];
      const purchasedSet = new Set(purchasedIds.map((id) => Number(id)));
      const remaining = cart.filter((item) => !purchasedSet.has(Number(item.id)));

      localStorage.setItem('cart', JSON.stringify(remaining));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('cart-updated'));
      sessionStorage.removeItem('purchasedProductIds');
    } catch {
      // no-op
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="page-container"
    >
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <ProgressStepper currentStep={8} steps={steps} orientation="horizontal" />
        
        <motion.div 
          className="glass-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ 
            padding: 'var(--space-10) var(--space-6)', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.9))'
          }}
        >
          {/* Success Icon with Glow Animation */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
            style={{ 
              display: 'inline-flex', 
              marginBottom: 'var(--space-6)',
              position: 'relative'
            }}
          >
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(5, 150, 105, 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(5, 150, 105, 0.2), 0 0 80px rgba(5, 150, 105, 0.1)'
            }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: 'easeInOut'
                }}
              >
                <CheckCircle2 size={64} color="#059669" strokeWidth={1.5} />
              </motion.div>
            </div>
            
            {/* Sparkle decorations */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              style={{ position: 'absolute', top: -10, right: -10 }}
            >
              <Sparkles size={24} color="var(--color-accent-gold)" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: 12 }}>
              Subscription Confirmed!
            </h2>
            <p className="subtitle" style={{ 
              maxWidth: 500, 
              margin: '0 auto var(--space-6)',
              fontSize: '1.05rem'
            }}>
              Welcome to the Milkman family! Your premium dairy subscription is now active. Fresh deliveries are on their way.
            </p>
          </motion.div>

          {/* What's Next Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ 
              background: 'linear-gradient(135deg, rgba(27, 67, 50, 0.04), rgba(201, 162, 39, 0.06))',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-6)',
              maxWidth: 480,
              margin: '0 auto var(--space-6)'
            }}
          >
            <h4 style={{ 
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.1rem',
              marginBottom: 'var(--space-4)',
              color: 'var(--color-brand-500)'
            }}>
              What happens next?
            </h4>
            <div style={{ display: 'grid', gap: 'var(--space-3)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <Calendar size={18} color="var(--color-brand-500)" />
                </div>
                <span style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>
                  Track your upcoming deliveries from the dashboard
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <Settings size={18} color="var(--color-brand-500)" />
                </div>
                <span style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>
                  Manage your subscription anytime - pause, resume.
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="actions"
            style={{ justifyContent: 'center' }}
          >
            <Link className="btn btn-accent" to="/dashboard">
              Go to Dashboard
              <ArrowRight size={18} />
            </Link>
            <Link className="btn outline" to="/">
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Success;
