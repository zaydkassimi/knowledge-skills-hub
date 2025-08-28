'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  // Force redeploy - Login fix applied - Timestamp: 2025-01-25
  const { user, isLoading } = useAuth();

  // Add a shorter timeout for better UX
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Home page loading timeout');
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          {/* Client Logo */}
          <div className="mb-8">
            <img 
              src="/images/logo.jpg" 
              alt="Company Logo" 
              className="w-32 h-32 object-contain mx-auto rounded-2xl shadow-lg"
              onError={(e) => {
                // Fallback to styled placeholder if logo not found
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg mx-auto flex items-center justify-center" style={{display: 'none'}}>
              <span className="text-4xl text-gray-400">🎓</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Knowledge and Skills Hub
          </h1>
          <p className="text-gray-500 text-lg">
            Educational Management System
          </p>
        </div>
        
        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <LoginForm />
        </div>
        
        {/* Test Credentials */}
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <p className="text-gray-700 font-semibold mb-4">Test Credentials</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <span className="font-semibold text-gray-700">Admin:</span>
                <p className="font-mono text-gray-600">admin / admin</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <span className="font-semibold text-gray-700">Teacher:</span>
                <p className="font-mono text-gray-600">teacher / teacher</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <span className="font-semibold text-gray-700">Student:</span>
                <p className="font-mono text-gray-600">student / student</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <span className="font-semibold text-gray-700">Parent:</span>
                <p className="font-mono text-gray-600">parent / parent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
