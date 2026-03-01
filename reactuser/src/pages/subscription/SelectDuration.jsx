import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectDuration = () => {
  const [duration, setDuration] = useState(1);
  const navigate = useNavigate();

  const next = () => {
    const draft = JSON.parse(sessionStorage.getItem('subDraft') || '{}');
    sessionStorage.setItem('subDraft', JSON.stringify({ ...draft, duration: Number(duration) }));
    navigate('/subscribe/slot');
  };

  return (
    <div>
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
