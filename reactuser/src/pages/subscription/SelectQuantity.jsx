import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressStepper from '../../components/ProgressStepper';

const SelectQuantity = () => {
  const [quantity, setQuantity] = useState(1);
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
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, quantity: Number(quantity) }));
    navigate('/subscribe/duration');
  };

  return (
    <div>
      <ProgressStepper currentStep={3} steps={steps} orientation="horizontal" />
      <h3 className="title">Select Quantity</h3>
      <div style={{ maxWidth: 300, marginBottom: 12 }}>
        <input type="number" min={1} className="input" value={quantity} onChange={e => setQuantity(e.target.value)} />
      </div>
      <button className="btn" onClick={next}>Continue</button>
    </div>
  );
};

export default SelectQuantity;
