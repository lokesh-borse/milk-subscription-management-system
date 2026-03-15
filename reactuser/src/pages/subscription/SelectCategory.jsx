import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Milk, Leaf } from 'lucide-react';
import api from '../../services/api';
import ProgressStepper from '../../components/ProgressStepper';

const SelectCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    const load = async () => {
      setLoading(true);
      setError(null);   
      try {
        const res = await api.get('/api/categories/');
        setCategories(res.data || []);
      } catch (e) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const choose = (cat) => {
    setSelectedCategory(cat.id);
    sessionStorage.setItem('subDraft', JSON.stringify({ category: cat.id }));
    setTimeout(() => navigate('/subscribe/product'), 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="page-container"
    >
      <div className="container" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <ProgressStepper currentStep={1} steps={steps} orientation="horizontal" />
        
        <div className="subscription-page">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
            <p className="overline">Step 1 of 8</p>
            <h2 className="title">Choose a Category</h2>
            <p className="subtitle">Select the type of dairy products you'd like to subscribe to</p>
          </div>

          {loading ? (
            <motion.div 
              className="grid cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-xl)' }}></div>
              ))}
            </motion.div>
          ) : error ? (
            <div className="card card-body" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <p style={{ color: 'var(--color-danger)' }}>{error}</p>
              <button className="btn" style={{ marginTop: 'var(--space-4)' }} onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <Milk size={64} strokeWidth={1.5} style={{ opacity: 0.4, marginBottom: 'var(--space-4)' }} />
              <h4 className="empty-state-title">No Categories Available</h4>
              <p className="empty-state-text">Please check back later for our product categories.</p>
            </div>
          ) : (
            <motion.div 
              className="grid cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ gap: 'var(--space-5)' }}
            >
              {categories.map((c) => (
                <motion.div 
                  key={c.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className={`category-selection-card ${selectedCategory === c.id ? 'selected' : ''}`}
                  onClick={() => choose(c)}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedCategory === c.id ? '2px solid var(--color-brand-500)' : '2px solid var(--color-border)',
                    boxShadow: selectedCategory === c.id ? '0 0 0 4px rgba(27, 67, 50, 0.1), var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all 300ms var(--ease-standard)'
                  }}
                >
                  {c.image ? (
                    <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                      <img
                        src={c.image}
                        alt={c.name}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 400ms var(--ease-standard)'
                        }}
                        loading="lazy"
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(27, 67, 50, 0.6), transparent 60%)'
                      }} />
                    </div>
                  ) : (
                    <div style={{ 
                      height: 160, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--color-surface-alt), var(--color-bg))'
                    }}>
                      <Leaf size={48} strokeWidth={1.5} style={{ color: 'var(--color-brand-500)', opacity: 0.5 }} />
                    </div>
                  )}
                  <div style={{ padding: 'var(--space-5)' }}>
                    <h3 style={{ 
                      fontFamily: 'Playfair Display, serif', 
                      fontSize: '1.25rem', 
                      marginBottom: 8,
                      color: 'var(--color-text)'
                    }}>
                      {c.name}
                    </h3>
                    <p style={{ 
                      color: 'var(--color-text-muted)', 
                      fontSize: '0.9rem', 
                      lineHeight: 1.5,
                      marginBottom: 'var(--space-4)'
                    }}>
                      {c.description || 'Fresh dairy products from local farms'}
                    </p>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--color-brand-500)',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      Select Category →
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SelectCategory;
