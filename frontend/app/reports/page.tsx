'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Download,
  Filter,
  Calendar as CalendarIcon,
  PieChart,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportData {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalParents: number;
  totalAssignments: number;
  totalClasses: number;
  userGrowth: number;
  assignmentCompletion: number;
  classAttendance: number;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data for demonstration
  useEffect(() => {
    const mockData: ReportData = {
      totalUsers: 125,
      totalTeachers: 18,
      totalStudents: 85,
      totalParents: 22,
      totalAssignments: 156,
      totalClasses: 42,
      userGrowth: 12.5,
      assignmentCompletion: 87.3,
      classAttendance: 94.2
    };
    
    setTimeout(() => {
      setReportData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const exportReport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = [
        ['Metric', 'Value', 'Period'],
        ['Total Users', reportData?.totalUsers || 0, selectedPeriod],
        ['Total Teachers', reportData?.totalTeachers || 0, selectedPeriod],
        ['Total Students', reportData?.totalStudents || 0, selectedPeriod],
        ['Total Parents', reportData?.totalParents || 0, selectedPeriod],
        ['Total Assignments', reportData?.totalAssignments || 0, selectedPeriod],
        ['Total Classes', reportData?.totalClasses || 0, selectedPeriod],
        ['User Growth', `${reportData?.userGrowth || 0}%`, selectedPeriod],
        ['Assignment Completion', `${reportData?.assignmentCompletion || 0}%`, selectedPeriod],
        ['Class Attendance', `${reportData?.classAttendance || 0}%`, selectedPeriod]
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      // PDF export simulation
      alert('PDF export functionality would be implemented here with a PDF library like jsPDF');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'hr_manager' && user.role !== 'branch_manager')) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights and data analysis</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <div className="relative group">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => exportReport('csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => exportReport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : reportData?.totalUsers}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +{reportData?.userGrowth}% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : reportData?.totalTeachers}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +3 new this month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : reportData?.totalStudents}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +8 enrolled this month
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : reportData?.totalAssignments}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  {reportData?.assignmentCompletion}% completion rate
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4" />
                <span>Last 6 months</span>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-sm text-gray-400">User growth over time</p>
              </div>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Role Distribution</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <PieChart className="w-4 h-4" />
                <span>Current</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Teachers</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {reportData ? Math.round((reportData.totalTeachers / reportData.totalUsers) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Students</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {reportData ? Math.round((reportData.totalStudents / reportData.totalUsers) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Parents</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {reportData ? Math.round((reportData.totalParents / reportData.totalUsers) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assignment Completion</h3>
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {loading ? '...' : reportData?.assignmentCompletion}%
              </div>
              <p className="text-sm text-gray-600">Average completion rate</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Class Attendance</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {loading ? '...' : reportData?.classAttendance}%
              </div>
              <p className="text-sm text-gray-600">Average attendance rate</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Classes</h3>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {loading ? '...' : reportData?.totalClasses}
              </div>
              <p className="text-sm text-gray-600">Currently running</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New teacher account created</p>
                <p className="text-xs text-gray-500">Sarah Johnson joined the platform</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Assignment submitted</p>
                <p className="text-xs text-gray-500">Math homework by Mike Chen</p>
              </div>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New class scheduled</p>
                <p className="text-xs text-gray-500">Advanced Physics by Dr. Wilson</p>
              </div>
              <span className="text-xs text-gray-500">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
