import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Cloud, Sunset, Clock, CheckCircle2 } from 'lucide-react';
import ProgressStepper from '../../components/ProgressStepper';

const DeliverySlot = () => {
  const [slot, setSlot] = useState('morning');
  const navigate = useNavigate();

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

  const slotOptions = [
    { 
      id: 'morning', 
      label: 'Morning', 
      time: '6:00 - 9:00 AM', 
      icon: Sun,
      description: 'Fresh start with early delivery',
      recommended: true
    },
    { 
      id: 'noon', 
      label: 'Afternoon', 
      time: '12:00 - 2:00 PM', 
      icon: Cloud,
      description: 'Midday delivery convenience'
    },
    { 
      id: 'evening', 
      label: 'Evening', 
      time: '5:00 - 8:00 PM', 
      icon: Sunset,
      description: 'End of day delivery'
    }
  ];

  const next = () => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, delivery_slot: slot }));
    navigate('/subscribe/address');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="page-container"
    >
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <ProgressStepper currentStep={5} steps={steps} orientation="horizontal" />
        
        <div className="subscription-page">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-7)', paddingBottom: 'var(--space-5)', borderBottom: '2px solid var(--color-border-light)' }}>
            <p className="overline">Step 5 of 8</p>
            <h2 className="title">Choose Delivery Slot</h2>
            <p className="subtitle">When would you like your fresh dairy delivered?</p>
          </div>

          <div className="subscription-content" style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {slotOptions.map((option, index) => {
                const Icon = option.icon;
                const isSelected = slot === option.id;
                
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSlot(option.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-5)',
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(27, 67, 50, 0.04), rgba(201, 162, 39, 0.06))' 
                        : 'var(--color-surface)',
                      border: isSelected 
                        ? '2px solid var(--color-brand-500)' 
                        : '2px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      cursor: 'pointer',
                      transition: 'all 280ms var(--ease-standard)',
                      boxShadow: isSelected 
                        ? '0 0 0 4px rgba(27, 67, 50, 0.1), var(--shadow-md)' 
                        : 'var(--shadow-xs)',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: 'var(--radius-lg)',
                      background: isSelected 
                        ? 'var(--color-brand-500)' 
                        : 'var(--color-surface-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 280ms var(--ease-standard)'
                    }}>
                      <Icon 
                        size={28} 
                        strokeWidth={1.5}
                        style={{ color: isSelected ? 'white' : 'var(--color-brand-500)' }} 
                      />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h4 style={{ 
                          fontFamily: 'Playfair Display, serif', 
                          fontSize: '1.15rem',
                          color: 'var(--color-text)'
                        }}>
                          {option.label}
                        </h4>
                        {option.recommended && (
                          <span style={{
                            background: 'var(--color-accent-gold)',
                            color: '#1B1B1B',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Recommended
                          </span>
                        )}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 6,
                        color: 'var(--color-text-muted)',
                        fontSize: '0.95rem',
                        marginBottom: 4
                      }}>
                        <Clock size={14} />
                        {option.time}
                      </div>
                      <p style={{ 
                        color: 'var(--color-text-muted)', 
                        fontSize: '0.85rem' 
                      }}>
                        {option.description}
                      </p>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <CheckCircle2 
                          size={24} 
                          style={{ color: 'var(--color-success)' }}
                          strokeWidth={2}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="subscription-actions" style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
              <button className="btn" onClick={next}>
                Continue to Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliverySlot;
