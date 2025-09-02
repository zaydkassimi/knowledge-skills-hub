'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  FileText,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Flag,
  User,
  Timer
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  maxPoints: number;
  status: 'pending' | 'submitted' | 'overdue' | 'graded';
  priority: 'low' | 'medium' | 'high';
  type: 'homework' | 'quiz' | 'project' | 'essay' | 'lab';
  attachments: string[];
  submission?: {
    submittedDate: string;
    files: string[];
    notes?: string;
    grade?: number;
    feedback?: string;
  };
}

interface Quiz {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  dueDate: string;
  duration: number; // in minutes
  questionsCount: number;
  maxPoints: number;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  type: 'practice' | 'graded';
}

export default function StudentAssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState<'assignments' | 'quizzes'>('assignments');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [loading, setLoading] = useState(true);

  // Check if user is student
  if (user?.role !== 'student') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  useEffect(() => {
    loadAssignmentsData();
  }, []);

  const loadAssignmentsData = () => {
    try {
      // Load assignments from localStorage or use mock data
      const savedAssignments = localStorage.getItem('student_assignments');
      if (savedAssignments) {
        setAssignments(JSON.parse(savedAssignments));
      } else {
        // Mock assignments
        const mockAssignments: Assignment[] = [
          {
            id: 1,
            title: 'Algebra Problem Set 5',
            subject: 'Mathematics',
            teacher: 'Mr. John Smith',
            description: 'Complete problems 1-20 from Chapter 8. Show all work and explain your reasoning for word problems.',
            dueDate: '2024-01-18T23:59:00',
            assignedDate: '2024-01-10T09:00:00',
            maxPoints: 100,
            status: 'pending',
            priority: 'high',
            type: 'homework',
            attachments: ['algebra-chapter8.pdf', 'answer-sheet.pdf']
          },
          {
            id: 2,
            title: 'Shakespeare Essay: Hamlet Analysis',
            subject: 'English Literature',
            teacher: 'Ms. Sarah Johnson',
            description: 'Write a 1500-word essay analyzing the theme of revenge in Hamlet. Include at least 5 citations.',
            dueDate: '2024-01-20T23:59:00',
            assignedDate: '2024-01-05T10:30:00',
            maxPoints: 150,
            status: 'pending',
            priority: 'medium',
            type: 'essay',
            attachments: ['essay-guidelines.pdf', 'hamlet-text.pdf']
          },
          {
            id: 3,
            title: 'Chemistry Lab Report - Titration',
            subject: 'Science',
            teacher: 'Dr. Michael Brown',
            description: 'Submit your lab report including hypothesis, procedure, observations, calculations, and conclusion.',
            dueDate: '2024-01-16T23:59:00',
            assignedDate: '2024-01-08T13:00:00',
            maxPoints: 75,
            status: 'overdue',
            priority: 'high',
            type: 'lab',
            attachments: ['lab-template.docx']
          },
          {
            id: 4,
            title: 'World War II Timeline Project',
            subject: 'History',
            teacher: 'Ms. Rachel White',
            description: 'Create a detailed timeline of major WWII events. Include images and brief descriptions.',
            dueDate: '2024-01-25T23:59:00',
            assignedDate: '2024-01-12T15:00:00',
            maxPoints: 200,
            status: 'submitted',
            priority: 'low',
            type: 'project',
            attachments: ['project-rubric.pdf'],
            submission: {
              submittedDate: '2024-01-15T20:30:00',
              files: ['wwii-timeline.pdf', 'sources.docx'],
              notes: 'I included extra information about the Pacific Theater as discussed in class.',
              grade: 185,
              feedback: 'Excellent work! Very comprehensive timeline with great attention to detail. Well sourced and presented.'
            }
          },
          {
            id: 5,
            title: 'French Vocabulary Quiz Preparation',
            subject: 'French',
            teacher: 'Mme. Claire Dubois',
            description: 'Study vocabulary from Units 3-4. Quiz covers 50 words including verbs, nouns, and adjectives.',
            dueDate: '2024-01-19T09:00:00',
            assignedDate: '2024-01-14T11:00:00',
            maxPoints: 50,
            status: 'pending',
            priority: 'medium',
            type: 'quiz',
            attachments: ['vocab-list.pdf', 'practice-exercises.pdf']
          }
        ];
        setAssignments(mockAssignments);
        localStorage.setItem('student_assignments', JSON.stringify(mockAssignments));
      }

      // Load quizzes
      const savedQuizzes = localStorage.getItem('student_quizzes');
      if (savedQuizzes) {
        setQuizzes(JSON.parse(savedQuizzes));
      } else {
        // Mock quizzes
        const mockQuizzes: Quiz[] = [
          {
            id: 1,
            title: 'Quadratic Equations Quiz',
            subject: 'Mathematics',
            teacher: 'Mr. John Smith',
            description: 'Test your understanding of solving quadratic equations using various methods.',
            dueDate: '2024-01-17T15:30:00',
            duration: 45,
            questionsCount: 15,
            maxPoints: 75,
            attempts: 0,
            maxAttempts: 2,
            status: 'pending',
            type: 'graded'
          },
          {
            id: 2,
            title: 'Cell Biology Practice Quiz',
            subject: 'Science',
            teacher: 'Dr. Michael Brown',
            description: 'Practice quiz on cell structure and function. Unlimited attempts for practice.',
            dueDate: '2024-01-22T23:59:00',
            duration: 30,
            questionsCount: 20,
            maxPoints: 100,
            attempts: 1,
            maxAttempts: -1, // unlimited
            status: 'pending',
            type: 'practice'
          },
          {
            id: 3,
            title: 'Poetry Analysis Quiz',
            subject: 'English Literature',
            teacher: 'Ms. Sarah Johnson',
            description: 'Quiz on poetic devices and analysis techniques covered in recent lessons.',
            dueDate: '2024-01-16T10:30:00',
            duration: 60,
            questionsCount: 25,
            maxPoints: 125,
            attempts: 2,
            maxAttempts: 2,
            status: 'completed',
            type: 'graded'
          }
        ];
        setQuizzes(mockQuizzes);
        localStorage.setItem('student_quizzes', JSON.stringify(mockQuizzes));
      }

    } catch (error) {
      console.error('Error loading assignments data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionModal(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSubmissionFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSubmissionFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submitAssignment = () => {
    if (selectedAssignment) {
      const updatedAssignments = assignments.map(a => 
        a.id === selectedAssignment.id 
          ? {
              ...a,
              status: 'submitted' as const,
              submission: {
                submittedDate: new Date().toISOString(),
                files: submissionFiles.map(f => f.name),
                notes: submissionNotes
              }
            }
          : a
      );
      setAssignments(updatedAssignments);
      localStorage.setItem('student_assignments', JSON.stringify(updatedAssignments));
      
      setShowSubmissionModal(false);
      setSelectedAssignment(null);
      setSubmissionFiles([]);
      setSubmissionNotes('');
      toast.success('Assignment submitted successfully!');
    }
  };

  const startQuiz = (quiz: Quiz) => {
    toast.success(`Starting ${quiz.title}...`);
    // In a real app, this would navigate to the quiz interface
    // For now, simulate starting the quiz
    const updatedQuizzes = quizzes.map(q =>
      q.id === quiz.id ? { ...q, status: 'in_progress' as const } : q
    );
    setQuizzes(updatedQuizzes);
    localStorage.setItem('student_quizzes', JSON.stringify(updatedQuizzes));
  };

  const viewAssignmentDetails = (assignment: Assignment) => {
    toast.success(`Viewing details for ${assignment.title}`);
    // In a real app, this would open a detailed view modal
    // For now, just show a success message
  };

  const viewQuizDetails = (quiz: Quiz) => {
    toast.success(`Viewing details for ${quiz.title}`);
    // In a real app, this would open a detailed view modal
    // For now, just show a success message
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'graded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-green-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'homework': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'quiz': return <Timer className="w-5 h-5 text-purple-600" />;
      case 'project': return <Star className="w-5 h-5 text-yellow-600" />;
      case 'essay': return <FileText className="w-5 h-5 text-green-600" />;
      case 'lab': return <Eye className="w-5 h-5 text-orange-600" />;
      default: return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSubject && matchesSearch;
  });

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || quiz.subject === subjectFilter;
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSubject && matchesSearch;
  });

  const subjects = Array.from(new Set([...assignments.map(a => a.subject), ...quizzes.map(q => q.subject)]));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homework & Assignments</h1>
            <p className="text-gray-600">Manage your assignments, homework, and quizzes</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments.filter(a => a.status === 'overdue').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Timer className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quizzes Available</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {quizzes.filter(q => q.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('assignments')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assignments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Assignments & Homework
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'quizzes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Timer className="h-4 w-4" />
                Quizzes & Tests
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
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
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="overdue">Overdue</option>
                  <option value="graded">Graded</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'assignments' ? (
              <div className="space-y-4">
                {filteredAssignments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No assignments found</p>
                  </div>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <div key={assignment.id} className={`p-6 rounded-lg border-l-4 ${getPriorityColor(assignment.priority)} bg-white border border-gray-200 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            {getTypeIcon(assignment.type)}
                            <h3 className="ml-2 text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                              {assignment.status}
                            </span>
                            {assignment.priority === 'high' && (
                              <Flag className="ml-2 w-4 h-4 text-red-500" />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                              <BookOpen className="w-4 h-4 mr-2" />
                              <span>{assignment.subject}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              <span>{assignment.teacher}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Star className="w-4 h-4 mr-2" />
                              <span>{assignment.maxPoints} points</span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">{assignment.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</span>
                              </div>
                              <div className={`flex items-center ${isOverdue(assignment.dueDate) ? 'text-red-600' : ''}`}>
                                <Clock className="w-4 h-4 mr-1" />
                                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                {!isOverdue(assignment.dueDate) && (
                                  <span className="ml-1">({getDaysUntilDue(assignment.dueDate)} days)</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {assignment.attachments.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
                              <div className="flex flex-wrap gap-2">
                                {assignment.attachments.map((file, index) => (
                                  <button
                                    key={index}
                                    className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    {file}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {assignment.submission && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg">
                              <h4 className="text-sm font-medium text-green-900 mb-2">Submission Details:</h4>
                              <div className="text-sm text-green-800">
                                <p>Submitted: {new Date(assignment.submission.submittedDate).toLocaleString()}</p>
                                {assignment.submission.files.length > 0 && (
                                  <p>Files: {assignment.submission.files.join(', ')}</p>
                                )}
                                {assignment.submission.notes && (
                                  <p>Notes: {assignment.submission.notes}</p>
                                )}
                                {assignment.submission.grade && (
                                  <p className="font-medium">Grade: {assignment.submission.grade}/{assignment.maxPoints}</p>
                                )}
                                {assignment.submission.feedback && (
                                  <p className="mt-2 p-2 bg-white rounded border">
                                    <strong>Feedback:</strong> {assignment.submission.feedback}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          {assignment.status === 'pending' && (
                            <button
                              onClick={() => handleSubmitAssignment(assignment)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Submit
                            </button>
                          )}
                          <button 
                            onClick={() => viewAssignmentDetails(assignment)}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuizzes.length === 0 ? (
                  <div className="text-center py-12">
                    <Timer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No quizzes found</p>
                  </div>
                ) : (
                  filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="p-6 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <Timer className="w-5 h-5 text-purple-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)}`}>
                              {quiz.status}
                            </span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              quiz.type === 'graded' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {quiz.type}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                              <BookOpen className="w-4 h-4 mr-2" />
                              <span>{quiz.subject}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              <span>{quiz.teacher}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{quiz.duration} minutes</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Star className="w-4 h-4 mr-2" />
                              <span>{quiz.maxPoints} points</span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">{quiz.description}</p>

                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                              <span>{quiz.questionsCount} questions</span>
                              <span>
                                Attempts: {quiz.attempts}/{quiz.maxAttempts === -1 ? '∞' : quiz.maxAttempts}
                              </span>
                            </div>
                            <div className={`flex items-center ${isOverdue(quiz.dueDate) ? 'text-red-600' : ''}`}>
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          {quiz.status === 'pending' && (quiz.maxAttempts === -1 || quiz.attempts < quiz.maxAttempts) && (
                            <button
                              onClick={() => startQuiz(quiz)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                            >
                              <Timer className="w-4 h-4 mr-2" />
                              Start Quiz
                            </button>
                          )}
                          <button 
                            onClick={() => viewQuizDetails(quiz)}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submission Modal */}
        {showSubmissionModal && selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Submit Assignment: {selectedAssignment.title}
                  </h3>
                  <button 
                    onClick={() => setShowSubmissionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Files
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Click to upload files
                      </label>
                      <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                    </div>
                    
                    {submissionFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                        <div className="space-y-2">
                          {submissionFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submission Notes (Optional)
                    </label>
                    <textarea
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add any notes about your submission..."
                    />
                  </div>

                  {/* Assignment Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Assignment Details:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Subject:</strong> {selectedAssignment.subject}</p>
                      <p><strong>Teacher:</strong> {selectedAssignment.teacher}</p>
                      <p><strong>Due Date:</strong> {new Date(selectedAssignment.dueDate).toLocaleString()}</p>
                      <p><strong>Points:</strong> {selectedAssignment.maxPoints}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowSubmissionModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitAssignment}
                    disabled={submissionFiles.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
