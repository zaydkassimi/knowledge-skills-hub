'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, FileText, Plus, Clock, CheckCircle, MessageSquare, DollarSign, Upload, Download, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
}

interface Class {
  id: number;
  subject: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setAssignments([
        { id: 1, title: 'Algebra Homework #5', dueDate: '2024-01-15', submissions: 18, totalStudents: 25 },
        { id: 2, title: 'Geometry Quiz', dueDate: '2024-01-18', submissions: 22, totalStudents: 25 },
        { id: 3, title: 'Calculus Assignment', dueDate: '2024-01-20', submissions: 15, totalStudents: 25 }
      ]);
      setClasses([
        { id: 1, subject: 'Advanced Mathematics', startTime: '2024-01-15T10:00:00', endTime: '2024-01-15T11:30:00', meetingLink: 'https://zoom.us/j/123456789' },
        { id: 2, subject: 'Calculus Review', startTime: '2024-01-16T14:00:00', endTime: '2024-01-16T15:30:00', meetingLink: 'https://meet.google.com/abc-defg-hij' },
        { id: 3, subject: 'Geometry Class', startTime: '2024-01-17T09:00:00', endTime: '2024-01-17T10:30:00', meetingLink: 'https://zoom.us/j/987654321' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-assignment':
        router.push('/assignments');
        break;
      case 'schedule-class':
        router.push('/classes');
        break;
      case 'view-submissions':
        router.push('/submissions');
        break;
      case 'communicate-parents':
        router.push('/communication/parents');
        break;
      case 'view-payslips':
        router.push('/teacher/payslips');
        break;
      case 'manage-resources':
        router.push('/teacher/resources');
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-green-100">
          Subject: {user?.subject} • Manage your classes and assignments from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled Classes</p>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">25</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button 
            onClick={() => handleQuickAction('new-assignment')}
            className="btn-primary flex items-center justify-center cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </button>
          <button 
            onClick={() => handleQuickAction('schedule-class')}
            className="btn-secondary flex items-center justify-center cursor-pointer"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Class
          </button>
          <button 
            onClick={() => handleQuickAction('view-submissions')}
            className="btn-secondary flex items-center justify-center cursor-pointer"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Submissions
          </button>
          <button 
            onClick={() => handleQuickAction('communicate-parents')}
            className="btn-secondary flex items-center justify-center cursor-pointer"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Parents
          </button>
          <button 
            onClick={() => handleQuickAction('view-payslips')}
            className="btn-secondary flex items-center justify-center cursor-pointer"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            My Payslips
          </button>
          <button 
            onClick={() => handleQuickAction('manage-resources')}
            className="btn-secondary flex items-center justify-center cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            Resources
          </button>
        </div>
      </div>

      {/* Assignments Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Assignments</h3>
          <button 
            onClick={() => handleQuickAction('new-assignment')}
            className="btn-primary flex items-center cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </button>
        </div>
        
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {assignment.submissions}/{assignment.totalStudents} submissions
                </p>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classes Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
          <button 
            onClick={() => handleQuickAction('schedule-class')}
            className="btn-primary flex items-center cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Class
          </button>
        </div>
        
        <div className="space-y-4">
          {classes.map((classItem) => (
            <div key={classItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{classItem.subject}</h4>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(classItem.startTime).toLocaleString()} - {new Date(classItem.endTime).toLocaleTimeString()}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href={classItem.meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  Join Meeting
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
