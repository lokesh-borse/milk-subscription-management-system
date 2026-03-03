import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressStepper from '../../components/ProgressStepper';

const SelectDuration = () => {
  const [duration, setDuration] = useState(1);
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
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, duration: Number(duration) }));
    navigate('/subscribe/slot');
  };

  return (
    <div>
      <ProgressStepper currentStep={4} steps={steps} orientation="horizontal" />
      <h3 className="title">Select Duration</h3>
      <div className="actions" style={{ marginBottom: 12 }}>
        {[1, 3, 6].map(m => (
          <button key={m} className={`btn outline`} style={{ background: duration === m ? '#eef2ff' : undefined }} onClick={() => setDuration(m)}>{m} month{m>1?'s':''}</button>
        ))}
      </div>
      <div>
        <button className="btn" onClick={next}>Continue</button>
      </div>
    </div>
  );
};

export default SelectDuration;
