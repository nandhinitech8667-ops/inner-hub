import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const UserAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('userToken');
    const savedUser = localStorage.getItem('userData');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('userToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const signup = async (data) => {
    const res = await axios.post(`${API_URL}/auth/signup`, data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('userToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
  };

  // Axios instance with auth header
  const authAxios = axios.create({ baseURL: API_URL });
  authAxios.interceptors.request.use((config) => {
    const t = localStorage.getItem('userToken');
    if (t) {
      config.headers.Authorization = `Bearer ${t}`;
    }
    return config;
  });

  return (
    <UserAuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      isUserAuthenticated: !!token,
      authAxios
    }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
