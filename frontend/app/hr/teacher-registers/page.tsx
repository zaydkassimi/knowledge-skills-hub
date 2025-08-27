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
  X
} from 'lucide-react';

interface Class {
  id: number;
  name: string;
  subject: string;
  teacherId: number;
  teacherName: string;
  grade: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }[];
  students: Student[];
  totalStudents: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  attendance: AttendanceRecord[];
  performance: PerformanceRecord[];
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  classId: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

interface PerformanceRecord {
  id: number;
  studentId: number;
  classId: number;
  date: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F' | 'Incomplete';
  score?: number;
  comments: string;
  recordedBy: string;
  recordedAt: string;
}

export default function TeacherRegistersPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [performance, setPerformance] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState<{[key: number]: 'present' | 'absent' | 'late' | 'excused'}>({});
  const [performanceData, setPerformanceData] = useState<{[key: number]: {grade: string, score: string, comments: string}}>({});

  // Load data from localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem('teacher_registers_classes');
    const savedStudents = localStorage.getItem('teacher_registers_students');
    const savedAttendance = localStorage.getItem('teacher_registers_attendance');
    const savedPerformance = localStorage.getItem('teacher_registers_performance');

    if (savedClasses && savedStudents && savedAttendance && savedPerformance) {
      setClasses(JSON.parse(savedClasses));
      setStudents(JSON.parse(savedStudents));
      setAttendance(JSON.parse(savedAttendance));
      setPerformance(JSON.parse(savedPerformance));
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
          attendance: [],
          performance: []
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob.smith@school.com',
          grade: '10th Grade',
          parentName: 'Mary Smith',
          parentPhone: '+44 7911 234567',
          attendance: [],
          performance: []
        },
        {
          id: 3,
          name: 'Charlie Brown',
          email: 'charlie.brown@school.com',
          grade: '10th Grade',
          parentName: 'Lucy Brown',
          parentPhone: '+44 7911 345678',
          attendance: [],
          performance: []
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
          students: sampleStudents,
          totalStudents: sampleStudents.length
        },
        {
          id: 2,
          name: 'English Literature',
          subject: 'English',
          teacherId: 2,
          teacherName: 'David Wilson',
          grade: '10th Grade',
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
          students: sampleStudents,
          totalStudents: sampleStudents.length
        }
      ];

      setClasses(sampleClasses);
      setStudents(sampleStudents);
      setAttendance([]);
      setPerformance([]);
      localStorage.setItem('teacher_registers_classes', JSON.stringify(sampleClasses));
      localStorage.setItem('teacher_registers_students', JSON.stringify(sampleStudents));
      localStorage.setItem('teacher_registers_attendance', JSON.stringify([]));
      localStorage.setItem('teacher_registers_performance', JSON.stringify([]));
    }
    setLoading(false);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('teacher_registers_classes', JSON.stringify(classes));
      localStorage.setItem('teacher_registers_students', JSON.stringify(students));
      localStorage.setItem('teacher_registers_attendance', JSON.stringify(attendance));
      localStorage.setItem('teacher_registers_performance', JSON.stringify(performance));
    }
  }, [classes, students, attendance, performance, loading]);

  const handleTakeAttendance = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }

    const newAttendanceRecords: AttendanceRecord[] = [];
    
    Object.entries(attendanceData).forEach(([studentId, status]) => {
      const existingRecord = attendance.find(
        a => a.studentId === parseInt(studentId) && 
             a.classId === selectedClass.id && 
             a.date === selectedDate
      );

      if (!existingRecord) {
        newAttendanceRecords.push({
          id: Date.now() + parseInt(studentId),
          studentId: parseInt(studentId),
          classId: selectedClass.id,
          date: selectedDate,
          status: status,
          recordedBy: user?.name || 'Unknown',
          recordedAt: new Date().toISOString()
        });
      }
    });

    if (newAttendanceRecords.length > 0) {
      setAttendance([...attendance, ...newAttendanceRecords]);
    }

    setAttendanceData({});
    setShowAttendanceModal(false);
  };

  const handleRecordPerformance = () => {
    if (!selectedClass) {
      alert('Please select a class first');
      return;
    }

    const newPerformanceRecords: PerformanceRecord[] = [];
    
    Object.entries(performanceData).forEach(([studentId, data]) => {
      if (data.grade && data.comments) {
        const existingRecord = performance.find(
          p => p.studentId === parseInt(studentId) && 
               p.classId === selectedClass.id && 
               p.date === selectedDate
        );

        if (!existingRecord) {
          newPerformanceRecords.push({
            id: Date.now() + parseInt(studentId),
            studentId: parseInt(studentId),
            classId: selectedClass.id,
            date: selectedDate,
            grade: data.grade as 'A' | 'B' | 'C' | 'D' | 'F' | 'Incomplete',
            score: data.score ? parseFloat(data.score) : undefined,
            comments: data.comments,
            recordedBy: user?.name || 'Unknown',
            recordedAt: new Date().toISOString()
          });
        }
      }
    });

    if (newPerformanceRecords.length > 0) {
      setPerformance([...performance, ...newPerformanceRecords]);
    }

    setPerformanceData({});
    setShowPerformanceModal(false);
  };

  const getAttendanceForDate = (studentId: number, classId: number, date: string) => {
    return attendance.find(
      a => a.studentId === studentId && a.classId === classId && a.date === date
    );
  };

  const getPerformanceForDate = (studentId: number, classId: number, date: string) => {
    return performance.find(
      p => p.studentId === studentId && p.classId === classId && p.date === date
    );
  };

  const getAttendanceStats = (classId: number, date: string) => {
    const classAttendance = attendance.filter(a => a.classId === classId && a.date === date);
    const present = classAttendance.filter(a => a.status === 'present').length;
    const absent = classAttendance.filter(a => a.status === 'absent').length;
    const late = classAttendance.filter(a => a.status === 'late').length;
    const excused = classAttendance.filter(a => a.status === 'excused').length;
    
    return { present, absent, late, excused };
  };

  const teacherClasses = classes.filter(c => c.teacherId === user?.id || user?.role === 'admin');

  if (user?.role !== 'admin' && user?.role !== 'teacher') {
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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Teacher Registers</h1>
              <p className="text-purple-100 text-lg">Take attendance, record performance, and manage classes</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{teacherClasses.length}</div>
                  <div className="text-purple-100 text-sm">My Classes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {teacherClasses.reduce((sum, c) => sum + c.totalStudents, 0)}
                  </div>
                  <div className="text-purple-100 text-sm">Total Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacherClasses.map((cls) => (
              <div 
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedClass?.id === cls.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <h4 className="font-medium text-gray-900 mb-2">{cls.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{cls.subject} • {cls.grade}</p>
                <p className="text-sm text-gray-500">{cls.totalStudents} students</p>
                <div className="mt-2">
                  {cls.schedule.map((sched, index) => (
                    <div key={index} className="text-xs text-gray-500">
                      {sched.day} {sched.startTime}-{sched.endTime} • {sched.room}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedClass && (
          <>
            {/* Class Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowAttendanceModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Take Attendance
              </button>
              <button
                onClick={() => setShowPerformanceModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Record Performance
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Register
              </button>
            </div>

            {/* Date Selection */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Attendance Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attendance for {selectedClass.name} - {new Date(selectedDate).toLocaleDateString()}
              </h3>
              
              {(() => {
                const stats = getAttendanceStats(selectedClass.id, selectedDate);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                      <div className="text-sm text-green-700">Present</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                      <div className="text-sm text-red-700">Absent</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                      <div className="text-sm text-yellow-700">Late</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
                      <div className="text-sm text-blue-700">Excused</div>
                    </div>
                  </div>
                );
              })()}

              {/* Students List */}
              <div className="space-y-3">
                {selectedClass.students.map((student) => {
                  const attendanceRecord = getAttendanceForDate(student.id, selectedClass.id, selectedDate);
                  const performanceRecord = getPerformanceForDate(student.id, selectedClass.id, selectedDate);
                  
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Attendance Status */}
                        <div className="text-center">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            attendanceRecord?.status === 'present' ? 'bg-green-100 text-green-800' :
                            attendanceRecord?.status === 'absent' ? 'bg-red-100 text-red-800' :
                            attendanceRecord?.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            attendanceRecord?.status === 'excused' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {attendanceRecord?.status || 'Not Marked'}
                          </div>
                        </div>
                        
                        {/* Performance Grade */}
                        {performanceRecord && (
                          <div className="text-center">
                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Grade: {performanceRecord.grade}
                            </div>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setAttendanceData({...attendanceData, [student.id]: 'present'});
                              setShowAttendanceModal(true);
                            }}
                            className="btn-icon btn-icon-primary"
                            title="Mark Present"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setAttendanceData({...attendanceData, [student.id]: 'absent'});
                              setShowAttendanceModal(true);
                            }}
                            className="btn-icon btn-icon-danger"
                            title="Mark Absent"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Take Attendance Modal */}
        {showAttendanceModal && selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Take Attendance - {selectedClass.name}
                  </h2>
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {selectedClass.students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAttendanceData({...attendanceData, [student.id]: 'present'})}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            attendanceData[student.id] === 'present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => setAttendanceData({...attendanceData, [student.id]: 'absent'})}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            attendanceData[student.id] === 'absent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => setAttendanceData({...attendanceData, [student.id]: 'late'})}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            attendanceData[student.id] === 'late'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => setAttendanceData({...attendanceData, [student.id]: 'excused'})}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            attendanceData[student.id] === 'excused'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTakeAttendance}
                    className="btn-primary flex-1"
                  >
                    Save Attendance
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Record Performance Modal */}
        {showPerformanceModal && selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Record Performance - {selectedClass.name}
                  </h2>
                  <button
                    onClick={() => setShowPerformanceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {selectedClass.students.map((student) => (
                    <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{student.name}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                          <select
                            value={performanceData[student.id]?.grade || ''}
                            onChange={(e) => setPerformanceData({
                              ...performanceData,
                              [student.id]: {
                                ...performanceData[student.id],
                                grade: e.target.value
                              }
                            })}
                            className="select-field w-full"
                          >
                            <option value="">Select Grade</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
                            <option value="Incomplete">Incomplete</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Score (Optional)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={performanceData[student.id]?.score || ''}
                            onChange={(e) => setPerformanceData({
                              ...performanceData,
                              [student.id]: {
                                ...performanceData[student.id],
                                score: e.target.value
                              }
                            })}
                            className="input-field w-full"
                            placeholder="0-100"
                          />
                        </div>
                        
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                          <textarea
                            value={performanceData[student.id]?.comments || ''}
                            onChange={(e) => setPerformanceData({
                              ...performanceData,
                              [student.id]: {
                                ...performanceData[student.id],
                                comments: e.target.value
                              }
                            })}
                            className="input-field w-full"
                            rows={2}
                            placeholder="Performance comments..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowPerformanceModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRecordPerformance}
                    className="btn-primary flex-1"
                  >
                    Save Performance
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
