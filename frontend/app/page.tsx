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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl mb-6">
            {/* Client Logo */}
            <img 
              src="/images/logo.jpg" 
              alt="Company Logo" 
              className="w-16 h-16 object-contain rounded-2xl"
              onError={(e) => {
                // Fallback to emoji if logo not found
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <span className="text-3xl font-bold text-white" style={{display: 'none'}}>🎓</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Knowledge and Skills Hub
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Educational Management System
          </p>
        </div>
        
        {/* Login Form Card */}
        <div className="card backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl">
          <LoginForm />
        </div>
        
        {/* Test Credentials */}
        <div className="mt-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <p className="text-gray-700 font-semibold mb-3">🧪 Test Credentials</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 rounded-xl p-3">
                <span className="font-semibold text-blue-700">Admin:</span>
                <p className="font-mono text-blue-600">admin / admin</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <span className="font-semibold text-green-700">Teacher:</span>
                <p className="font-mono text-green-600">teacher / teacher</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3">
                <span className="font-semibold text-purple-700">Student:</span>
                <p className="font-mono text-purple-600">student / student</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3">
                <span className="font-semibold text-orange-700">Parent:</span>
                <p className="font-mono text-orange-600">parent / parent</p>
              </div>
                         </div>
           </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 text-6xl opacity-10 animate-bounce">📚</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-10 animate-bounce animation-delay-1000">✏️</div>
      <div className="absolute top-1/2 left-10 text-4xl opacity-10 animate-pulse">🎯</div>
    </div>
  );
}
