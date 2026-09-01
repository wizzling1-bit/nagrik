import React, { createContext, useContext, useState } from 'react';

export interface User {
  id?: string;
  _id?: string;
  email: string;
  name?: string;
  role: 'CITIZEN' | 'CREATOR' | 'ADMIN';
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
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token') || localStorage.getItem('creator_token') || localStorage.getItem('admin_token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Fallback if legacy token exists
    const legacyRole = localStorage.getItem('admin_token') ? 'ADMIN' : localStorage.getItem('creator_token') ? 'CREATOR' : null;
    if (legacyRole) {
      return { email: 'user@naagrik.news', role: legacyRole as any };
    }
    return null;
  });

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    if (newUser.role === 'ADMIN') {
      localStorage.setItem('admin_token', newToken);
    } else if (newUser.role === 'CREATOR') {
      localStorage.setItem('creator_token', newToken);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('creator_token');
    localStorage.removeItem('admin_token');
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
