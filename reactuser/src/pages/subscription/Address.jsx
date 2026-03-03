import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressStepper from '../../components/ProgressStepper';
import { FormTextarea } from '../../components/Form';

const Address = () => {
  const [address, setAddress] = useState('');
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
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, address }));
    navigate('/subscribe/confirm');
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <ProgressStepper currentStep={6} steps={steps} orientation="horizontal" />
      <h3 className="title">Delivery Address</h3>
      <FormTextarea
        label="Address"
        name="address"
        placeholder="Enter your delivery address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={4}
        maxLength={300}
        required
      />
      <button className="btn" onClick={next} style={{ marginTop: 12 }}>Continue</button>
    </div>
  );
};

export default Address;
