'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { user } = useAuth();

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      // On large screens, sidebar should be open by default
      if (large && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        // On large screens, add left margin when sidebar is open
        isLargeScreen && sidebarOpen ? "lg:ml-64" : ""
      )}>
        {/* Header */}
        <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
