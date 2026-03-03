import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressStepper from '../../components/ProgressStepper';

const DeliverySlot = () => {
  const [slot, setSlot] = useState('morning');
  const navigate = useNavigate();

  const steps = [
    { id: 1, label: 'Category', description: 'Choose category' },
    { id: 2, label: 'Product', description: 'Select product' },
    { id: 3, label: 'Quantity', description: 'Pick quantity' },
    { id: 4, label: 'Duration', description: 'Select duration' },
    { id: 5, label: 'Delivery Slot', description: 'Choose slot' },
    { id: 6, label: 'Address', description: 'Delivery address' },
    { id: 7, label: 'Confirm', description: 'Review order' },
    { id: 8, label: 'Success', description: 'Complete!' },
  ];

  const next = () => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, delivery_slot: slot }));
    navigate('/subscribe/address');
  };

  return (
    <div>
      <ProgressStepper currentStep={5} steps={steps} orientation="horizontal" />
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
