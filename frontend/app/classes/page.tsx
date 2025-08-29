'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Calendar,
  Clock,
  Users,
  Video,
  BookOpen,
  MapPin,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Class {
  id: number;
  name: string;
  subject: string;
  teacher: string;
  schedule: string;
  duration: string;
  room: string;
  students: number;
  maxStudents: number;
  status: 'active' | 'completed' | 'cancelled';
  description: string;
  meetingLink?: string;
}

interface NewClass {
  name: string;
  subject: string;
  schedule: string;
  duration: string;
  room: string;
  maxStudents: number;
  description: string;
  meetingLink: string;
}

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState<NewClass>({
    name: '',
    subject: 'Mathematics',
    schedule: '',
    duration: '60',
    room: '',
    maxStudents: 25,
    description: '',
    meetingLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockClasses: Class[] = [
      {
        id: 1,
        name: 'Advanced Mathematics',
        subject: 'Mathematics',
        teacher: 'Sarah Johnson',
        schedule: 'Monday, Wednesday, Friday 9:00 AM',
        duration: '60 minutes',
        room: 'Room 201',
        students: 18,
        maxStudents: 25,
        status: 'active',
        description: 'Advanced mathematics course covering calculus and linear algebra.',
        meetingLink: 'https://meet.google.com/abc-defg-hij'
      },
      {
        id: 2,
        name: 'English Literature',
        subject: 'English',
        teacher: 'David Wilson',
        schedule: 'Tuesday, Thursday 10:30 AM',
        duration: '75 minutes',
        room: 'Room 105',
        students: 22,
        maxStudents: 25,
        status: 'active',
        description: 'Study of classic literature and modern writing techniques.',
        meetingLink: 'https://meet.google.com/xyz-uvw-rst'
      },
      {
        id: 3,
        name: 'Chemistry Lab',
        subject: 'Science',
        teacher: 'Emily Davis',
        schedule: 'Wednesday 2:00 PM',
        duration: '120 minutes',
        room: 'Lab 301',
        students: 15,
        maxStudents: 20,
        status: 'active',
        description: 'Hands-on chemistry experiments and laboratory work.'
      },
      {
        id: 4,
        name: 'World History',
        subject: 'History',
        teacher: 'Michael Chen',
        schedule: 'Monday, Friday 11:00 AM',
        duration: '60 minutes',
        room: 'Room 203',
        students: 20,
        maxStudents: 25,
        status: 'completed',
        description: 'Comprehensive study of world history from ancient to modern times.'
      },
      {
        id: 5,
        name: 'Physics Fundamentals',
        subject: 'Physics',
        teacher: 'Lisa Brown',
        schedule: 'Tuesday, Thursday 2:30 PM',
        duration: '90 minutes',
        room: 'Room 205',
        students: 16,
        maxStudents: 25,
        status: 'active',
        description: 'Introduction to fundamental physics concepts and principles.',
        meetingLink: 'https://zoom.us/j/123456789'
      }
    ];
    
    setTimeout(() => {
      setClasses(mockClasses);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new class
      const newClassData: Class = {
        id: classes.length + 1,
        name: newClass.name,
        subject: newClass.subject,
        teacher: user?.name || 'Unknown Teacher',
        schedule: newClass.schedule,
        duration: `${newClass.duration} minutes`,
        room: newClass.room,
        students: 0,
        maxStudents: newClass.maxStudents,
        status: 'active',
        description: newClass.description,
        meetingLink: newClass.meetingLink || undefined
      };

      // Add to classes list
      setClasses([...classes, newClassData]);

      // Reset form
      setNewClass({
        name: '',
        subject: 'Mathematics',
        schedule: '',
        duration: '60',
        room: '',
        maxStudents: 25,
        description: '',
        meetingLink: ''
      });
      setShowCreateModal(false);
      
      // Show success message
      alert('Class created successfully!');
    } catch (error) {
      alert('Error creating class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return 'bg-purple-100 text-purple-800';
      case 'English': return 'bg-blue-100 text-blue-800';
      case 'Science': return 'bg-green-100 text-green-800';
      case 'Physics': return 'bg-red-100 text-red-800';
      case 'Chemistry': return 'bg-emerald-100 text-emerald-800';
      case 'Biology': return 'bg-teal-100 text-teal-800';
      case 'History': return 'bg-orange-100 text-orange-800';
      case 'Geography': return 'bg-amber-100 text-amber-800';
      case 'Art': return 'bg-pink-100 text-pink-800';
      case 'Music': return 'bg-indigo-100 text-indigo-800';
      case 'PE': return 'bg-cyan-100 text-cyan-800';
      case 'Computer Science': return 'bg-slate-100 text-slate-800';
      case 'French': return 'bg-rose-100 text-rose-800';
      case 'Spanish': return 'bg-yellow-100 text-yellow-800';
      case 'Religious Studies': return 'bg-violet-100 text-violet-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || classItem.subject === subjectFilter;
    const matchesStatus = statusFilter === 'all' || classItem.status === statusFilter;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const isTeacher = user?.role === 'teacher';

  // Calculate stats
  const totalClasses = classes.length;
  const activeClasses = classes.filter(c => c.status === 'active').length;
  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
  const onlineClasses = classes.filter(c => c.meetingLink).length;

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
            <p className="text-gray-600 mt-1">
              {isTeacher ? 'Manage your classes and schedules' : 'View your class schedule'}
            </p>
          </div>
          {isTeacher && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Class
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold text-gray-900">{activeClasses}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Video className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Online Classes</p>
                <p className="text-2xl font-bold text-gray-900">{onlineClasses}</p>
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
                  placeholder="Search classes..."
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
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Art">Art</option>
                <option value="Music">Music</option>
                <option value="PE">Physical Education</option>
                <option value="Computer Science">Computer Science</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="Religious Studies">Religious Studies</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{classItem.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColor(classItem.status))}>
                      {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                    </span>
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getSubjectColor(classItem.subject))}>
                      {classItem.subject}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{classItem.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{classItem.schedule}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{classItem.duration}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{classItem.room}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{classItem.students}/{classItem.maxStudents}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(classItem.students / classItem.maxStudents) * 100}%` }}
                  ></div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Teacher: {classItem.teacher}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => alert(`View class: ${classItem.name}`)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      title="View Class"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {isTeacher && (
                      <button 
                        onClick={() => alert(`Edit class: ${classItem.name}`)}
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                        title="Edit Class"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {classItem.meetingLink && (
                    <a 
                      href={classItem.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Video className="w-3 h-3 mr-1" />
                      Join Class
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Class Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Class</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.name}
                    onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter class name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    required
                    value={newClass.subject}
                    onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Art">Art</option>
                    <option value="Music">Music</option>
                    <option value="PE">Physical Education</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Religious Studies">Religious Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.schedule}
                    onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Monday, Wednesday, Friday 9:00 AM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    max="180"
                    value={newClass.duration}
                    onChange={(e) => setNewClass({...newClass, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room/Location
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.room}
                    onChange={(e) => setNewClass({...newClass, room: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Room 201"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Students
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={newClass.maxStudents}
                    onChange={(e) => setNewClass({...newClass, maxStudents: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newClass.description}
                    onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter class description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={newClass.meetingLink}
                    onChange={(e) => setNewClass({...newClass, meetingLink: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://meet.google.com/..."
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
                    {isSubmitting ? 'Creating...' : 'Create Class'}
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
