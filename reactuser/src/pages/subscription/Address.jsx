import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Address = () => {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const next = () => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, address }));
    navigate('/subscribe/confirm');
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h3 className="title">Delivery Address</h3>
      <div style={{ marginBottom: 12 }}>
        <label className="muted">Address</label>
        <textarea className="textarea" rows={3} value={address} onChange={e => setAddress(e.target.value)} />
      </div>
      <button className="btn" onClick={next}>Continue</button>
    </div>
  );
};

export default Address;
