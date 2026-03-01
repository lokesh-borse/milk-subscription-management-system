import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="text-center p-5">
      <h2 className="mb-3">Subscription Confirmed</h2>
      <p className="lead">Welcome aboard! Your milk plan is active.</p>
      <div className="d-flex justify-content-center gap-2">
        <Link className="btn btn-primary" to="/dashboard">Go to Dashboard</Link>
        <Link className="btn btn-outline-secondary" to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default Success;
