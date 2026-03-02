import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.ok) navigate('/dashboard');
    else setError(res.error);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="auth-shell narrow">
          <div className="auth-head">
            <h2 className="title">Welcome back</h2>
            <p className="subtitle">Sign in to manage your subscriptions and deliveries.</p>
          </div>
          {error && <div className="card card-body" style={{ borderColor: '#fecaca', color: '#7f1d1d', marginBottom: 12 }}>{error}</div>}
          <form onSubmit={onSubmit} className="card card-body">
            <div className="field">
              <label className="muted">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label className="muted">Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="actions">
              <button disabled={loading} type="submit" className="btn">Login</button>
              <Link className="link" to="/signup">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
