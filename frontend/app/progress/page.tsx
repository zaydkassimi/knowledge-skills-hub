'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  TrendingUp, 
  BookOpen, 
  Calendar,
  Award,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Subject {
  name: string;
  grade: number;
  assignments: number;
  completed: number;
  trend: 'up' | 'down' | 'stable';
}

interface Assignment {
  title: string;
  subject: string;
  grade: number;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
}

interface Child {
  id: number;
  name: string;
  grade: string;
  overallGrade: number;
  attendance: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  subjects: Subject[];
  recentAssignments: Assignment[];
}

interface ProgressData {
  overallGrade: number;
  attendance: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  subjects: Subject[];
  recentAssignments: Assignment[];
  monthlyProgress: Array<{
    month: string;
    grade: number;
  }>;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    if (user?.role === 'student') {
      const mockProgressData: ProgressData = {
        overallGrade: 87.5,
        attendance: 95,
        assignmentsCompleted: 18,
        totalAssignments: 20,
        subjects: [
          { name: 'Mathematics', grade: 92, assignments: 5, completed: 5, trend: 'up' },
          { name: 'English', grade: 88, assignments: 4, completed: 4, trend: 'stable' },
          { name: 'Science', grade: 85, assignments: 6, completed: 5, trend: 'up' },
          { name: 'History', grade: 91, assignments: 3, completed: 3, trend: 'up' },
          { name: 'Physics', grade: 82, assignments: 2, completed: 1, trend: 'down' }
        ],
        recentAssignments: [
          { title: 'Math Quiz - Chapter 5', subject: 'Mathematics', grade: 95, dueDate: '2024-01-20', status: 'completed' },
          { title: 'English Essay - Shakespeare', subject: 'English', grade: 88, dueDate: '2024-01-18', status: 'completed' },
          { title: 'Science Lab Report', subject: 'Science', grade: 85, dueDate: '2024-01-15', status: 'completed' },
          { title: 'Physics Problem Set', subject: 'Physics', grade: 78, dueDate: '2024-01-25', status: 'pending' },
          { title: 'History Research Paper', subject: 'History', grade: 91, dueDate: '2024-01-12', status: 'completed' }
        ],
        monthlyProgress: [
          { month: 'Sep', grade: 82 },
          { month: 'Oct', grade: 85 },
          { month: 'Nov', grade: 87 },
          { month: 'Dec', grade: 86 },
          { month: 'Jan', grade: 88 }
        ]
      };
      
      setTimeout(() => {
        setProgressData(mockProgressData);
        setLoading(false);
      }, 1000);
    } else if (user?.role === 'parent') {
      const mockChildren: Child[] = [
        {
          id: 1,
          name: 'Emily Smith',
          grade: '10th Grade',
          overallGrade: 87.5,
          attendance: 95,
          assignmentsCompleted: 18,
          totalAssignments: 20,
          subjects: [
            { name: 'Mathematics', grade: 92, assignments: 5, completed: 5, trend: 'up' },
            { name: 'English', grade: 88, assignments: 4, completed: 4, trend: 'stable' },
            { name: 'Science', grade: 85, assignments: 6, completed: 5, trend: 'up' },
            { name: 'History', grade: 91, assignments: 3, completed: 3, trend: 'up' },
            { name: 'Physics', grade: 82, assignments: 2, completed: 1, trend: 'down' }
          ],
          recentAssignments: [
            { title: 'Math Quiz - Chapter 5', subject: 'Mathematics', grade: 95, dueDate: '2024-01-20', status: 'completed' },
            { title: 'English Essay - Shakespeare', subject: 'English', grade: 88, dueDate: '2024-01-18', status: 'completed' },
            { title: 'Science Lab Report', subject: 'Science', grade: 85, dueDate: '2024-01-15', status: 'completed' },
            { title: 'Physics Problem Set', subject: 'Physics', grade: 78, dueDate: '2024-01-25', status: 'pending' },
            { title: 'History Research Paper', subject: 'History', grade: 91, dueDate: '2024-01-12', status: 'completed' }
          ]
        },
        {
          id: 2,
          name: 'Michael Smith',
          grade: '8th Grade',
          overallGrade: 91.2,
          attendance: 98,
          assignmentsCompleted: 15,
          totalAssignments: 16,
          subjects: [
            { name: 'Mathematics', grade: 94, assignments: 4, completed: 4, trend: 'up' },
            { name: 'English', grade: 89, assignments: 3, completed: 3, trend: 'up' },
            { name: 'Science', grade: 88, assignments: 5, completed: 4, trend: 'stable' },
            { name: 'History', grade: 93, assignments: 2, completed: 2, trend: 'up' },
            { name: 'Art', grade: 92, assignments: 2, completed: 2, trend: 'up' }
          ],
          recentAssignments: [
            { title: 'Science Project', subject: 'Science', grade: 88, dueDate: '2024-01-22', status: 'completed' },
            { title: 'English Essay', subject: 'English', grade: 89, dueDate: '2024-01-19', status: 'completed' },
            { title: 'Math Test', subject: 'Mathematics', grade: 94, dueDate: '2024-01-16', status: 'completed' },
            { title: 'History Quiz', subject: 'History', grade: 93, dueDate: '2024-01-13', status: 'completed' },
            { title: 'Art Assignment', subject: 'Art', grade: 92, dueDate: '2024-01-26', status: 'pending' }
          ]
        }
      ];
      
      setTimeout(() => {
        setChildren(mockChildren);
        setLoading(false);
      }, 1000);
    }
  }, [user?.role]);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100';
    if (grade >= 80) return 'bg-blue-100';
    if (grade >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if user has access to this page
  if (!user || (user.role !== 'student' && user.role !== 'parent')) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading progress data...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render Student Progress
  if (user.role === 'student') {
    if (!progressData) {
      return (
        <DashboardLayout>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
            <p className="text-gray-600">Progress data is not available at the moment.</p>
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
              <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
              <p className="text-gray-600 mt-1">Track your academic performance and achievements</p>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className={cn("p-2 rounded-lg", getGradeBgColor(progressData.overallGrade))}>
                  <Award className={cn("w-6 h-6", getGradeColor(progressData.overallGrade))} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                  <p className={cn("text-2xl font-bold", getGradeColor(progressData.overallGrade))}>
                    {progressData.overallGrade}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">{progressData.attendance}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{progressData.assignmentsCompleted}/{progressData.totalAssignments}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((progressData.assignmentsCompleted / progressData.totalAssignments) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressData.subjects.map((subject, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{subject.name}</h4>
                    {getTrendIcon(subject.trend)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-2xl font-bold", getGradeColor(subject.grade))}>
                      {subject.grade}%
                    </span>
                    <span className="text-sm text-gray-500">
                      {subject.completed}/{subject.assignments} completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Assignments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Assignments</h3>
            <div className="space-y-4">
              {progressData.recentAssignments.map((assignment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-500">{assignment.subject}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColor(assignment.status))}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                    {assignment.grade > 0 ? (
                      <span className={cn("font-semibold", getGradeColor(assignment.grade))}>
                        {assignment.grade}%
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Not graded</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render Parent Progress (Children's Progress)
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Children's Progress</h1>
            <p className="text-gray-600 mt-1">Monitor your children's academic performance and achievements</p>
          </div>
        </div>

        {/* Children Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children.map((child) => (
            <div key={child.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{child.name}</h3>
                  <p className="text-gray-600">{child.grade}</p>
                </div>
                <div className={cn("p-3 rounded-lg", getGradeBgColor(child.overallGrade))}>
                  <Award className={cn("w-6 h-6", getGradeColor(child.overallGrade))} />
                </div>
              </div>

              {/* Overall Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className={cn("text-2xl font-bold", getGradeColor(child.overallGrade))}>
                    {child.overallGrade}%
                  </p>
                  <p className="text-sm text-gray-600">Overall Grade</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{child.attendance}%</p>
                  <p className="text-sm text-gray-600">Attendance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((child.assignmentsCompleted / child.totalAssignments) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Completion</p>
                </div>
              </div>

              {/* Subject Performance */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Subject Performance</h4>
                <div className="space-y-2">
                  {child.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{subject.name}</span>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(subject.trend)}
                        <span className={cn("font-medium", getGradeColor(subject.grade))}>
                          {subject.grade}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Assignments */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent Assignments</h4>
                <div className="space-y-2">
                  {child.recentAssignments.slice(0, 3).map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{assignment.title}</p>
                        <p className="text-gray-500">{assignment.subject}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", getStatusColor(assignment.status))}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </span>
                        {assignment.grade > 0 ? (
                          <span className={cn("font-medium", getGradeColor(assignment.grade))}>
                            {assignment.grade}%
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Not graded</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
