import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('recipemate_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null; // Empty on start - no fake demo user!
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('recipemate_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('recipemate_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    try {
      // 1. Try Backend REST API
      const res = await apiService.login({ email, password });
      if (res && res.success) {
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      // 2. Fallback to locally registered users in localStorage if backend is offline
      const localUsers = JSON.parse(localStorage.getItem('recipemate_registered_users') || '[]');
      const match = localUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
      );
      if (match) {
        if (match.status === 'Inactive') {
          return { success: false, message: 'Account has been deactivated.' };
        }
        const { password: _, ...userSafe } = match;
        setCurrentUser(userSafe);
        return { success: true, user: userSafe };
      }
      return { success: false, message: err.message || 'Invalid email or password. Please register if you are a new user.' };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const register = async (userData) => {
    try {
      // 1. Try Backend REST API
      const res = await apiService.register(userData);
      if (res && res.success) {
        setCurrentUser(res.user);
        // Also cache locally
        const localUsers = JSON.parse(localStorage.getItem('recipemate_registered_users') || '[]');
        localUsers.push(res.user);
        localStorage.setItem('recipemate_registered_users', JSON.stringify(localUsers));
        return { success: true, user: res.user };
      }
    } catch (err) {
      // 2. Fallback to localStorage if backend is offline
      const localUsers = JSON.parse(localStorage.getItem('recipemate_registered_users') || '[]');
      const exists = localUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (exists) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      const newUser = {
        id: `usr-${Date.now()}`,
        ...userData,
        role: userData.role === 'ADMIN' ? 'ADMIN' : 'USER',
        avatar: userData.role === 'ADMIN' ? '🛡️' : '👨‍🍳',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      localUsers.push(newUser);
      localStorage.setItem('recipemate_registered_users', JSON.stringify(localUsers));
      const { password: _, ...userSafe } = newUser;
      setCurrentUser(userSafe);
      return { success: true, user: userSafe };
    }
    return { success: false, message: 'Registration failed.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (updates) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        updateUserProfile,
        isAdmin: currentUser?.role === 'ADMIN'
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
