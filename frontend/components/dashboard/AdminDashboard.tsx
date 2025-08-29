'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, BarChart3, Plus, TrendingUp, Activity, Clock, X, Mail, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalUsers: number;
  teachers: number;
  students: number;
  parents: number;
  reports: number;
  classes: number;
}

interface RecentActivity {
  id: number;
  action: string;
  timestamp: string;
  user: string;
  type: 'success' | 'info' | 'warning';
}

interface NewUser {
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  phone?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    role: 'student',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setStats({
        totalUsers: 45,
        teachers: 12,
        students: 28,
        parents: 25,
        reports: 67,
        classes: 34
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-user':
        setShowAddUserModal(true);
        break;
      case 'generate-reports':
        router.push('/reports');
        break;
      case 'schedule-meeting':
        router.push('/classes');
        break;
      default:
        break;
    }
  };

  const handleViewAllActivity = () => {
    router.push('/notifications');
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          totalUsers: stats.totalUsers + 1,
          [newUser.role + 's']: stats[newUser.role + 's' as keyof DashboardStats] as number + 1
        });
      }

      // Reset form
      setNewUser({
        name: '',
        email: '',
        role: 'student',
        phone: ''
      });
      setShowAddUserModal(false);
      
      // Show success message (you can add toast notification here)
      alert('User created successfully!');
    } catch (error) {
      alert('Error creating user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const recentActivities: RecentActivity[] = [
    { id: 1, action: 'New teacher account created', timestamp: '2 minutes ago', user: 'Sarah Johnson', type: 'success' },
    { id: 2, action: 'Student enrollment completed', timestamp: '15 minutes ago', user: 'Mike Chen', type: 'info' },
    { id: 3, action: 'Assignment submission received', timestamp: '1 hour ago', user: 'Emily Davis', type: 'warning' },
    { id: 4, action: 'Parent meeting scheduled', timestamp: '2 hours ago', user: 'David Wilson', type: 'info' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'info': return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
      case 'warning': return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      default: return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, Administrator! 👋</h1>
            <p className="text-blue-100">Manage your educational institution from this central dashboard</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          onClick={() => router.push('/users')}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% from last month
          </div>
        </div>

        <div 
          onClick={() => router.push('/teachers')}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.teachers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +3 new this month
          </div>
        </div>

        <div 
          onClick={() => router.push('/students')}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.students}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +8 enrolled this month
          </div>
        </div>

        <div 
          onClick={() => router.push('/parents')}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Parents</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.parents}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5 new registrations
          </div>
        </div>

        <div 
          onClick={() => router.push('/reports')}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.reports}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +15 this week
          </div>
        </div>

        <div 
          onClick={() => router.push('/classes')}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-cyan-300 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.classes}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
              <Calendar className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +7 scheduled today
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('add-user')}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Add New User</span>
            </button>
            <button 
              onClick={() => handleQuickAction('generate-reports')}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer"
            >
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Generate Reports</span>
            </button>
            <button 
              onClick={() => handleQuickAction('schedule-meeting')}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Schedule Meeting</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.timestamp}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={handleViewAllActivity}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              View all activity →
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  required
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
