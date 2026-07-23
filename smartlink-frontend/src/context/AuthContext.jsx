import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
    setUser(res.data.user);
  };

  const register = async (userData) => {
    await axios.post('/api/auth/register', userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const googleLogin = async (token, userPayload = {}) => {
    const res = await axios.post('/api/auth/google', { token, ...userPayload });
    localStorage.setItem('token', res.data.access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
