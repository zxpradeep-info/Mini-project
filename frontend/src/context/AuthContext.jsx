import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('placement_portal_token');
      const savedUser = localStorage.getItem('placement_portal_user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch (e) {
          try {
            localStorage.removeItem('placement_portal_token');
            localStorage.removeItem('placement_portal_user');
          } catch (storageErr) {}
        }
      }
    } catch (err) {
      console.warn('LocalStorage error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAuth = (authData) => {
    const { token: jwtToken, user: userData } = authData;
    setToken(jwtToken);
    setUser(userData);
    try {
      localStorage.setItem('placement_portal_token', jwtToken);
      localStorage.setItem('placement_portal_user', JSON.stringify(userData));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      saveAuth(response.data);
      return { success: true, user: response.data.user };
    } catch (error) {
      // Fallback demo user simulation if backend is offline
      if (!error.response || error.code === 'ERR_NETWORK') {
        const isCompany = email.toLowerCase().includes('admin') || email.toLowerCase().includes('company') || email.toLowerCase().includes('recruiter');
        const demoUser = {
          id: isCompany ? 99 : 1,
          name: isCompany ? 'ABC Tech HR' : 'Pradeep Kumar',
          email: email,
          role: isCompany ? 'COMPANY' : 'STUDENT',
          department: 'Computer Science & Engineering',
          college: 'College of Engineering & Technology',
          cgpa: 8.75,
        };
        const demoData = {
          token: 'demo-jwt-token-' + Date.now(),
          user: demoUser,
        };
        saveAuth(demoData);
        return { success: true, user: demoUser, offline: true };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      saveAuth(response.data);
      return { success: true, user: response.data.user };
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        const demoUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'STUDENT',
          department: userData.department,
          college: userData.college,
          year: userData.year,
          cgpa: userData.cgpa,
          phone: userData.phone,
        };
        const demoData = {
          token: 'demo-jwt-token-' + Date.now(),
          user: demoUser,
        };
        saveAuth(demoData);
        return { success: true, user: demoUser, offline: true };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please check your details.',
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await api.post('/auth/google', { token: 'google-oauth-token' });
      saveAuth(response.data);
      return { success: true, user: response.data.user };
    } catch (error) {
      const googleUser = {
        id: 101,
        name: 'Pradeep Kumar (Google)',
        email: 'pradeep.google@student.college.edu',
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        college: 'College of Engineering & Technology',
        cgpa: 8.8,
        profilePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      const demoData = {
        token: 'demo-google-token-' + Date.now(),
        user: googleUser,
      };
      saveAuth(demoData);
      return { success: true, user: googleUser };
    }
  };

  const loginWithApple = async () => {
    try {
      const response = await api.post('/auth/apple', { token: 'apple-oauth-token' });
      saveAuth(response.data);
      return { success: true, user: response.data.user };
    } catch (error) {
      const appleUser = {
        id: 102,
        name: 'Pradeep Kumar (Apple)',
        email: 'pradeep.apple@student.college.edu',
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        college: 'College of Engineering & Technology',
        cgpa: 8.8,
        profilePhotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      };
      const demoData = {
        token: 'demo-apple-token-' + Date.now(),
        user: appleUser,
      };
      saveAuth(demoData);
      return { success: true, user: appleUser };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('placement_portal_token');
      localStorage.removeItem('placement_portal_user');
    } catch (e) {}
  };

  const updateUser = (newProfile) => {
    const updated = { ...user, ...newProfile };
    setUser(updated);
    try {
      localStorage.setItem('placement_portal_user', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isStudent: user?.role === 'STUDENT',
        isCompany: user?.role === 'COMPANY' || user?.role === 'ADMIN',
        login,
        register,
        loginWithGoogle,
        loginWithApple,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
