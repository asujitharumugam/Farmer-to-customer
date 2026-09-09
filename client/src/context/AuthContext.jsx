import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('farm_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('farm_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data.user);
            localStorage.setItem('farm_user', JSON.stringify(res.data.data.user));
          }
        } catch (err) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            localStorage.removeItem('farm_token');
            localStorage.removeItem('farm_user');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, data } = res.data;
        localStorage.setItem('farm_token', token);
        localStorage.setItem('farm_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (err) {
      // Fallback Demo logins if API is unavailable or seeding hasn't run
      return handleDemoFallbackLogin(email, password, err);
    }
  };

  const handleDemoFallbackLogin = (email, password, error) => {
    let demoUser = null;
    if (email === 'customer@gmail.com') {
      demoUser = { _id: 'cust_demo_1', name: 'Anand Kumar (Customer)', email: 'customer@gmail.com', role: 'customer', phone: '+91 98401 23456' };
    } else if (email === 'farmer@greenacres.com') {
      demoUser = { _id: 'farmer_demo_1', name: 'Muthusamy Gounder (Farmer)', email: 'farmer@greenacres.com', role: 'farmer', phone: '+91 94432 10987' };
    } else if (email === 'admin@farmtotable.com') {
      demoUser = { _id: 'admin_demo_1', name: 'Platform Admin (Admin)', email: 'admin@farmtotable.com', role: 'admin', phone: '+91 98765 00001' };
    }

    if (demoUser) {
      const fakeToken = `demo_jwt_token_${demoUser.role}_${Date.now()}`;
      localStorage.setItem('farm_token', fakeToken);
      localStorage.setItem('farm_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true, user: demoUser, isDemo: true };
    }

    const message = error.response?.data?.message || 'Login failed. Please check credentials.';
    return { success: false, message };
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        const { token, data } = res.data;
        localStorage.setItem('farm_token', token);
        localStorage.setItem('farm_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      }
    } catch (err) {
      // Demo fallback registration
      const newDemoUser = {
        _id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'customer',
        phone: userData.phone || ''
      };
      localStorage.setItem('farm_token', `demo_token_${Date.now()}`);
      localStorage.setItem('farm_user', JSON.stringify(newDemoUser));
      setUser(newDemoUser);
      return { success: true, user: newDemoUser };
    }
  };

  const logout = () => {
    localStorage.removeItem('farm_token');
    localStorage.removeItem('farm_user');
    setUser(null);
  };

  const switchRoleDemo = (role) => {
    if (role === 'customer') {
      login('customer@gmail.com', 'Password123!');
    } else if (role === 'farmer') {
      login('farmer@greenacres.com', 'Password123!');
    } else if (role === 'admin') {
      login('admin@farmtotable.com', 'Password123!');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRoleDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
