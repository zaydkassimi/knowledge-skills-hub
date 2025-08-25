'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Calendar,
  User,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Submission {
  id: number;
  assignmentTitle: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late';
  grade: number | null;
  feedback: string;
  fileName: string;
  fileSize: string;
  subject: string;
}

export default function SubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockSubmissions: Submission[] = [
      {
        id: 1,
        assignmentTitle: 'Math Homework - Chapter 5',
        studentName: 'Mike Chen',
        studentEmail: 'mike.chen@student.com',
        submittedAt: '2024-01-24T10:30:00',
        status: 'graded',
        grade: 87,
        feedback: 'Good work on most problems. Pay attention to problem 15.',
        fileName: 'math_homework_ch5.pdf',
        fileSize: '2.3 MB',
        subject: 'Mathematics'
      },
      {
        id: 2,
        assignmentTitle: 'English Essay - Shakespeare',
        studentName: 'Emily Davis',
        studentEmail: 'emily.davis@student.com',
        submittedAt: '2024-01-21T14:15:00',
        status: 'graded',
        grade: 92,
        feedback: 'Excellent analysis of themes. Well-structured essay.',
        fileName: 'shakespeare_essay.docx',
        fileSize: '1.8 MB',
        subject: 'English'
      },
      {
        id: 3,
        assignmentTitle: 'Science Lab Report',
        studentName: 'Alex Johnson',
        studentEmail: 'alex.johnson@student.com',
        submittedAt: '2024-01-25T09:45:00',
        status: 'submitted',
        grade: null,
        feedback: '',
        fileName: 'chemistry_lab_report.pdf',
        fileSize: '3.1 MB',
        subject: 'Science'
      },
      {
        id: 4,
        assignmentTitle: 'History Research Paper',
        studentName: 'Lisa Brown',
        studentEmail: 'lisa.brown@student.com',
        submittedAt: '2024-01-19T16:20:00',
        status: 'graded',
        grade: 95,
        feedback: 'Outstanding research and presentation. Excellent work!',
        fileName: 'ww2_research_paper.pdf',
        fileSize: '4.2 MB',
        subject: 'History'
      },
      {
        id: 5,
        assignmentTitle: 'Physics Problem Set',
        studentName: 'Tom Wilson',
        studentEmail: 'tom.wilson@student.com',
        submittedAt: '2024-01-26T11:30:00',
        status: 'late',
        grade: null,
        feedback: '',
        fileName: 'physics_problems.pdf',
        fileSize: '1.5 MB',
        subject: 'Physics'
      },
      {
        id: 6,
        assignmentTitle: 'English Essay - Shakespeare',
        studentName: 'Sarah Miller',
        studentEmail: 'sarah.miller@student.com',
        submittedAt: '2024-01-22T13:45:00',
        status: 'graded',
        grade: 78,
        feedback: 'Good effort but needs more depth in analysis.',
        fileName: 'shakespeare_analysis.docx',
        fileSize: '2.1 MB',
        subject: 'English'
      }
    ];
    
    setTimeout(() => {
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-gray-500';
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
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

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || submission.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
            <p className="text-gray-600 mt-1">
              {isTeacher ? 'Review and grade student submissions' : 'View your submitted assignments'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Graded</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'graded').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'submitted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Late Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'late').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="late">Late</option>
            </select>
            
            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading submissions...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No submissions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{submission.assignmentTitle}</div>
                          <div className="text-sm text-gray-500">{submission.fileName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {submission.studentName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                            <div className="text-sm text-gray-500">{submission.studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getSubjectColor(submission.subject)
                        )}>
                          {submission.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getStatusColor(submission.status)
                        )}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.grade !== null ? (
                          <div className="flex items-center">
                            <span className={cn("text-sm font-medium", getGradeColor(submission.grade))}>
                              {submission.grade}%
                            </span>
                            <Star className="w-4 h-4 text-yellow-400 ml-1" />
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not graded</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => alert(`View submission by ${submission.studentName}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" 
                            title="View submission"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert(`Download submission file`)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50" 
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {isTeacher && submission.status === 'submitted' && (
                            <button 
                              onClick={() => alert(`Grade submission by ${submission.studentName}`)}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50" 
                              title="Grade submission"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
