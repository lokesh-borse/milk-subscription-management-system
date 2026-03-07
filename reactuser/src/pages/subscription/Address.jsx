import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Home, CheckCircle2, Plus, Navigation } from 'lucide-react';
import ProgressStepper from '../../components/ProgressStepper';
import { useAuth } from '../../context/AuthContext';

const Address = () => {
  const { user } = useAuth();
  const registeredAddress = (user?.address || '').trim();
  const [useRegisteredAddress, setUseRegisteredAddress] = useState(Boolean(registeredAddress));
  const [customAddress, setCustomAddress] = useState('');
  const [error, setError] = useState(null);
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

  const selectedAddress = useMemo(() => {
    if (useRegisteredAddress) return registeredAddress;
    return customAddress.trim();
  }, [useRegisteredAddress, registeredAddress, customAddress]);

  useEffect(() => {
    if (registeredAddress && !customAddress.trim()) {
      setUseRegisteredAddress(true);
    }
  }, [registeredAddress, customAddress]);

  const next = () => {
    if (!selectedAddress) {
      setError('Please choose a delivery address to continue.');
      return;
    }

    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, address: selectedAddress }));
    navigate('/subscribe/confirm');
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
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
        <ProgressStepper currentStep={6} steps={steps} orientation="horizontal" />
        
        <div className="address-stage">
          <div className="address-header">
            <h2 className="title">Delivery Address</h2>
            <p className="subtitle">Where should we deliver your fresh dairy?</p>
          </div>

          <div className="address-cards-container">
            {/* Registered Address Card */}
            {registeredAddress && (
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 }}
                className={`address-card ${useRegisteredAddress ? 'selected' : ''}`}
                onClick={() => {
                  setUseRegisteredAddress(true);
                  setError(null);
                }}
              >
                <div className="address-card-header">
                  <div className="address-card-title">
                    <Home size={20} />
                    <span>Saved Address</span>
                  </div>
                  {useRegisteredAddress && (
                    <span className="address-card-badge">
                      <CheckCircle2 size={14} />
                      Selected
                    </span>
                  )}
                </div>
                <div className="address-card-content">
                  <MapPin size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', opacity: 0.6 }} />
                  {registeredAddress}
                </div>
                {useRegisteredAddress && (
                  <motion.div 
                    className="address-card-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="deliver-here-btn">
                      <Navigation size={16} />
                      Deliver Here
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* No Saved Address Notice */}
            {!registeredAddress && (
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                className="address-card"
                style={{ background: 'var(--color-surface-alt)', borderStyle: 'dashed' }}
              >
                <div className="address-card-content" style={{ textAlign: 'center', padding: 'var(--space-5)' }}>
                  <Home size={32} style={{ opacity: 0.4, marginBottom: 12 }} />
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    No saved address found in your profile. Please enter a delivery address below.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Custom Address Card */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className={`address-card custom-address-card ${!useRegisteredAddress ? 'selected' : ''}`}
              onClick={() => {
                setUseRegisteredAddress(false);
                setError(null);
              }}
            >
              <div className="address-card-header">
                <div className="address-card-title">
                  <Plus size={20} />
                  <span>Use Different Address</span>
                </div>
                {!useRegisteredAddress && (
                  <span className="address-card-badge">
                    <CheckCircle2 size={14} />
                    Selected
                  </span>
                )}
              </div>
              
              {!useRegisteredAddress && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <textarea
                    className="textarea"
                    placeholder="Enter complete address: House/Flat, Street, Landmark, City, PIN Code"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    rows={4}
                    maxLength={300}
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginTop: 'var(--space-3)' }}
                  />
                </motion.div>
              )}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: 'var(--space-4)',
                  background: 'rgba(220, 38, 38, 0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--color-danger)',
                  textAlign: 'center',
                  fontSize: '0.95rem'
                }}
              >
                {error}
              </motion.div>
            )}
          </div>

          <div className="subscription-actions">
            <button className="btn" onClick={next}>
              Continue to Confirmation
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Address;
