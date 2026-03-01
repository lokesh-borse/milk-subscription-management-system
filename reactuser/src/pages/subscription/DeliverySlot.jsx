import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliverySlot = () => {
  const [slot, setSlot] = useState('morning');
  const navigate = useNavigate();

  const next = () => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, delivery_slot: slot }));
    navigate('/subscribe/address');
  };

  return (
    <div>
      <h3 className="title">Choose Delivery Slot</h3>
      <div style={{ maxWidth: 400, marginBottom: 12 }}>
        <select className="select" value={slot} onChange={e => setSlot(e.target.value)}>
          <option value="morning">Morning (7–9 AM)</option>
          <option value="noon">Noon (12–2 PM)</option>
          <option value="evening">Evening (6–8 PM)</option>
        </select>
      </div>
      <button className="btn" onClick={next}>Continue</button>
    </div>
  );
};

export default DeliverySlot;
