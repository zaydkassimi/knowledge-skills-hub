'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Filter,
  Download,
  X,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: 'active' | 'completed' | 'overdue';
  submissions: number;
  totalStudents: number;
  grade: number | null;
  teacherName: string;
  createdAt: string;
}

interface NewAssignment {
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  totalStudents: number;
}

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState<NewAssignment>({
    title: '',
    description: '',
    subject: 'Mathematics',
    dueDate: '',
    totalStudents: 20
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockAssignments: Assignment[] = [
      {
        id: 1,
        title: 'Math Homework - Chapter 5',
        description: 'Complete exercises 1-20 from Chapter 5. Show all work.',
        subject: 'Mathematics',
        dueDate: '2024-01-25',
        status: 'overdue',
        submissions: 15,
        totalStudents: 20,
        grade: null,
        teacherName: 'Sarah Johnson',
        createdAt: '2024-01-20'
      },
      {
        id: 2,
        title: 'English Essay - Shakespeare',
        description: 'Write a 1000-word essay analyzing themes in Macbeth.',
        subject: 'English',
        dueDate: '2024-01-22',
        status: 'overdue',
        submissions: 18,
        totalStudents: 20,
        grade: 85,
        teacherName: 'David Wilson',
        createdAt: '2024-01-15'
      },
      {
        id: 3,
        title: 'Science Lab Report',
        description: 'Complete lab report for the chemistry experiment.',
        subject: 'Science',
        dueDate: '2024-01-28',
        status: 'active',
        submissions: 8,
        totalStudents: 20,
        grade: null,
        teacherName: 'Emily Davis',
        createdAt: '2024-01-18'
      },
      {
        id: 4,
        title: 'History Research Paper',
        description: 'Research paper on World War II events.',
        subject: 'History',
        dueDate: '2024-01-20',
        status: 'completed',
        submissions: 20,
        totalStudents: 20,
        grade: 92,
        teacherName: 'Michael Chen',
        createdAt: '2024-01-10'
      },
      {
        id: 5,
        title: 'Physics Problem Set',
        description: 'Solve problems 1-15 from the textbook.',
        subject: 'Physics',
        dueDate: '2024-01-30',
        status: 'active',
        submissions: 12,
        totalStudents: 20,
        grade: null,
        teacherName: 'Lisa Brown',
        createdAt: '2024-01-22'
      }
    ];
    
    setTimeout(() => {
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine status based on due date
      const isOverdue = new Date(newAssignment.dueDate) < new Date();
      const status: 'active' | 'completed' | 'overdue' = isOverdue ? 'overdue' : 'active';
      
      // Create new assignment
      const newAssignmentData: Assignment = {
        id: assignments.length + 1,
        title: newAssignment.title,
        description: newAssignment.description,
        subject: newAssignment.subject,
        dueDate: newAssignment.dueDate,
        status: status,
        submissions: 0,
        totalStudents: newAssignment.totalStudents,
        grade: null,
        teacherName: user?.name || 'Unknown Teacher',
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Add to assignments list
      setAssignments([...assignments, newAssignmentData]);

      // Reset form
      setNewAssignment({
        title: '',
        description: '',
        subject: 'Mathematics',
        dueDate: '',
        totalStudents: 20
      });
      setShowCreateModal(false);
      
      // Show success message
      alert('Assignment created successfully!');
    } catch (error) {
      alert('Error creating assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return 'bg-purple-100 text-purple-800';
      case 'English': return 'bg-blue-100 text-blue-800';
      case 'Science': return 'bg-green-100 text-green-800';
      case 'History': return 'bg-orange-100 text-orange-800';
      case 'Physics': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  // Calculate stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const activeAssignments = assignments.filter(a => a.status === 'active').length;
  const overdueAssignments = assignments.filter(a => a.status === 'overdue').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600 mt-1">
              {isTeacher ? 'Manage and track student assignments' : 'View and submit your assignments'}
            </p>
          </div>
          {isTeacher && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedAssignments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeAssignments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdueAssignments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Physics">Physics</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading assignments...</span>
              </div>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-500">No assignments match your criteria.</p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColor(assignment.status))}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getSubjectColor(assignment.subject))}>
                        {assignment.subject}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className={assignment.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      {assignment.status === 'overdue' && ' (Overdue)'}
                    </span>
                  </div>
                  
                  {assignment.status !== 'completed' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Submissions</span>
                      <span className="font-medium">{assignment.submissions}/{assignment.totalStudents}</span>
                    </div>
                  )}
                  
                  {assignment.status !== 'completed' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {isTeacher && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => alert(`View assignment: ${assignment.title}`)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="View Assignment"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert(`Edit assignment: ${assignment.title}`)}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                          title="Edit Assignment"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert(`Download assignment: ${assignment.title}`)}
                          className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50"
                          title="Download Assignment"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Assignment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Assignment</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter assignment title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter assignment description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    required
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Students
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newAssignment.totalStudents}
                    onChange={(e) => setNewAssignment({...newAssignment, totalStudents: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter number of students"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
