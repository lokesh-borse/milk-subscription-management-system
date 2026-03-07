import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormInput, FormTextarea } from '../components/Form';

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
    if (res.ok) {
      navigate('/login', {
        state: { successMessage: 'Registration successful! Please log in to continue.' },
      });
    }
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
              <FormInput
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={onChange}
                required
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={onChange}
                required
              />
              <FormInput
                label="Phone"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={onChange}
                required
              />
              <div style={{ gridColumn: 'span 2' }}>
                <FormTextarea
                  label="Address"
                  name="address"
                  placeholder="123 Main Street, City, State 12345"
                  value={form.address}
                  onChange={onChange}
                  rows={3}
                  maxLength={200}
                  required
                />
              </div>
              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={onChange}
                hint="At least 8 characters"
                required
              />
            </div>
            <div className="actions" style={{ marginTop: 12 }}>
              <button disabled={loading} type="submit" className="btn">
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
              <Link className="link" to="/login">I already have an account</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
