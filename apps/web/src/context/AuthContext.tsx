'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id?: string;
  _id?: string;
  email: string;
  name?: string;
  role: 'CITIZEN' | 'CREATOR' | 'ADMIN' | 'USER';
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  role: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedToken = localStorage.getItem('auth_token') || localStorage.getItem('creator_token') || localStorage.getItem('admin_token');
      const savedUserStr = localStorage.getItem('auth_user');
      let savedUser: User | null = null;
      if (savedUserStr) {
        try {
          savedUser = JSON.parse(savedUserStr);
        } catch {
          savedUser = null;
        }
      } else {
        const legacyRole = localStorage.getItem('admin_token') ? 'ADMIN' : localStorage.getItem('creator_token') ? 'CREATOR' : null;
        if (legacyRole) {
          savedUser = { email: 'user@nagrik.news', role: legacyRole as any };
        }
      }
      setToken(savedToken);
      setUser(savedUser);
    } catch (err) {
      console.warn('Could not read auth token from localStorage:', err);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      if (newUser.role === 'ADMIN') {
        localStorage.setItem('admin_token', newToken);
      } else if (newUser.role === 'CREATOR') {
        localStorage.setItem('creator_token', newToken);
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('creator_token');
      localStorage.removeItem('admin_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role || null,
        login,
        logout,
        isAuthenticated: !!token && !!user
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
