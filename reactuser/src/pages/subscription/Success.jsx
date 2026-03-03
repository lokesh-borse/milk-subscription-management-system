import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import ProgressStepper from '../../components/ProgressStepper';

const Success = () => {
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

  return (
    <div>
      <ProgressStepper currentStep={8} steps={steps} orientation="horizontal" />
      <div className="card card-body text-center">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <CheckCircle2 size={80} color="#10b981" strokeWidth={1.5} />
        </div>
        <h2 className="title" style={{ marginBottom: 8 }}>Subscription Confirmed!</h2>
        <p className="subtitle" style={{ marginBottom: 24 }}>Welcome aboard! Your milk subscription plan is now active. You'll receive your first delivery according to the schedule you selected.</p>
        <div className="card" style={{ padding: 16, marginBottom: 24, backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#166534' }}>What happens next?</p>
          <ul style={{ textAlign: 'left', margin: 0, paddingLeft: 20, fontSize: '14px', color: '#15803d' }}>
            <li style={{ marginBottom: 4 }}>Check your email for the confirmation details</li>
            <li style={{ marginBottom: 4 }}>Track your deliveries from the dashboard</li>
            <li style={{ marginBottom: 4 }}>Manage your subscription anytime (pause, resume, or modify)</li>
          </ul>
        </div>
        <div className="actions">
          <Link className="btn" to="/dashboard">Go to Dashboard</Link>
          <Link className="btn outline" to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
