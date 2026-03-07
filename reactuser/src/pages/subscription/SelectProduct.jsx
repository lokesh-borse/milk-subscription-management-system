import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle2 } from 'lucide-react';
import api, { API_BASE_URL } from '../../services/api';
import ProgressStepper from '../../components/ProgressStepper';
import { formatINR } from '../../utils/currency';

const SelectProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
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

  const fallbackImage = 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=900';

  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    if (imageUrl.startsWith('//')) return `${window.location.protocol}${imageUrl}`;
    return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  useEffect(() => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/product/product/', { params: draft.category ? { category: draft.category } : {} });
        setProducts(res.data || []);
      } catch (e) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const choose = (p) => {
    setSelectedId(p.id);
    setTimeout(() => {
      const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
      sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, product: p.id }));
      navigate('/subscribe/quantity');
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="page-container"
    >
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <ProgressStepper currentStep={2} steps={steps} orientation="horizontal" />
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <span className="overline">STEP 2</span>
          <h2 className="title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 8 }}>
            Choose Your Product
          </h2>
          <p className="subtitle">Select from our fresh farm-sourced dairy products</p>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-5)'
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 320, borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ textAlign: 'center', padding: 'var(--space-8)' }}
          >
            <Package size={48} color="var(--color-text-muted)" style={{ marginBottom: 16 }} />
            <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ textAlign: 'center', padding: 'var(--space-8)' }}
          >
            <Package size={48} color="var(--color-text-muted)" style={{ marginBottom: 16 }} />
            <p style={{ color: 'var(--color-text-muted)' }}>No products available in this category.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-5)'
            }}
          >
            <AnimatePresence>
              {products.map(p => (
                <motion.div
                  key={p.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => choose(p)}
                  className={`product-select-card ${selectedId === p.id ? 'selected' : ''}`}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--color-surface)',
                    border: selectedId === p.id 
                      ? '2px solid var(--color-brand-500)' 
                      : '1px solid var(--color-border)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Selection Badge */}
                  {selectedId === p.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 10,
                        background: 'var(--color-brand-500)',
                        borderRadius: '50%',
                        padding: 4,
                        boxShadow: '0 2px 8px rgba(27, 67, 50, 0.3)'
                      }}
                    >
                      <CheckCircle2 size={20} color="white" />
                    </motion.div>
                  )}

                  {/* Image */}
                  <div style={{
                    height: 160,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
                  }}>
                    <img
                      src={resolveImageUrl(p.image) || `${fallbackImage}&sig=${p.id}`}
                      alt={p.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `${fallbackImage}&sig=${p.id}`;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: 'var(--space-4)' }}>
                    <h4 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      marginBottom: 6,
                      color: 'var(--color-text)'
                    }}>
                      {p.name}
                    </h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: 12,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 40
                    }}>
                      {p.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-brand-500)'
                      }}>
                        {formatINR(p.price)}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        per unit
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <style>{`
        .product-select-card:hover img {
          transform: scale(1.08);
        }
        .product-select-card.selected {
          box-shadow: 0 0 0 2px var(--color-brand-500), var(--shadow-md);
        }
      `}</style>
    </motion.div>
  );
};

export default SelectProduct;
