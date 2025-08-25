'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Initialize Supabase client
const supabaseUrl = 'https://kikorlukqhimxnekdqoo.supabase.co';
const supabaseKey = 'your-anon-key-here'; // You'll need to replace this with your actual anon key
const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'hr_manager' | 'branch_manager';
  teacher_id?: number;
  subject?: string;
  student_id?: number;
  grade?: string;
  parent_id?: number;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure defaults - Don't auto-authenticate
  useEffect(() => {
    // Clear any existing tokens to force login
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Loading timeout reached, setting loading to false');
        setIsLoading(false);
      }
    }, 3000); // Reduced to 3 seconds for faster loading

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For now, let's use a simple authentication system
      // You can replace this with Supabase auth later
      if (email === 'admin' && password === 'admin') {
        const userData: User = {
          id: 1,
          name: 'System Admin',
          email: 'admin@school.com',
          role: 'admin'
        };
        
        const fakeToken = 'fake-jwt-token-' + Date.now();
        
        localStorage.setItem('token', fakeToken);
        setToken(fakeToken);
        setUser(userData);
        
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
