'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Download,
  Camera,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  studentId: string;
  grade: string;
  startDate: string;
  guardian: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface SubjectEnrollment {
  id: number;
  subject: string;
  teacher: string;
  startDate: string;
  currentGrade: string;
  attendance: number;
  status: 'active' | 'completed' | 'dropped';
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'academic' | 'participation' | 'improvement' | 'attendance';
  subject?: string;
}

interface ProgressRecord {
  id: number;
  subject: string;
  month: string;
  grade: number;
  attendance: number;
  feedback: string;
}

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [subjects, setSubjects] = useState<SubjectEnrollment[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfile | null>(null);
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
    // Load student profile data
    const loadProfileData = () => {
      try {
        // Load profile from localStorage or use mock data
        const savedProfile = localStorage.getItem('student_profile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        } else {
          // Mock profile data
          const mockProfile: StudentProfile = {
            id: 1,
            name: 'Alice Student',
            email: 'alice.student@email.com',
            phone: '+1234567890',
            dateOfBirth: '2005-03-15',
            address: '123 Student Street, Education City, EC 12345',
            studentId: 'STU001',
            grade: '10th Grade',
            startDate: '2023-09-01',
            guardian: {
              name: 'Bob Parent',
              relationship: 'Father',
              phone: '+1234567891',
              email: 'bob.parent@email.com'
            },
            emergencyContact: {
              name: 'Jane Parent',
              phone: '+1234567892',
              relationship: 'Mother'
            }
          };
          setProfile(mockProfile);
          localStorage.setItem('student_profile', JSON.stringify(mockProfile));
        }

        // Load subject enrollments
        const savedSubjects = localStorage.getItem('student_subjects');
        if (savedSubjects) {
          setSubjects(JSON.parse(savedSubjects));
        } else {
          const mockSubjects: SubjectEnrollment[] = [
            {
              id: 1,
              subject: 'Mathematics',
              teacher: 'Mr. John Smith',
              startDate: '2023-09-01',
              currentGrade: 'A-',
              attendance: 95,
              status: 'active'
            },
            {
              id: 2,
              subject: 'English Literature',
              teacher: 'Ms. Sarah Johnson',
              startDate: '2023-09-01',
              currentGrade: 'B+',
              attendance: 92,
              status: 'active'
            },
            {
              id: 3,
              subject: 'Science',
              teacher: 'Dr. Michael Brown',
              startDate: '2023-09-01',
              currentGrade: 'A',
              attendance: 98,
              status: 'active'
            },
            {
              id: 4,
              subject: 'History',
              teacher: 'Ms. Emily Davis',
              startDate: '2023-09-01',
              currentGrade: 'B',
              attendance: 89,
              status: 'active'
            }
          ];
          setSubjects(mockSubjects);
          localStorage.setItem('student_subjects', JSON.stringify(mockSubjects));
        }

        // Load achievements
        const savedAchievements = localStorage.getItem('student_achievements');
        if (savedAchievements) {
          setAchievements(JSON.parse(savedAchievements));
        } else {
          const mockAchievements: Achievement[] = [
            {
              id: 1,
              title: 'Honor Roll',
              description: 'Achieved honor roll status for Fall 2023',
              date: '2023-12-15',
              type: 'academic'
            },
            {
              id: 2,
              title: 'Perfect Attendance',
              description: 'No absences for the month of November',
              date: '2023-11-30',
              type: 'attendance'
            },
            {
              id: 3,
              title: 'Science Fair Winner',
              description: 'First place in school science fair',
              date: '2023-10-20',
              type: 'academic',
              subject: 'Science'
            },
            {
              id: 4,
              title: 'Math Improvement',
              description: 'Improved grade from C+ to A- in Mathematics',
              date: '2023-10-01',
              type: 'improvement',
              subject: 'Mathematics'
            }
          ];
          setAchievements(mockAchievements);
          localStorage.setItem('student_achievements', JSON.stringify(mockAchievements));
        }

        // Load progress data
        const savedProgress = localStorage.getItem('student_progress');
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        } else {
          const mockProgress: ProgressRecord[] = [
            {
              id: 1,
              subject: 'Mathematics',
              month: 'January 2024',
              grade: 87,
              attendance: 95,
              feedback: 'Excellent progress in algebra. Continue practicing word problems.'
            },
            {
              id: 2,
              subject: 'English Literature',
              month: 'January 2024',
              grade: 82,
              attendance: 92,
              feedback: 'Good analytical skills. Work on essay structure and grammar.'
            },
            {
              id: 3,
              subject: 'Science',
              month: 'January 2024',
              grade: 94,
              attendance: 98,
              feedback: 'Outstanding work in lab experiments. Keep up the curiosity!'
            }
          ];
          setProgress(mockProgress);
          localStorage.setItem('student_progress', JSON.stringify(mockProgress));
        }

      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleEditProfile = () => {
    if (profile) {
      setEditedProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleSaveProfile = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      localStorage.setItem('student_profile', JSON.stringify(editedProfile));
      setIsEditing(false);
      setEditedProfile(null);
      toast.success('Profile updated successfully!');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile(null);
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'academic': return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'attendance': return <Clock className="w-5 h-5 text-green-600" />;
      case 'improvement': return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case 'participation': return <Star className="w-5 h-5 text-orange-600" />;
      default: return <Award className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSubjectStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    if (grade.startsWith('D')) return 'text-orange-600';
    if (grade.startsWith('F')) return 'text-red-600';
    return 'text-gray-600';
  };

  const overallAttendance = subjects.length > 0 
    ? Math.round(subjects.reduce((sum, s) => sum + s.attendance, 0) / subjects.length) 
    : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">Profile not found.</p>
          </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
            <p className="text-gray-600">Manage your personal information and view your academic progress</p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEditProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveProfile}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors">
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                    <p className="text-gray-600">Student ID: {profile.studentId}</p>
                    <p className="text-gray-600">{profile.grade}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile?.name || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profile.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile?.email || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profile.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile?.phone || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedProfile?.dateOfBirth || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    {isEditing ? (
                      <textarea
                        value={editedProfile?.address || ''}
                        onChange={(e) => setEditedProfile(prev => prev ? { ...prev, address: e.target.value } : null)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                        <span className="text-gray-900">{profile.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Name</label>
                      <span className="text-gray-900">{profile.guardian.name}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                      <span className="text-gray-900">{profile.guardian.relationship}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Phone</label>
                      <span className="text-gray-900">{profile.guardian.phone}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Email</label>
                      <span className="text-gray-900">{profile.guardian.email}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                      <span className="text-gray-900">{profile.emergencyContact.name}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                      <span className="text-gray-900">{profile.emergencyContact.relationship}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                      <span className="text-gray-900">{profile.emergencyContact.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Academic Overview</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Overall Attendance</span>
                    <span className="text-lg font-semibold text-green-600">{overallAttendance}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Subjects Enrolled</span>
                    <span className="text-lg font-semibold text-blue-600">{subjects.filter(s => s.status === 'active').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Achievements</span>
                    <span className="text-lg font-semibold text-purple-600">{achievements.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Start Date</span>
                    <span className="text-sm text-gray-900">{new Date(profile.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Achievements</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="mr-3 mt-1">
                        {getAchievementIcon(achievement.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(achievement.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Enrolled */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Subjects Enrolled & Class History</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((subject) => (
                <div key={subject.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{subject.subject}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectStatusColor(subject.status)}`}>
                      {subject.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teacher:</span>
                      <span className="text-gray-900">{subject.teacher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Grade:</span>
                      <span className={`font-medium ${getGradeColor(subject.currentGrade)}`}>{subject.currentGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendance:</span>
                      <span className="text-gray-900">{subject.attendance}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="text-gray-900">{new Date(subject.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Progress Tracker</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {progress.map((record) => (
                <div key={record.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{record.subject}</h3>
                    <span className="text-sm text-gray-500">{record.month}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Grade: </span>
                      <span className="font-medium text-blue-600">{record.grade}%</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Attendance: </span>
                      <span className="font-medium text-green-600">{record.attendance}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{record.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
