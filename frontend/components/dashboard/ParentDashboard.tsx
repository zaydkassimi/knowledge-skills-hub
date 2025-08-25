'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Child {
  id: number;
  name: string;
  grade: string;
  assignments: Assignment[];
  classes: Class[];
}

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  isSubmitted: boolean;
  grade?: number;
}

interface Class {
  id: number;
  subject: string;
  startTime: string;
  endTime: string;
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setChildren([
        {
          id: 1,
          name: 'Emily Smith',
          grade: '10th Grade',
          assignments: [
            { id: 1, title: 'Algebra Homework #5', dueDate: '2024-01-15', isSubmitted: true, grade: 95 },
            { id: 2, title: 'Geometry Quiz', dueDate: '2024-01-18', isSubmitted: true, grade: 88 },
            { id: 3, title: 'Calculus Assignment', dueDate: '2024-01-20', isSubmitted: false }
          ],
          classes: [
            { id: 1, subject: 'Mathematics', startTime: '2024-01-15T10:00:00', endTime: '2024-01-15T11:30:00' },
            { id: 2, subject: 'Physics', startTime: '2024-01-16T14:00:00', endTime: '2024-01-16T15:30:00' }
          ]
        },
        {
          id: 2,
          name: 'Michael Smith',
          grade: '8th Grade',
          assignments: [
            { id: 4, title: 'Science Project', dueDate: '2024-01-17', isSubmitted: true, grade: 92 },
            { id: 5, title: 'English Essay', dueDate: '2024-01-19', isSubmitted: false }
          ],
          classes: [
            { id: 3, subject: 'Science', startTime: '2024-01-15T13:00:00', endTime: '2024-01-15T14:30:00' },
            { id: 4, subject: 'English', startTime: '2024-01-16T09:00:00', endTime: '2024-01-16T10:30:00' }
          ]
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'progress-reports':
        router.push('/progress');
        break;
      case 'schedule-meeting':
        router.push('/schedule');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalAssignments = children.reduce((sum, child) => sum + child.assignments.length, 0);
  const totalClasses = children.reduce((sum, child) => sum + child.classes.length, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-orange-100">
          Monitor your children's progress and stay connected with their education.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Children</p>
              <p className="text-2xl font-bold text-gray-900">{children.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes</p>
              <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Children Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Children Progress</h3>
        
        <div className="space-y-6">
          {children.map((child) => (
            <div key={child.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{child.name}</h4>
                  <p className="text-sm text-gray-600">{child.grade}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-lg font-bold text-primary-600">
                    {Math.round((child.assignments.filter(a => a.isSubmitted).length / child.assignments.length) * 100)}%
                  </p>
                </div>
              </div>

              {/* Assignments */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-3">Recent Assignments</h5>
                <div className="space-y-2">
                  {child.assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{assignment.title}</span>
                        {assignment.isSubmitted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-gray-500">
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        {assignment.grade && (
                          <span className="text-green-600 font-medium">Grade: {assignment.grade}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classes */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Upcoming Classes</h5>
                <div className="space-y-2">
                  {child.classes.map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{classItem.subject}</span>
                      <span className="text-gray-500">
                        {new Date(classItem.startTime).toLocaleString()} - {new Date(classItem.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleQuickAction('progress-reports')}
            className="btn-secondary flex items-center justify-center cursor-pointer"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Progress Reports
          </button>
          <button 
            onClick={() => handleQuickAction('schedule-meeting')}
            className="btn-primary flex items-center justify-center cursor-pointer"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Parent Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
