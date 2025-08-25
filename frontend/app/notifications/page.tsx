'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Bell, 
  Check, 
  X, 
  Filter,
  Trash2,
  BookOpen,
  Calendar,
  Users,
  AlertCircle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: number;
  type: 'assignment' | 'class' | 'user' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showRead, setShowRead] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: 'assignment',
        title: 'New Assignment Posted',
        message: 'Math homework has been assigned by Sarah Johnson',
        timestamp: '2 minutes ago',
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'class',
        title: 'Class Reminder',
        message: 'Advanced Physics class starts in 15 minutes',
        timestamp: '10 minutes ago',
        read: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'user',
        title: 'New Student Enrolled',
        message: 'Mike Chen has joined your class',
        timestamp: '1 hour ago',
        read: true,
        priority: 'low'
      },
      {
        id: 4,
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2 AM',
        timestamp: '3 hours ago',
        read: true,
        priority: 'medium'
      },
      {
        id: 5,
        type: 'reminder',
        title: 'Assignment Due Soon',
        message: 'English essay is due tomorrow at 11:59 PM',
        timestamp: '5 hours ago',
        read: false,
        priority: 'high'
      },
      {
        id: 6,
        type: 'assignment',
        title: 'Assignment Submitted',
        message: 'Science project submitted by Emily Davis',
        timestamp: '1 day ago',
        read: true,
        priority: 'low'
      },
      {
        id: 7,
        type: 'class',
        title: 'Class Cancelled',
        message: 'Chemistry lab has been cancelled due to equipment maintenance',
        timestamp: '2 days ago',
        read: true,
        priority: 'medium'
      },
      {
        id: 8,
        type: 'system',
        title: 'Password Expiry',
        message: 'Your password will expire in 7 days. Please update it.',
        timestamp: '3 days ago',
        read: false,
        priority: 'high'
      }
    ];
    
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'class': return <Calendar className="w-5 h-5 text-green-600" />;
      case 'user': return <Users className="w-5 h-5 text-purple-600" />;
      case 'system': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'reminder': return <Clock className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesReadStatus = showRead || !notification.read;
    return matchesFilter && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">Stay updated with important alerts and messages</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.timestamp.includes('minutes ago') || n.timestamp.includes('hour ago')).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Type Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="assignment">Assignments</option>
              <option value="class">Classes</option>
              <option value="user">Users</option>
              <option value="system">System</option>
              <option value="reminder">Reminders</option>
            </select>
            
            {/* Read Status Filter */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showRead}
                onChange={(e) => setShowRead(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show read notifications</span>
            </label>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading notifications...</span>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-6 hover:bg-gray-50 transition-colors border-l-4",
                    getPriorityColor(notification.priority),
                    !notification.read && "bg-blue-50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className={cn(
                            "text-sm font-medium",
                            notification.read ? "text-gray-900" : "text-gray-900 font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
