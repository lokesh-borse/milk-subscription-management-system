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
    <div style={{ maxWidth: 440, margin: '0 auto' }}>
      <h2 className="title">Login</h2>
      {error && <div className="card card-body" style={{ borderColor: '#fecaca', color:'#7f1d1d' }}>{error}</div>}
      <form onSubmit={onSubmit} className="card card-body">
        <div style={{ marginBottom: 12 }}>
          <label className="muted">Email</label>
          <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="muted">Password</label>
          <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="actions">
          <button disabled={loading} type="submit" className="btn">Login</button>
          <Link className="link" to="/signup">Create account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
