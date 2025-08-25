'use client';

import { Bell, User, Settings, Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: any;
  onMenuClick: () => void;
}

export default function Header({ user, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Menu button and title */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button */}
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-bold text-gray-900">
            Knowledge and Skills Hub Dashboard
          </h1>
        </div>

        {/* Right side - Actions and user profile */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button 
            onClick={() => handleNavigation('/notifications')}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button 
            onClick={() => handleNavigation('/settings')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>

          {/* User Profile */}
          <button 
            onClick={() => handleNavigation('/settings')}
            className="flex items-center space-x-3 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <User className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
