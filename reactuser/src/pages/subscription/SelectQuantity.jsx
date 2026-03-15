import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressStepper from '../../components/ProgressStepper';
import api from '../../services/api';
import { formatINR } from '../../utils/currency';

const SelectQuantity = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    if (draft.product) {
      api.get(`/api/products/product/${draft.product}/`)
        .then(res => {
          setProduct(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const unitPrice = Number(product?.price) || 0;
  const livePrice = unitPrice * quantity;

  const increment = () => setQuantity(q => Math.min(q + 1, 20));
  const decrement = () => setQuantity(q => Math.max(q - 1, 1));

  const next = () => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, quantity: Number(quantity) }));
    navigate('/subscribe/duration');
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
        <ProgressStepper currentStep={3} steps={steps} orientation="horizontal" />
        
        <div className="quantity-stage">
          <div className="quantity-header">
            <h2 className="title">Select Quantity</h2>
            <p className="subtitle">Choose how many units you'd like delivered each day</p>
          </div>

          <div className="quantity-card">
            {loading ? (
              <div className="quantity-loading">
                <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 16 }}></div>
                <div className="skeleton" style={{ width: 200, height: 24, marginTop: 16 }}></div>
              </div>
            ) : product ? (
              <>
                <div className="product-preview">
                  <img 
                    src={product.image || `https://source.unsplash.com/120x120/?milk,dairy&sig=${product.id}`}
                    alt={product.name}
                    className="product-preview-image"
                  />
                  <div className="product-preview-info">
                    <h3>{product.name}</h3>
                    <p className="unit-price">{formatINR(unitPrice)} per unit</p>
                  </div>
                </div>

                <div className="quantity-selector">
                  <button 
                    className="qty-btn" 
                    onClick={decrement}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={24} strokeWidth={2.5} />
                  </button>
                  
                  <motion.div 
                    className="qty-display"
                    key={quantity}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <span className="qty-number">{quantity}</span>
                    <span className="qty-label">units/day</span>
                  </motion.div>
                  
                  <button 
                    className="qty-btn" 
                    onClick={increment}
                    disabled={quantity >= 20}
                    aria-label="Increase quantity"
                  >
                    <Plus size={24} strokeWidth={2.5} />
                  </button>
                </div>

                <motion.div 
                  className="live-price-preview"
                  key={livePrice}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="price-label">Daily Total</div>
                  <div className="price-value">{formatINR(livePrice)}</div>
                  <div className="price-breakdown">
                    {quantity} × {formatINR(unitPrice)}
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="no-product">
                <Package size={48} strokeWidth={1.5} />
                <p>No product selected. Please go back and select a product.</p>
              </div>
            )}
          </div>

          <div className="quantity-actions">
            <button className="btn" onClick={next} disabled={!product || quantity < 1}>
              Continue to Duration
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SelectQuantity;
