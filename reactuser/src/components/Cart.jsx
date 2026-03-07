import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emptyCart from '../assets/empty-cart.svg';
import { formatINR } from '../utils/currency';

const Cart = () => {
  const [open, setOpen] = useState(false);
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
      } catch (e) {
        setItems([]);
        setSelectedIds([]);
      }
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const save = (next) => {
    setItems(next);
    localStorage.setItem('cart', JSON.stringify(next));
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

  const total = items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0).toFixed(2);
  const selectedItems = items.filter((i) => selectedIds.includes(i.id));
  const selectedTotal = selectedItems.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0).toFixed(2);
  const hasSelection = selectedItems.length > 0;

  const handleCheckout = () => {
    if (!hasSelection) {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'warning', message: 'Please select at least one item to proceed.' } }));
      return;
    }

    const primaryItem = selectedItems[0];
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');

    // Carry selected items for checkout while preserving current single-product compatibility fields.
    sessionStorage.setItem('subDraft', JSON.stringify({
      ...draft,
      product: primaryItem.id,
      quantity: Number(primaryItem.qty) || 1,
      cartItems: selectedItems.map((item) => ({
        product: item.id,
        quantity: Number(item.qty) || 1,
      })),
    }));

    setOpen(false);
    navigate('/subscribe/duration');
  };

  // side-effects for user feedback
  useEffect(() => {
    // notify when cart changes (useful for other UI)
    window.dispatchEvent(new Event('cart-updated'));
  }, [items]);

  return (
    <div className="cart-root">
      <button className="nav-icon cart-button" onClick={() => setOpen(true)} title="Open cart">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        {items.length > 0 && <span className="cart-badge">{items.length}</span>}
      </button>

      <div className={`cart-panel ${open ? 'open' : ''}`} role="dialog" aria-hidden={!open}>
        <div className="cart-panel-header">
          <h3>Your Cart</h3>
          <button className="btn-text" onClick={() => setOpen(false)}>Close</button>
        </div>
        <div className="cart-panel-body">
          {items.length === 0 ? (
            <div className="muted" style={{ textAlign: 'center' }}>
              <img src={emptyCart} alt="Empty cart" style={{ width: 160, margin: '14px auto 8px', display: 'block' }} />
              <div>Your cart is empty. Add a few morning staples!</div>
            </div>
          ) : (
            items.map(it => (
              <div className="cart-item" key={it.id}>
                <label className="cart-item-select" title="Select for checkout">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(it.id)}
                    onChange={() => toggleItemSelection(it.id)}
                  />
                </label>
                <img
                  src={it.image || `https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=200&sig=${it.id}`}
                  alt={it.name}
                  onError={(e) => { e.target.src = `https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=200`; }}
                />
                <div className="cart-item-info">
                  <div className="product-name">{it.name}</div>
                  <div className="product-meta">{formatINR(it.price)}</div>
                  <div className="cart-controls">
                    <button className="btn-sm" onClick={() => { updateQty(it.id, -1); window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', message: `Updated ${it.name}` } })); }}>-</button>
                    <div className="qty">{it.qty || 1}</div>
                    <button className="btn-sm" onClick={() => { updateQty(it.id, 1); window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', message: `Updated ${it.name}` } })); }}>+</button>
                    <button className="btn-text" onClick={() => { remove(it.id); window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'warning', message: `Removed ${it.name}` } })); }}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-panel-footer">
          <div className="cart-total">
            <div>Total: <strong>{formatINR(total)}</strong></div>
            <div className="muted" style={{ fontSize: 13 }}>Selected: {selectedItems.length} item(s) • {formatINR(selectedTotal)}</div>
            {!hasSelection && items.length > 0 && <div style={{ color: 'var(--color-danger)', fontSize: 13 }}>Please select at least one item to proceed.</div>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/products" className="btn btn-sm" onClick={() => setOpen(false)}>Continue Shopping</Link>
            <button className="btn" onClick={handleCheckout} disabled={!items.length || !hasSelection}>Checkout</button>
          </div>
        </div>
      </div>

      {open && <div className="cart-backdrop" onClick={() => setOpen(false)} />}
    </div>
  );
};

export default Cart;
