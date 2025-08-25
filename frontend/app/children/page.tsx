'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, 
  Search, 
  Eye, 
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Child {
  id: number;
  name: string;
  grade: string;
  age: number;
  photo: string;
  email: string;
  phone: string;
  averageGrade: number;
  attendance: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  recentGrades: Array<{
    subject: string;
    grade: number;
    date: string;
  }>;
  upcomingAssignments: Array<{
    title: string;
    subject: string;
    dueDate: string;
  }>;
  teachers: Array<{
    name: string;
    subject: string;
    email: string;
  }>;
}

export default function ChildrenPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockChildren: Child[] = [
      {
        id: 1,
        name: 'Mike Chen',
        grade: '10th Grade',
        age: 16,
        photo: '',
        email: 'mike.chen@student.com',
        phone: '+1 (555) 123-4567',
        averageGrade: 87.5,
        attendance: 95,
        assignmentsCompleted: 18,
        totalAssignments: 20,
        recentGrades: [
          { subject: 'Mathematics', grade: 92, date: '2024-01-20' },
          { subject: 'English', grade: 88, date: '2024-01-18' },
          { subject: 'Science', grade: 85, date: '2024-01-15' },
          { subject: 'History', grade: 91, date: '2024-01-12' }
        ],
        upcomingAssignments: [
          { title: 'Physics Lab Report', subject: 'Physics', dueDate: '2024-01-28' },
          { title: 'English Essay', subject: 'English', dueDate: '2024-01-30' }
        ],
        teachers: [
          { name: 'Sarah Johnson', subject: 'Mathematics', email: 'sarah.johnson@school.com' },
          { name: 'David Wilson', subject: 'English', email: 'david.wilson@school.com' },
          { name: 'Emily Davis', subject: 'Science', email: 'emily.davis@school.com' }
        ]
      },
      {
        id: 2,
        name: 'Emily Chen',
        grade: '8th Grade',
        age: 14,
        photo: '',
        email: 'emily.chen@student.com',
        phone: '+1 (555) 234-5678',
        averageGrade: 91.2,
        attendance: 98,
        assignmentsCompleted: 15,
        totalAssignments: 15,
        recentGrades: [
          { subject: 'Mathematics', grade: 95, date: '2024-01-22' },
          { subject: 'English', grade: 89, date: '2024-01-20' },
          { subject: 'Science', grade: 93, date: '2024-01-18' },
          { subject: 'History', grade: 88, date: '2024-01-15' }
        ],
        upcomingAssignments: [
          { title: 'Math Quiz', subject: 'Mathematics', dueDate: '2024-01-29' }
        ],
        teachers: [
          { name: 'Lisa Brown', subject: 'Mathematics', email: 'lisa.brown@school.com' },
          { name: 'Michael Chen', subject: 'English', email: 'michael.chen@school.com' }
        ]
      }
    ];
    
    setTimeout(() => {
      setChildren(mockChildren);
      setLoading(false);
    }, 1000);
  }, []);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'text-green-600';
    if (attendance >= 90) return 'text-blue-600';
    if (attendance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredChildren = children.filter(child => 
    child.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'parent') {
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
            <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
            <p className="text-gray-600 mt-1">Monitor your children's academic progress and performance</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search children..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading children data...</span>
              </div>
            </div>
          ) : filteredChildren.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No children found</h3>
              <p className="text-gray-500">No children match your search criteria.</p>
            </div>
          ) : (
            filteredChildren.map((child) => (
              <div key={child.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Child Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                        {child.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{child.name}</h3>
                        <p className="text-gray-600">{child.grade} • Age {child.age}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedChild(selectedChild?.id === child.id ? null : child)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold", getGradeColor(child.averageGrade))}>
                        {child.averageGrade}%
                      </div>
                      <div className="text-sm text-gray-600">Average Grade</div>
                    </div>
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold", getAttendanceColor(child.attendance))}>
                        {child.attendance}%
                      </div>
                      <div className="text-sm text-gray-600">Attendance</div>
                    </div>
                  </div>

                  {/* Assignment Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Assignments Completed</span>
                      <span>{child.assignmentsCompleted}/{child.totalAssignments}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(child.assignmentsCompleted / child.totalAssignments) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Recent Grades */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Grades</h4>
                    <div className="space-y-2">
                      {child.recentGrades.slice(0, 3).map((grade, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{grade.subject}</span>
                          <span className={cn("font-medium", getGradeColor(grade.grade))}>
                            {grade.grade}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      <span>{child.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      <span>{child.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedChild?.id === child.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* Upcoming Assignments */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Upcoming Assignments</h4>
                      <div className="space-y-2">
                        {child.upcomingAssignments.map((assignment, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{assignment.title}</div>
                              <div className="text-gray-600">{assignment.subject}</div>
                            </div>
                            <div className="text-gray-500">
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Teachers */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Teachers</h4>
                      <div className="space-y-2">
                        {child.teachers.map((teacher, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{teacher.name}</div>
                              <div className="text-gray-600">{teacher.subject}</div>
                            </div>
                            <a 
                              href={`mailto:${teacher.email}`}
                              className="text-blue-600 hover:text-blue-900 text-xs"
                            >
                              Contact
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
