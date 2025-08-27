'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Save,
  Download,
  Upload,
  FileText,
  BookOpen,
  GraduationCap,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  X,
  MapPin,
  UserPlus,
  UserMinus,
  CalendarDays,
  Clock3
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  enrolledClasses: number[];
  availableClasses: number[];
  totalEnrolled: number;
  maxClasses: number;
}

interface Class {
  id: number;
  name: string;
  subject: string;
  teacherId: number;
  teacherName: string;
  grade: string;
  capacity: number;
  enrolledStudents: number;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }[];
  description: string;
  isActive: boolean;
  maxStudents: number;
}

interface Enrollment {
  id: number;
  studentId: number;
  classId: number;
  enrolledDate: string;
  status: 'active' | 'dropped' | 'waitlist';
  notes?: string;
}

export default function ClassSelectionPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [enrollmentAction, setEnrollmentAction] = useState<'enroll' | 'drop'>('enroll');

  // Load data from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem('class_selection_students');
    const savedClasses = localStorage.getItem('class_selection_classes');
    const savedEnrollments = localStorage.getItem('class_selection_enrollments');

    if (savedStudents && savedClasses && savedEnrollments) {
      setStudents(JSON.parse(savedStudents));
      setClasses(JSON.parse(savedClasses));
      setEnrollments(JSON.parse(savedEnrollments));
    } else {
      // Initialize with sample data
      const sampleStudents: Student[] = [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice.johnson@school.com',
          grade: '10th Grade',
          parentName: 'John Johnson',
          parentPhone: '+44 7911 123456',
          parentEmail: 'john.johnson@email.com',
          enrolledClasses: [1, 2],
          availableClasses: [3, 4, 5],
          totalEnrolled: 2,
          maxClasses: 5
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob.smith@school.com',
          grade: '10th Grade',
          parentName: 'Mary Smith',
          parentPhone: '+44 7911 234567',
          parentEmail: 'mary.smith@email.com',
          enrolledClasses: [1],
          availableClasses: [2, 3, 4, 5],
          totalEnrolled: 1,
          maxClasses: 5
        },
        {
          id: 3,
          name: 'Charlie Brown',
          email: 'charlie.brown@school.com',
          grade: '9th Grade',
          parentName: 'Lucy Brown',
          parentPhone: '+44 7911 345678',
          parentEmail: 'lucy.brown@email.com',
          enrolledClasses: [3, 4],
          availableClasses: [1, 2, 5],
          totalEnrolled: 2,
          maxClasses: 5
        }
      ];

      const sampleClasses: Class[] = [
        {
          id: 1,
          name: 'Mathematics 101',
          subject: 'Mathematics',
          teacherId: 1,
          teacherName: 'Sarah Johnson',
          grade: '10th Grade',
          capacity: 25,
          enrolledStudents: 15,
          schedule: [
            {
              day: 'Monday',
              startTime: '09:00',
              endTime: '10:30',
              room: 'Room 101'
            },
            {
              day: 'Wednesday',
              startTime: '09:00',
              endTime: '10:30',
              room: 'Room 101'
            },
            {
              day: 'Friday',
              startTime: '09:00',
              endTime: '10:30',
              room: 'Room 101'
            }
          ],
          description: 'Advanced mathematics course covering algebra and calculus',
          isActive: true,
          maxStudents: 25
        },
        {
          id: 2,
          name: 'English Literature',
          subject: 'English',
          teacherId: 2,
          teacherName: 'David Wilson',
          grade: '10th Grade',
          capacity: 20,
          enrolledStudents: 12,
          schedule: [
            {
              day: 'Tuesday',
              startTime: '11:00',
              endTime: '12:30',
              room: 'Room 102'
            },
            {
              day: 'Thursday',
              startTime: '11:00',
              endTime: '12:30',
              room: 'Room 102'
            }
          ],
          description: 'Study of classic and contemporary literature',
          isActive: true,
          maxStudents: 20
        },
        {
          id: 3,
          name: 'Science Lab',
          subject: 'Science',
          teacherId: 3,
          teacherName: 'Emily Davis',
          grade: '9th Grade',
          capacity: 15,
          enrolledStudents: 8,
          schedule: [
            {
              day: 'Monday',
              startTime: '14:00',
              endTime: '16:00',
              room: 'Lab 201'
            },
            {
              day: 'Wednesday',
              startTime: '14:00',
              endTime: '16:00',
              room: 'Lab 201'
            }
          ],
          description: 'Hands-on laboratory experiments and scientific inquiry',
          isActive: true,
          maxStudents: 15
        },
        {
          id: 4,
          name: 'Art & Design',
          subject: 'Art',
          teacherId: 4,
          teacherName: 'Michael Chen',
          grade: '9th Grade',
          capacity: 18,
          enrolledStudents: 10,
          schedule: [
            {
              day: 'Tuesday',
              startTime: '13:00',
              endTime: '15:00',
              room: 'Art Studio'
            },
            {
              day: 'Friday',
              startTime: '13:00',
              endTime: '15:00',
              room: 'Art Studio'
            }
          ],
          description: 'Creative expression through various art mediums',
          isActive: true,
          maxStudents: 18
        },
        {
          id: 5,
          name: 'Physical Education',
          subject: 'PE',
          teacherId: 5,
          teacherName: 'Lisa Thompson',
          grade: 'All Grades',
          capacity: 30,
          enrolledStudents: 20,
          schedule: [
            {
              day: 'Monday',
              startTime: '15:00',
              endTime: '16:30',
              room: 'Gymnasium'
            },
            {
              day: 'Wednesday',
              startTime: '15:00',
              endTime: '16:30',
              room: 'Gymnasium'
            }
          ],
          description: 'Physical fitness and sports activities',
          isActive: true,
          maxStudents: 30
        }
      ];

      setStudents(sampleStudents);
      setClasses(sampleClasses);
      setEnrollments([]);
      localStorage.setItem('class_selection_students', JSON.stringify(sampleStudents));
      localStorage.setItem('class_selection_classes', JSON.stringify(sampleClasses));
      localStorage.setItem('class_selection_enrollments', JSON.stringify([]));
    }
    setLoading(false);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('class_selection_students', JSON.stringify(students));
      localStorage.setItem('class_selection_classes', JSON.stringify(classes));
      localStorage.setItem('class_selection_enrollments', JSON.stringify(enrollments));
    }
  }, [students, classes, enrollments, loading]);

  const handleEnrollment = () => {
    if (!selectedStudent || !selectedClass) {
      alert('Please select both student and class');
      return;
    }

    if (enrollmentAction === 'enroll') {
      // Check if student is already enrolled
      if (selectedStudent.enrolledClasses.includes(selectedClass.id)) {
        alert('Student is already enrolled in this class');
        return;
      }

      // Check if class is full
      if (selectedClass.enrolledStudents >= selectedClass.maxStudents) {
        alert('This class is full');
        return;
      }

      // Check if student has reached max classes
      if (selectedStudent.totalEnrolled >= selectedStudent.maxClasses) {
        alert('Student has reached maximum number of classes');
        return;
      }

      // Enroll student
      const updatedStudents = students.map(student => {
        if (student.id === selectedStudent.id) {
          return {
            ...student,
            enrolledClasses: [...student.enrolledClasses, selectedClass.id],
            availableClasses: student.availableClasses.filter(c => c !== selectedClass.id),
            totalEnrolled: student.totalEnrolled + 1
          };
        }
        return student;
      });

      const updatedClasses = classes.map(cls => {
        if (cls.id === selectedClass.id) {
          return {
            ...cls,
            enrolledStudents: cls.enrolledStudents + 1
          };
        }
        return cls;
      });

      const newEnrollment: Enrollment = {
        id: Date.now(),
        studentId: selectedStudent.id,
        classId: selectedClass.id,
        enrolledDate: new Date().toISOString().split('T')[0],
        status: 'active',
        notes: 'Enrolled by admin'
      };

      setStudents(updatedStudents);
      setClasses(updatedClasses);
      setEnrollments([...enrollments, newEnrollment]);
    } else {
      // Drop student from class
      const updatedStudents = students.map(student => {
        if (student.id === selectedStudent.id) {
          return {
            ...student,
            enrolledClasses: student.enrolledClasses.filter(c => c !== selectedClass.id),
            availableClasses: [...student.availableClasses, selectedClass.id],
            totalEnrolled: student.totalEnrolled - 1
          };
        }
        return student;
      });

      const updatedClasses = classes.map(cls => {
        if (cls.id === selectedClass.id) {
          return {
            ...cls,
            enrolledStudents: cls.enrolledStudents - 1
          };
        }
        return cls;
      });

      const updatedEnrollments = enrollments.map(enrollment => {
        if (enrollment.studentId === selectedStudent.id && enrollment.classId === selectedClass.id) {
          return {
            ...enrollment,
            status: 'dropped' as const,
            notes: 'Dropped by admin'
          };
        }
        return enrollment;
      });

      setStudents(updatedStudents);
      setClasses(updatedClasses);
      setEnrollments(updatedEnrollments);
    }

    setShowEnrollmentModal(false);
    setSelectedStudent(null);
    setSelectedClass(null);
  };

  const getEnrolledClasses = (studentId: number) => {
    return classes.filter(cls => 
      students.find(s => s.id === studentId)?.enrolledClasses.includes(cls.id)
    );
  };

  const getAvailableClasses = (studentId: number) => {
    return classes.filter(cls => 
      students.find(s => s.id === studentId)?.availableClasses.includes(cls.id)
    );
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalEnrollments = enrollments.filter(e => e.status === 'active').length;
  const averageClassesPerStudent = students.length > 0 ? 
    students.reduce((sum, s) => sum + s.totalEnrolled, 0) / students.length : 0;

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Class Selection Management</h1>
              <p className="text-indigo-100 text-lg">Manage student class enrollments and scheduling</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalStudents}</div>
                  <div className="text-indigo-100 text-sm">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalClasses}</div>
                  <div className="text-indigo-100 text-sm">Available Classes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalEnrollments}</div>
                  <div className="text-indigo-100 text-sm">Active Enrollments</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-indigo-600">{totalStudents}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Classes</p>
                <p className="text-3xl font-bold text-purple-600">{totalClasses}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Enrollments</p>
                <p className="text-3xl font-bold text-green-600">{totalEnrollments}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Classes/Student</p>
                <p className="text-3xl font-bold text-blue-600">{averageClassesPerStudent.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students or parents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="select-field"
          >
            <option value="all">All Grades</option>
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
            <option value="11th Grade">11th Grade</option>
            <option value="12th Grade">12th Grade</option>
          </select>
        </div>

        {/* Students and Their Classes */}
        <div className="space-y-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email} • {student.grade}</p>
                    <p className="text-sm text-gray-500">Parent: {student.parentName} ({student.parentPhone})</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Enrolled: {student.totalEnrolled}/{student.maxClasses} classes
                    </div>
                    <div className="text-sm text-gray-500">
                      Available: {student.availableClasses.length} classes
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Enrolled Classes */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Enrolled Classes ({student.enrolledClasses.length})
                    </h4>
                    <div className="space-y-3">
                      {getEnrolledClasses(student.id).map((cls) => (
                        <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{cls.name}</h5>
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                setSelectedClass(cls);
                                setEnrollmentAction('drop');
                                setShowEnrollmentModal(true);
                              }}
                              className="btn-icon btn-icon-danger"
                              title="Drop Class"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{cls.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              {cls.teacherName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {cls.schedule[0]?.room}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock3 className="w-3 h-3" />
                              {cls.schedule[0]?.day} {cls.schedule[0]?.startTime}
                            </span>
                          </div>
                        </div>
                      ))}
                      {student.enrolledClasses.length === 0 && (
                        <p className="text-gray-500 text-sm italic">No classes enrolled</p>
                      )}
                    </div>
                  </div>

                  {/* Available Classes */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      Available Classes ({student.availableClasses.length})
                    </h4>
                    <div className="space-y-3">
                      {getAvailableClasses(student.id).map((cls) => (
                        <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{cls.name}</h5>
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                setSelectedClass(cls);
                                setEnrollmentAction('enroll');
                                setShowEnrollmentModal(true);
                              }}
                              className="btn-icon btn-icon-primary"
                              title="Enroll in Class"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{cls.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              {cls.teacherName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {cls.schedule[0]?.room}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock3 className="w-3 h-3" />
                              {cls.schedule[0]?.day} {cls.schedule[0]?.startTime}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Spots: {cls.enrolledStudents}/{cls.maxStudents}
                          </div>
                        </div>
                      ))}
                      {student.availableClasses.length === 0 && (
                        <p className="text-gray-500 text-sm italic">No available classes</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enrollment Modal */}
        {showEnrollmentModal && selectedStudent && selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {enrollmentAction === 'enroll' ? 'Enroll Student' : 'Drop Student'}
                  </h2>
                  <button
                    onClick={() => setShowEnrollmentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{selectedStudent.name}</div>
                      <div className="text-sm text-gray-600">{selectedStudent.email} • {selectedStudent.grade}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{selectedClass.name}</div>
                      <div className="text-sm text-gray-600">{selectedClass.subject} • {selectedClass.teacherName}</div>
                      <div className="text-sm text-gray-500">
                        {selectedClass.schedule[0]?.day} {selectedClass.schedule[0]?.startTime}-{selectedClass.schedule[0]?.endTime} • {selectedClass.schedule[0]?.room}
                      </div>
                    </div>
                  </div>
                  
                  {enrollmentAction === 'enroll' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm text-blue-800">
                        <strong>Enrollment Details:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>• Student will be enrolled in {selectedClass.name}</li>
                          <li>• Current enrollment: {selectedStudent.totalEnrolled}/{selectedStudent.maxClasses}</li>
                          <li>• Class capacity: {selectedClass.enrolledStudents}/{selectedClass.maxStudents}</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {enrollmentAction === 'drop' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="text-sm text-red-800">
                        <strong>Drop Details:</strong>
                        <ul className="mt-1 space-y-1">
                          <li>• Student will be dropped from {selectedClass.name}</li>
                          <li>• Enrollment will be marked as inactive</li>
                          <li>• Student can re-enroll later if space is available</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEnrollmentModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEnrollment}
                    className={`btn-primary flex-1 ${
                      enrollmentAction === 'drop' ? 'bg-red-600 hover:bg-red-700' : ''
                    }`}
                  >
                    {enrollmentAction === 'enroll' ? 'Enroll Student' : 'Drop Student'}
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
