import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectQuantity = () => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const next = () => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, quantity: Number(quantity) }));
    navigate('/subscribe/duration');
  };

  return (
    <div>
      <h3 className="title">Select Quantity</h3>
      <div style={{ maxWidth: 300, marginBottom: 12 }}>
        <input type="number" min={1} className="input" value={quantity} onChange={e => setQuantity(e.target.value)} />
      </div>
      <button className="btn" onClick={next}>Continue</button>
    </div>
  );
};

export default SelectQuantity;
