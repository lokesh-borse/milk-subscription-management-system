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
      const { token: t, customer_id, name, phone, address } = res.data;
      localStorage.setItem('userToken', t);
      localStorage.setItem('userProfile', JSON.stringify({ id: customer_id, email, name, phone, address }));
      setToken(t);
      setUser({ id: customer_id, email, name, phone, address });
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
      await api.post('/customer/signup/', payload);

      // Signup should not create an authenticated session.
      localStorage.removeItem('userToken');
      localStorage.removeItem('userProfile');
      setToken(null);
      setUser(null);

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

  const updateProfile = async (payload) => {
    setLoading(true);
    try {
      const res = await api.patch('/customer/me/', payload);
      const profile = {
        id: res.data?.customer_id,
        name: res.data?.name,
        email: res.data?.email,
        phone: res.data?.phone,
        address: res.data?.address,
      };
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setUser(profile);
      return { ok: true, data: profile };
    } catch (e) {
      return { ok: false, error: e.response?.data?.detail || 'Failed to update profile' };
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    user, token, isAuthenticated, loading, login, signup, logout, updateProfile,
  }), [user, token, isAuthenticated, loading]);

  useEffect(() => {
    let mounted = true;

    const hydrateProfile = async () => {
      if (!token) return;
      if (user?.address && user?.phone) return;

      try {
        const res = await api.get('/customer/me/');
        const profile = {
          id: res.data?.customer_id,
          name: res.data?.name,
          email: res.data?.email,
          phone: res.data?.phone,
          address: res.data?.address,
        };

        if (!mounted) return;

        localStorage.setItem('userProfile', JSON.stringify(profile));
        setUser(profile);
      } catch {
        // 401 handling is managed globally in api interceptor.
      }
    };

    hydrateProfile();

    return () => {
      mounted = false;
    };
  }, [token, user?.address, user?.phone]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
