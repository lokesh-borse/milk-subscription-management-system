import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await signup(form);
    if (res.ok) navigate('/dashboard');
    else setError(res.error);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="auth-shell">
          <div className="auth-head">
            <h2 className="title">Create account</h2>
            <p className="subtitle">Set up your profile for recurring fresh dairy delivery.</p>
          </div>
          {error && <div className="card card-body" style={{ borderColor: '#fecaca', color: '#7f1d1d', marginBottom: 12 }}>{error}</div>}
          <form onSubmit={onSubmit} className="card card-body">
            <div className="grid cols-3">
              <div className="field">
                <label className="muted">Name</label>
                <input name="name" className="input" value={form.name} onChange={onChange} required />
              </div>
              <div className="field">
                <label className="muted">Email</label>
                <input type="email" name="email" className="input" value={form.email} onChange={onChange} required />
              </div>
              <div className="field">
                <label className="muted">Phone</label>
                <input name="phone" className="input" value={form.phone} onChange={onChange} required />
              </div>
              <div className="field" style={{ gridColumn: 'span 2' }}>
                <label className="muted">Address</label>
                <input name="address" className="input" value={form.address} onChange={onChange} required />
              </div>
              <div className="field">
                <label className="muted">Password</label>
                <input type="password" name="password" className="input" value={form.password} onChange={onChange} required />
              </div>
            </div>
            <div className="actions" style={{ marginTop: 12 }}>
              <button disabled={loading} type="submit" className="btn">Sign Up</button>
              <Link className="link" to="/login">I already have an account</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
