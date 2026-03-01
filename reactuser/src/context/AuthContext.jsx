import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userProfile') || 'null');
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!token;

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/customer/login/', { email, password });
      const { token: t, customer_id, name } = res.data;
      localStorage.setItem('userToken', t);
      localStorage.setItem('userProfile', JSON.stringify({ id: customer_id, email, name }));
      setToken(t);
      setUser({ id: customer_id, email, name });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.response?.data?.detail || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post('/customer/signup/', payload);
      const { token: t, customer_id, name, email } = res.data;
      localStorage.setItem('userToken', t);
      localStorage.setItem('userProfile', JSON.stringify({ id: customer_id, email, name }));
      setToken(t);
      setUser({ id: customer_id, email, name });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.response?.data?.detail || 'Signup failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userProfile');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user, token, isAuthenticated, loading, login, signup, logout,
  }), [user, token, isAuthenticated, loading]);

  useEffect(() => {
    // future: verify token freshness
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
