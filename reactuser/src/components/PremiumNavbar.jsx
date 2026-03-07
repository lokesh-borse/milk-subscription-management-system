import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingBag, User, Search, X, ChevronDown, Milk, Cake, IceCream, Package, Minus, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';
import './PremiumNavbar.css';

// ============================================================================
// MAGNETIC ICON COMPONENT
// ============================================================================
const MagneticIcon = ({ children, className = '', ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnetic pull effect (stronger when closer)
    x.set(distanceX * 0.3);
    y.set(distanceY * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={`magnetic-icon ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// CART BADGE WITH PULSE
// ============================================================================
const CartBadge = ({ count }) => {
  const [shouldPulse, setShouldPulse] = useState(true);

  useEffect(() => {
    setShouldPulse(true);
    const timer = setTimeout(() => setShouldPulse(false), 2000);
    return () => clearTimeout(timer);
  }, [count]);

  if (count === 0) return null;

  return (
    <motion.span
      className="cart-badge"
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        ...(shouldPulse && {
          boxShadow: [
            '0 0 0 0 rgba(201, 162, 39, 0.7)',
            '0 0 0 8px rgba(201, 162, 39, 0)',
            '0 0 0 0 rgba(201, 162, 39, 0)'
          ]
        })
      }}
      transition={{ 
        scale: { type: 'spring', stiffness: 500, damping: 25 },
        boxShadow: { repeat: shouldPulse ? 3 : 0, duration: 0.8 }
      }}
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  );
};

// ============================================================================
// PREMIUM CART DROPDOWN
// ============================================================================
const PremiumCartDropdown = ({ isOpen, onToggle, onClose }) => {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('cart');
        const parsed = raw ? JSON.parse(raw) : [];
        setItems(parsed);
        setSelectedIds(parsed.map((i) => i.id));
      } catch {
        setItems([]);
        setSelectedIds([]);
      }
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('cart-updated', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('cart-updated', load);
    };
  }, []);

  const save = (next) => {
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const remove = (id) => {
    save(items.filter(i => i.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const updateQty = (id, delta) => {
    const next = items.map(i => i.id === id ? { ...i, qty: Math.max(1, (i.qty || 1) + delta) } : i);
    save(next);
  };

  const toggleItemSelection = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const selectedItems = items.filter((i) => selectedIds.includes(i.id));
  const selectedTotal = selectedItems.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
  const hasSelection = selectedItems.length > 0;

  const handleCheckout = () => {
    if (!hasSelection) {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'warning', message: 'Please select at least one item to proceed.' } }));
      return;
    }

    const primaryItem = selectedItems[0];
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');

    sessionStorage.setItem('subDraft', JSON.stringify({
      ...draft,
      product: primaryItem.id,
      quantity: Number(primaryItem.qty) || 1,
      cartItems: selectedItems.map((item) => ({
        product: item.id,
        quantity: Number(item.qty) || 1,
      })),
    }));

    onClose();
    navigate('/subscribe/duration');
  };

  return (
    <>
      <MagneticIcon>
        <button 
          className="premium-nav-icon cart-icon" 
          onClick={onToggle}
          aria-label={`Shopping cart with ${items.length} items`}
          aria-expanded={isOpen}
        >
          <ShoppingBag size={20} strokeWidth={1.5} />
          <CartBadge count={items.length} />
        </button>
      </MagneticIcon>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="cart-dropdown-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="cart-dropdown"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="cart-dropdown-header">
                <h4>Your Cart</h4>
                <button className="cart-dropdown-close" onClick={onClose}>
                  <X size={18} />
                </button>
              </div>

              <div className="cart-dropdown-body">
                {items.length === 0 ? (
                  <div className="cart-empty">
                    <ShoppingBag size={48} strokeWidth={1} />
                    <p>Your cart is empty</p>
                    <Link to="/products" className="cart-empty-link" onClick={onClose}>
                      Browse products
                    </Link>
                  </div>
                ) : (
                  <div className="cart-items">
                    {items.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        className={`cart-dropdown-item ${selectedIds.includes(item.id) ? 'selected' : ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <label className="cart-item-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                          />
                          <span className="checkmark" />
                        </label>
                        <div className="cart-item-image">
                          <img 
                            src={item.image || `https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=100`}
                            alt={item.name}
                            onError={(e) => { e.target.src = 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=100'; }}
                          />
                        </div>
                        <div className="cart-item-details">
                          <span className="cart-item-name">{item.name}</span>
                          <span className="cart-item-price">{formatINR(item.price)}</span>
                        </div>
                        <div className="cart-item-qty">
                          <button onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">
                            <Minus size={14} />
                          </button>
                          <span>{item.qty || 1}</span>
                          <button onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">
                            <Plus size={14} />
                          </button>
                        </div>
                        <button className="cart-item-remove" onClick={() => remove(item.id)} aria-label="Remove item">
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="cart-dropdown-footer">
                  <div className="cart-summary">
                    <span className="cart-summary-label">
                      {hasSelection ? `${selectedItems.length} selected` : 'Select items to checkout'}
                    </span>
                    <span className="cart-summary-total">{formatINR(selectedTotal)}</span>
                  </div>
                  <button 
                    className="cart-checkout-btn" 
                    onClick={handleCheckout}
                    disabled={!hasSelection}
                  >
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// MEGA MENU COMPONENT
// ============================================================================
const MegaMenu = ({ isOpen, onClose }) => {
  const categories = [
    { name: 'Fresh Milk', icon: Milk, description: 'A2, Organic, Whole', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&h=120&fit=crop' },
    { name: 'Artisan Cheese', icon: Cake, description: 'Paneer, Cheddar, Feta', image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=120&h=120&fit=crop' },
    { name: 'Cultured', icon: IceCream, description: 'Yogurt, Kefir, Buttermilk', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&h=120&fit=crop' },
    { name: 'Farm Fresh', icon: Package, description: 'Butter, Cream, Ghee', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=120&h=120&fit=crop' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="mega-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="mega-menu"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="mega-menu-inner">
              <div className="mega-menu-header">
                <h3>Our Collections</h3>
                <p>Farm-fresh dairy, delivered daily</p>
              </div>
              <div className="mega-menu-grid">
                {categories.map((cat, idx) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link 
                      to="/categories" 
                      className="mega-menu-item"
                      onClick={onClose}
                    >
                      <div className="mega-menu-item-image">
                        <img src={cat.image} alt={cat.name} loading="lazy" />
                      </div>
                      <div className="mega-menu-item-content">
                        <span className="mega-menu-item-name">{cat.name}</span>
                        <span className="mega-menu-item-desc">{cat.description}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mega-menu-footer">
                <Link to="/categories" className="mega-menu-view-all" onClick={onClose}>
                  View All Collections
                  <ChevronDown className="rotate-270" size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// SEARCH OVERLAY COMPONENT
// ============================================================================
const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const trendingSearches = ['A2 Milk', 'Fresh Paneer', 'Greek Yogurt', 'Organic Butter', 'Farm Ghee'];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const handleTrendingClick = (term) => {
    navigate(`/products?search=${encodeURIComponent(term)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="search-overlay-content"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button 
              className="search-close" 
              onClick={onClose}
              aria-label="Close search"
            >
              <X size={24} />
            </button>
            
            <form onSubmit={handleSearch} className="search-form">
              <Search className="search-icon" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="search-input"
                aria-label="Search products"
              />
            </form>

            <div className="trending-searches">
              <span className="trending-label">Trending</span>
              <div className="trending-tags">
                {trendingSearches.map((term, idx) => (
                  <motion.button
                    key={term}
                    className="trending-tag"
                    onClick={() => handleTrendingClick(term)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// MOBILE MENU COMPONENT
// ============================================================================
const MobileMenu = ({ isOpen, onClose, isAuthenticated, logout }) => {
  const navItems = [
    { label: 'Collections', to: '/categories' },
    { label: 'Our Dairy', to: '/products' },
    { label: 'Subscribe', to: '/subscribe/category' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    },
    exit: { opacity: 0, y: -20, filter: 'blur(5px)' }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mobile-menu-backdrop" />
          
          <motion.nav
            className="mobile-menu-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div className="mobile-menu-header" variants={itemVariants}>
              <span className="mobile-menu-brand">Milkman</span>
            </motion.div>

            {navItems.map((item) => (
              <motion.div key={item.to} variants={itemVariants}>
                <Link
                  to={item.to}
                  className="mobile-menu-link"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <motion.div className="mobile-menu-divider" variants={itemVariants} />

            {isAuthenticated ? (
              <>
                <motion.div variants={itemVariants}>
                  <Link to="/dashboard" className="mobile-menu-link secondary" onClick={onClose}>
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <button className="mobile-menu-link secondary" onClick={() => { logout(); onClose(); }}>
                    Sign Out
                  </button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div variants={itemVariants}>
                  <Link to="/login" className="mobile-menu-link secondary" onClick={onClose}>
                    Sign In
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link to="/signup" className="mobile-menu-cta" onClick={onClose}>
                    Start Subscription
                  </Link>
                </motion.div>
              </>
            )}
          </motion.nav>

          <button 
            className="mobile-menu-close" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// NAV LINK WITH ANIMATED UNDERLINE
// ============================================================================
const AnimatedNavLink = ({ to, children, onMouseEnter, isHovered }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `premium-nav-link ${isActive ? 'active' : ''}`}
      onMouseEnter={onMouseEnter}
    >
      {children}
      <motion.span
        className="nav-link-underline"
        initial={false}
        animate={{ 
          scaleX: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </NavLink>
  );
};

// ============================================================================
// MAIN PREMIUM NAVBAR COMPONENT
// ============================================================================
const PremiumNavbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Smart sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine visibility
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
        setIsMegaMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Cart count listener
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-updated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const navVariants = {
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    hidden: { 
      y: -100, 
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      <motion.header
        className={`premium-nav ${isScrolled ? 'scrolled' : ''}`}
        initial="visible"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={navVariants}
      >
        <div className="premium-nav-inner">
          {/* Left Section - Navigation Links */}
          <nav className="premium-nav-section left" aria-label="Main navigation">
            <div 
              className="nav-link-wrapper"
              onMouseEnter={() => {
                setHoveredLink('collections');
                setIsMegaMenuOpen(true);
              }}
              onMouseLeave={() => {
                setHoveredLink(null);
                // Delay closing to allow mouse to move to menu
                setTimeout(() => {
                  setIsMegaMenuOpen(false);
                }, 150);
              }}
            >
              <AnimatedNavLink 
                to="/categories"
                isHovered={hoveredLink === 'collections'}
                onMouseEnter={() => setHoveredLink('collections')}
              >
                Collections
                <ChevronDown size={14} className="nav-chevron" />
              </AnimatedNavLink>
            </div>
            
            <AnimatedNavLink 
              to="/products"
              isHovered={hoveredLink === 'dairy'}
              onMouseEnter={() => {
                setHoveredLink('dairy');
                setIsMegaMenuOpen(false);
              }}
            >
              Our Dairy
            </AnimatedNavLink>
          </nav>

          {/* Center Section - Logo */}
          <div className="premium-nav-section center">
            <Link to="/" className="premium-brand" aria-label="Milkman Home">
              <motion.span 
                className="premium-brand-text"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                Milkman
              </motion.span>
            </Link>
          </div>

          {/* Right Section - Actions */}
          <div className="premium-nav-section right">
            {/* Search Button */}
            <MagneticIcon>
              <button 
                className="premium-nav-icon" 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </MagneticIcon>

            {/* Cart Dropdown */}
            <PremiumCartDropdown 
              isOpen={isCartOpen}
              onToggle={() => setIsCartOpen(!isCartOpen)}
              onClose={() => setIsCartOpen(false)}
            />

            {/* Auth Actions */}
            {isAuthenticated ? (
              <>
                <MagneticIcon>
                  <Link to="/dashboard" className="premium-nav-icon" aria-label="Dashboard">
                    <User size={20} strokeWidth={1.5} />
                  </Link>
                </MagneticIcon>
                <button 
                  className="premium-nav-text-btn"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="premium-nav-text-btn">
                  Sign In
                </Link>
                <Link to="/signup" className="premium-nav-cta">
                  Subscribe
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="premium-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>

        {/* Mega Menu */}
        <MegaMenu 
          isOpen={isMegaMenuOpen} 
          onClose={() => setIsMegaMenuOpen(false)} 
        />
      </motion.header>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
    </>
  );
};

export default PremiumNavbar;
