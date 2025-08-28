'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { 
  X, 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  GraduationCap,
  UserCheck,
  Shield,
  Clock,
  Building,
  FileSpreadsheet,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'User Management', href: '/users', icon: Users },
          { name: 'Students', href: '/students', icon: GraduationCap },
          { name: 'Assignments', href: '/assignments', icon: BookOpen },
          { name: 'Classes', href: '/classes', icon: Calendar },
          { name: 'Submissions', href: '/submissions', icon: FileText },
          { name: 'HR Management', href: '/hr', icon: Users },
          { name: 'Waiting List', href: '/waiting-list', icon: Clock },
          { name: 'Branches', href: '/branches', icon: Building },
          { name: 'Google Sheets', href: '/google-sheets', icon: FileSpreadsheet },
          { name: 'Reports', href: '/reports', icon: BarChart3 },
          { name: 'Schedule', href: '/schedule', icon: Calendar },
          { name: 'Settings', href: '/settings', icon: Settings },
          { name: 'Notifications', href: '/notifications', icon: Bell },
        ];
      case 'hr_manager':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'HR Management', href: '/hr', icon: Users },
          { name: 'Waiting List', href: '/waiting-list', icon: Clock },
          { name: 'Reports', href: '/reports', icon: BarChart3 },
          { name: 'Settings', href: '/settings', icon: Settings },
          { name: 'Notifications', href: '/notifications', icon: Bell },
        ];
      case 'branch_manager':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'Branches', href: '/branches', icon: Building },
          { name: 'Waiting List', href: '/waiting-list', icon: Clock },
          { name: 'Students', href: '/students', icon: GraduationCap },
          { name: 'Reports', href: '/reports', icon: BarChart3 },
          { name: 'Settings', href: '/settings', icon: Settings },
          { name: 'Notifications', href: '/notifications', icon: Bell },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'Students', href: '/students', icon: GraduationCap },
          { name: 'Assignments', href: '/assignments', icon: BookOpen },
          { name: 'Classes', href: '/classes', icon: Calendar },
          { name: 'Submissions', href: '/submissions', icon: FileText },
        ];
      case 'student':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'Assignments', href: '/assignments', icon: BookOpen },
          { name: 'Classes', href: '/classes', icon: Calendar },
          { name: 'My Submissions', href: '/submissions', icon: FileText },
        ];
      case 'parent':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: Home },
          { name: 'Children', href: '/children', icon: UserCheck },
          { name: 'Progress', href: '/progress', icon: BarChart3 },
          { name: 'Schedule', href: '/schedule', icon: Calendar },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-5 h-5 text-blue-600" />;
      case 'teacher': return <GraduationCap className="w-5 h-5 text-green-600" />;
      case 'student': return <UserCheck className="w-5 h-5 text-purple-600" />;
      case 'parent': return <Users className="w-5 h-5 text-orange-600" />;
      default: return <UserCheck className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'teacher': return 'bg-green-100 text-green-700 border-green-200';
      case 'student': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'parent': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col",
        // On mobile: hidden when closed, visible when open
        // On large screens: always visible
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {/* Client Logo */}
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/images/logo.jpg" 
                alt="Company Logo" 
                className="w-10 h-10 object-contain rounded-lg"
                style={{
                  imageRendering: 'crisp-edges' as any,
                  WebkitImageRendering: 'crisp-edges' as any,
                  msImageRendering: 'crisp-edges' as any
                }}
                onError={(e) => {
                  // Fallback to emoji if logo not found
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg" style={{display: 'none'}}>
                <span className="text-2xl">🎓</span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Knowledge and Skills Hub</h2>
              <p className="text-xs text-gray-500">Educational Platform</p>
            </div>
          </div>
          {/* Close button - only show on mobile */}
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {getRoleIcon(user?.role || '')}
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full border",
                  getRoleColor(user?.role || '')
                )}>
                  {(user?.role || '').charAt(0).toUpperCase() + (user?.role || '').slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  // Only close sidebar on mobile
                  if (window.innerWidth < 1024) {
                    setOpen(false);
                  }
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-blue-600" : "text-gray-400"
                )} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
