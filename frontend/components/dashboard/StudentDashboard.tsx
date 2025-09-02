'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  BarChart3, 
  MessageSquare, 
  CreditCard,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  FileText,
  Download,
  Bell,
  Target,
  TrendingUp,
  Star,
  Video,
  MapPin,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpcomingClass {
  id: number;
  subject: string;
  tutor: string;
  time: string;
  date: string;
  location: string;
  type: 'on-site' | 'virtual';
  zoomLink?: string;
}

interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'general' | 'urgent' | 'exam' | 'event';
  from: string;
}

interface GradeRecord {
  id: number;
  subject: string;
  assignment: string;
  grade: string;
  percentage: number;
  date: string;
  feedback?: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recentGrades, setRecentGrades] = useState<GradeRecord[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load student data
    const loadStudentData = () => {
      try {
        // Mock upcoming classes
        const mockClasses: UpcomingClass[] = [
          {
            id: 1,
            subject: 'Mathematics',
            tutor: 'Mr. John Smith',
            time: '09:00 AM',
            date: 'Today',
            location: 'Room 101',
            type: 'on-site'
          },
          {
            id: 2,
            subject: 'English Literature',
            tutor: 'Ms. Sarah Johnson',
            time: '11:30 AM',
            date: 'Today',
            location: 'Online',
            type: 'virtual',
            zoomLink: 'https://zoom.us/j/123456789'
          },
          {
            id: 3,
            subject: 'Science',
            tutor: 'Dr. Michael Brown',
            time: '02:00 PM',
            date: 'Tomorrow',
            location: 'Lab 2',
            type: 'on-site'
          }
        ];
        setUpcomingClasses(mockClasses);

        // Mock assignments
        const mockAssignments: Assignment[] = [
          {
            id: 1,
            title: 'Algebra Problem Set 5',
            subject: 'Mathematics',
            dueDate: '2024-01-18',
            status: 'pending',
            priority: 'high'
          },
          {
            id: 2,
            title: 'Essay: Shakespeare Analysis',
            subject: 'English Literature',
            dueDate: '2024-01-20',
            status: 'pending',
            priority: 'medium'
          },
          {
            id: 3,
            title: 'Chemistry Lab Report',
            subject: 'Science',
            dueDate: '2024-01-16',
            status: 'overdue',
            priority: 'high'
          },
          {
            id: 4,
            title: 'History Timeline Project',
            subject: 'History',
            dueDate: '2024-01-25',
            status: 'pending',
            priority: 'low'
          }
        ];
        setAssignments(mockAssignments);

        // Mock announcements
        const mockAnnouncements: Announcement[] = [
          {
            id: 1,
            title: 'Exam Schedule Released',
            content: 'The final exam schedule for this term has been published. Please check your student portal.',
            date: '2024-01-15',
            type: 'exam',
            from: 'Academic Office'
          },
          {
            id: 2,
            title: 'Library Extended Hours',
            content: 'The library will be open until 9 PM during exam period.',
            date: '2024-01-14',
            type: 'general',
            from: 'Library Services'
          },
          {
            id: 3,
            title: 'School Closed Tomorrow',
            content: 'Due to severe weather conditions, school will be closed tomorrow. All classes will be conducted online.',
            date: '2024-01-13',
            type: 'urgent',
            from: 'Administration'
          }
        ];
        setAnnouncements(mockAnnouncements);

        // Mock recent grades
        const mockGrades: GradeRecord[] = [
          {
            id: 1,
            subject: 'Mathematics',
            assignment: 'Midterm Exam',
            grade: 'A-',
            percentage: 87,
            date: '2024-01-10',
            feedback: 'Excellent work on complex problems. Review basic algebra concepts.'
          },
          {
            id: 2,
            subject: 'English Literature',
            assignment: 'Poetry Analysis',
            grade: 'B+',
            percentage: 82,
            date: '2024-01-08',
            feedback: 'Good analytical skills. Work on writing structure.'
          },
          {
            id: 3,
            subject: 'Science',
            assignment: 'Lab Experiment 3',
            grade: 'A',
            percentage: 94,
            date: '2024-01-05',
            feedback: 'Outstanding experimental design and data analysis.'
          }
        ];
        setRecentGrades(mockGrades);

        // Mock attendance
        setAttendancePercentage(92);

      } catch (error) {
        console.error('Error loading student data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-green-500';
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'exam': return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case 'event': return <Calendar className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'assignments':
        router.push('/student/assignments');
        break;
      case 'timetable':
        router.push('/student/timetable');
        break;
      case 'grades':
        router.push('/student/performance');
        break;
      case 'resources':
        router.push('/student/resources');
        break;
      case 'profile':
        router.push('/student/profile');
        break;
      case 'fees':
        router.push('/student/fees');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
            <p className="text-blue-100">You have {assignments.filter(a => a.status === 'pending').length} pending assignments and {upcomingClasses.filter(c => c.date === 'Today').length} classes today.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{attendancePercentage}%</div>
            <div className="text-blue-100">Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Classes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {upcomingClasses.filter(c => c.date === 'Today').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {assignments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(recentGrades.reduce((sum, g) => sum + g.percentage, 0) / recentGrades.length)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Announcements</p>
              <p className="text-2xl font-semibold text-gray-900">{announcements.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
                <button 
                  onClick={() => handleQuickAction('timetable')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Timetable →
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingClasses.slice(0, 4).map((class_) => (
                  <div key={class_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{class_.subject}</p>
                        <p className="text-sm text-gray-600">with {class_.tutor}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {class_.time} • {class_.date}
                          <MapPin className="w-4 h-4 ml-3 mr-1" />
                          {class_.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {class_.type === 'virtual' && class_.zoomLink && (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center">
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </button>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        class_.type === 'virtual' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {class_.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleQuickAction('assignments')}
                  className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="font-medium text-gray-900">Assignments</p>
                </button>
                <button 
                  onClick={() => handleQuickAction('grades')}
                  className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
                  <p className="font-medium text-gray-900">Grades</p>
                </button>
                <button 
                  onClick={() => handleQuickAction('resources')}
                  className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="font-medium text-gray-900">Resources</p>
                </button>
                <button 
                  onClick={() => handleQuickAction('fees')}
                  className="p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="font-medium text-gray-900">Fees</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Homework & Assignments</h2>
              <button 
                onClick={() => handleQuickAction('assignments')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {assignments.slice(0, 4).map((assignment) => (
                <div key={assignment.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(assignment.priority)} bg-gray-50`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-600">{assignment.subject}</p>
                      <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Grades</h2>
              <button 
                onClick={() => handleQuickAction('grades')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{grade.assignment}</p>
                    <p className="text-sm text-gray-600">{grade.subject}</p>
                    <p className="text-sm text-gray-500">{new Date(grade.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{grade.grade}</div>
                    <div className="text-sm text-gray-600">{grade.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="mr-4 mt-1">
                  {getAnnouncementIcon(announcement.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <span className="text-sm text-gray-500">{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                  <p className="text-xs text-gray-500">From: {announcement.from}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}