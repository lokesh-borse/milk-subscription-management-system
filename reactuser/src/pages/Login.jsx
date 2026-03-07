import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormInput } from '../components/Form';

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;
  const redirectTo = location.state?.from || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    
    const res = await login(email, password);
    if (res.ok) navigate(redirectTo, { replace: true });
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
          {successMessage && (
            <div className="card card-body" style={{ borderColor: '#bbf7d0', color: '#14532d', marginBottom: 12 }}>
              {successMessage}
            </div>
          )}
          {error && <div className="card card-body" style={{ borderColor: '#fecaca', color: '#7f1d1d', marginBottom: 12 }}>{error}</div>}
          <form onSubmit={onSubmit} className="card card-body">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />
            <div className="actions">
              <button disabled={loading} type="submit" className="btn">
                {loading ? 'Signing in...' : 'Login'}
              </button>
              <Link className="link" to="/signup">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
