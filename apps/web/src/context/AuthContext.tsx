'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  signInWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  signUpWithSupabase: (email: string, password: string, name: string, role?: User['role']) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous recovery from localStorage to eliminate any flash of unauthenticated state on page reload
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return (
          localStorage.getItem('auth_token') ||
          localStorage.getItem('admin_token') ||
          localStorage.getItem('creator_token') ||
          null
        );
      } catch {
        return null;
      }
    }
    return null;
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUserStr = localStorage.getItem('auth_user');
        if (savedUserStr) {
          return JSON.parse(savedUserStr);
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hasSavedToken = !!(
        localStorage.getItem('auth_token') ||
        localStorage.getItem('admin_token') ||
        localStorage.getItem('creator_token')
      );
      const hasSavedUser = !!localStorage.getItem('auth_user');
      // If credentials already exist in storage, we are immediately authenticated
      return !(hasSavedToken && hasSavedUser);
    }
    return true;
  });

  // Initialize session from Supabase and LocalStorage
  useEffect(() => {
    let isMounted = true;

    async function resolveAuthoritativeUser(supaUser: any): Promise<User> {
      let role: User['role'] = (supaUser.user_metadata?.role || 'CREATOR').toUpperCase() as User['role'];
      let name: string = supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User';

      try {
        const { data: userRow } = await supabase
          .from('users')
          .select('role, name')
          .eq('id', supaUser.id)
          .maybeSingle();

        if (userRow) {
          if (userRow.role) role = userRow.role.toUpperCase() as User['role'];
          if (userRow.name) name = userRow.name;
        }
      } catch (e) {
        console.warn('[AuthContext] Database role reconciliation notice:', e);
      }

      return {
        id: supaUser.id,
        email: supaUser.email || '',
        name,
        role
      };
    }

    async function initAuth() {
      try {
        // 1. Check active Supabase Session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (session && session.user && isMounted) {
          const mappedUser = await resolveAuthoritativeUser(session.user);

          setToken(session.access_token);
          setUser(mappedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', session.access_token);
            localStorage.setItem('auth_user', JSON.stringify(mappedUser));
            if (mappedUser.role === 'ADMIN') {
              localStorage.setItem('admin_token', session.access_token);
            } else {
              localStorage.setItem('creator_token', session.access_token);
            }
          }
          setIsLoading(false);
          return;
        }

        // 2. Fallback to LocalStorage
        if (typeof window !== 'undefined') {
          const savedToken = localStorage.getItem('auth_token') || localStorage.getItem('creator_token') || localStorage.getItem('admin_token');
          const savedUserStr = localStorage.getItem('auth_user');
          
          if (savedToken && isMounted) {
            setToken(savedToken);
            if (savedUserStr) {
              try {
                setUser(JSON.parse(savedUserStr));
              } catch {
                setUser(null);
              }
            }
          }
        }
      } catch (err) {
        console.warn('Auth session check error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen for real-time Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        const mappedUser = await resolveAuthoritativeUser(session.user);

        setToken(session.access_token);
        setUser(mappedUser);
        setIsLoading(false);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', session.access_token);
          localStorage.setItem('auth_user', JSON.stringify(mappedUser));
          if (mappedUser.role === 'ADMIN') {
            localStorage.setItem('admin_token', session.access_token);
          } else {
            localStorage.setItem('creator_token', session.access_token);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // ONLY clear auth on explicit SIGNED_OUT event, not on INITIAL_SESSION or background refresh
        setToken(null);
        setUser(null);
        setIsLoading(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('creator_token');
          localStorage.removeItem('admin_token');
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setIsLoading(false);
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

  const signInWithSupabase = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.session && data?.user) {
        let role: User['role'] = 'CREATOR';
        let name = data.user.user_metadata?.name || email.split('@')[0];

        try {
          const { data: userRow } = await supabase
            .from('users')
            .select('role, name')
            .eq('id', data.user.id)
            .maybeSingle();

          if (userRow) {
            if (userRow.role) role = userRow.role.toUpperCase() as User['role'];
            if (userRow.name) name = userRow.name;
          }
        } catch {}

        const mappedUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          name,
          role
        };
        login(data.session.access_token, mappedUser);
        return { success: true, user: mappedUser };
      }

      return { success: false, error: 'Login succeeded but no active session was returned.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during sign in.' };
    }
  };

  const signUpWithSupabase = async (email: string, password: string, name: string, role: User['role'] = 'CREATOR') => {
    try {
      // Security enforcement: Client signups are NEVER allowed to self-assign ADMIN role.
      const safeRole: User['role'] = role === 'ADMIN' ? 'CREATOR' : (role || 'CREATOR');

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            role: safeRole
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const mappedUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || name,
          role: safeRole
        };

        if (data.session) {
          login(data.session.access_token, mappedUser);
        }

        return { success: true, user: mappedUser };
      }

      return { success: false, error: 'Registration succeeded, please check your inbox to confirm your email or sign in.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during registration.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signout warning:', err);
    }
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
        signInWithSupabase,
        signUpWithSupabase,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading
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
