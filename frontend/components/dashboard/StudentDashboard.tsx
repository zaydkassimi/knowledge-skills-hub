'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Upload, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  isSubmitted: boolean;
  grade?: number;
}

interface Class {
  id: number;
  subject: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setAssignments([
        {
          id: 1,
          title: 'Algebra Homework #5',
          description: 'Complete problems 1-20 in Chapter 3',
          dueDate: '2024-01-15',
          isSubmitted: true,
          grade: 95,
        },
        {
          id: 2,
          title: 'Geometry Quiz',
          description: 'Review chapters 5-7 for the quiz',
          dueDate: '2024-01-20',
          isSubmitted: false,
        },
      ]);

      setClasses([
        {
          id: 1,
          subject: 'Mathematics',
          startTime: '2024-01-10T09:00:00',
          endTime: '2024-01-10T10:00:00',
          meetingLink: 'https://zoom.us/j/123456789',
        },
        {
          id: 2,
          subject: 'Mathematics',
          startTime: '2024-01-12T14:00:00',
          endTime: '2024-01-12T15:00:00',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-purple-100">
          Grade: {user?.grade} • Track your assignments and join your classes from here.
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
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.isSubmitted).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Classes</p>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">My Assignments</h3>
        
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                  {assignment.isSubmitted && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                {assignment.grade && (
                  <p className="text-sm text-green-600 mt-1">
                    Grade: {assignment.grade}%
                  </p>
                )}
              </div>
              <div className="ml-4">
                {assignment.isSubmitted ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Submitted
                  </span>
                ) : (
                  <button className="btn-primary flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classes Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">My Classes</h3>
        
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
                  className="btn-primary text-sm"
                >
                  Join Class
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
