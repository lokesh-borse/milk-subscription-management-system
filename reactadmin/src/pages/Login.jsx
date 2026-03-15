import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('staffToken')) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await api.post('/api/staff/login/', { email, password });
            const { token, staff_id } = response.data;
            localStorage.setItem('staffToken', token);
            localStorage.setItem('staffUser', JSON.stringify({ email, id: staff_id }));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            padding: '20px',
        }}>
            {/* Background decorative blobs */}
            <div style={{
                position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
            }}>
                <div style={{
                    position: 'absolute', top: '-10%', left: '-5%',
                    width: 500, height: 500, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10%', right: '-5%',
                    width: 600, height: 600, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
                }} />
            </div>

            <div style={{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: 420,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(24px)',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                padding: '40px 36px',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 56, height: 56, borderRadius: 16,
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        fontSize: 28, marginBottom: 16,
                        boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
                    }}>🥛</div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                        Milkman Admin
                    </h1>
                    <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 14 }}>
                        Sign in to your staff portal
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="staff@milkman.com"
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 12, padding: '12px 16px',
                                color: '#f1f5f9', fontSize: 14,
                                outline: 'none', transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            style={{
                                width: '100%', boxSizing: 'border-box',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 12, padding: '12px 16px',
                                color: '#f1f5f9', fontSize: 14,
                                outline: 'none', transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.4)',
                            borderRadius: 10, padding: '10px 14px',
                            color: '#fca5a5', fontSize: 13, marginBottom: 20,
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            border: 'none', borderRadius: 12,
                            padding: '14px', color: '#fff',
                            fontSize: 15, fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: loading ? 'none' : '0 8px 24px rgba(59,130,246,0.4)',
                            transition: 'all 0.2s',
                        }}
                    >
                        {loading ? 'Signing in…' : 'Sign In →'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
