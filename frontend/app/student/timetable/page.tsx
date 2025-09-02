'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Video, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Plus,
  Bell,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ClassSession {
  id: number;
  subject: string;
  teacher: string;
  time: string;
  duration: number; // in minutes
  location: string;
  type: 'on-site' | 'virtual';
  zoomLink?: string;
  topic: string;
  resources?: string[];
  isSubstitute?: boolean;
  substituteTeacher?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

interface DaySchedule {
  date: string;
  dayName: string;
  classes: ClassSession[];
}

interface WeekSchedule {
  weekStart: string;
  weekEnd: string;
  days: DaySchedule[];
}

export default function StudentTimetablePage() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState<WeekSchedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
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
    loadWeekSchedule(selectedDate);
  }, [selectedDate]);

  const loadWeekSchedule = (date: string) => {
    setLoading(true);
    try {
      // Get the start of the week (Monday)
      const currentDate = new Date(date);
      const dayOfWeek = currentDate.getDay();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // Generate mock schedule for the week
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const days: DaySchedule[] = [];

      daysOfWeek.forEach((dayName, index) => {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + index);
        
        const mockClasses: ClassSession[] = [
          {
            id: index * 10 + 1,
            subject: 'Mathematics',
            teacher: 'Mr. John Smith',
            time: '09:00',
            duration: 60,
            location: 'Room 101',
            type: 'on-site',
            topic: 'Quadratic Equations',
            resources: ['Textbook Chapter 8', 'Practice Worksheets'],
            status: 'scheduled'
          },
          {
            id: index * 10 + 2,
            subject: 'English Literature',
            teacher: 'Ms. Sarah Johnson',
            time: '10:30',
            duration: 90,
            location: 'Online',
            type: 'virtual',
            zoomLink: 'https://zoom.us/j/123456789',
            topic: 'Shakespeare: Hamlet Analysis',
            resources: ['Hamlet Text', 'Study Guide'],
            status: 'scheduled'
          },
          {
            id: index * 10 + 3,
            subject: 'Science',
            teacher: index === 2 ? 'Ms. Emily Davis' : 'Dr. Michael Brown',
            time: '13:00',
            duration: 75,
            location: 'Lab 2',
            type: 'on-site',
            topic: 'Chemical Reactions',
            resources: ['Lab Manual', 'Safety Guidelines'],
            isSubstitute: index === 2,
            substituteTeacher: index === 2 ? 'Ms. Emily Davis' : undefined,
            status: 'scheduled'
          },
          {
            id: index * 10 + 4,
            subject: 'History',
            teacher: 'Ms. Rachel White',
            time: '15:00',
            duration: 60,
            location: 'Room 205',
            type: 'on-site',
            topic: 'World War II Timeline',
            resources: ['History Textbook', 'Documentary Links'],
            status: 'scheduled'
          }
        ];

        days.push({
          date: dayDate.toISOString().split('T')[0],
          dayName,
          classes: mockClasses
        });
      });

      const weekSchedule: WeekSchedule = {
        weekStart: startOfWeek.toISOString().split('T')[0],
        weekEnd: endOfWeek.toISOString().split('T')[0],
        days
      };

      setCurrentWeek(weekSchedule);
    } catch (error) {
      console.error('Error loading schedule:', error);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const joinVirtualClass = (zoomLink: string) => {
    window.open(zoomLink, '_blank');
    toast.success('Opening virtual classroom...');
  };

  const getClassStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const isToday = (date: string) => {
    return date === new Date().toISOString().split('T')[0];
  };

  const isCurrentTime = (time: string) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return time === currentTime.substring(0, 5);
  };

  const downloadSchedule = () => {
    toast.success('Schedule downloaded as PDF');
  };

  const syncToCalendar = () => {
    toast.success('Schedule synced to your calendar');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const selectedDay = currentWeek?.days.find(day => day.date === selectedDate);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Classes & Timetable</h1>
            <p className="text-gray-600">Your weekly class schedule and upcoming sessions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={syncToCalendar}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Calendar
            </button>
            <button
              onClick={downloadSchedule}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Day View
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">
                {currentWeek && new Date(currentWeek.weekStart).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                })} - {currentWeek && new Date(currentWeek.weekEnd).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </h3>
            </div>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {viewMode === 'week' ? (
          /* Week View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-6 border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <h4 className="font-medium text-gray-900">Time</h4>
              </div>
              {currentWeek?.days.map((day) => (
                <div key={day.date} className={`p-4 border-r border-gray-200 ${isToday(day.date) ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <h4 className="font-medium text-gray-900">{day.dayName}</h4>
                  <p className="text-sm text-gray-600">{new Date(day.date).getDate()}</p>
                </div>
              ))}
            </div>

            <div className="divide-y divide-gray-200">
              {/* Time slots from 9 AM to 5 PM */}
              {Array.from({ length: 9 }, (_, i) => {
                const hour = 9 + i;
                const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                
                return (
                  <div key={timeSlot} className="grid grid-cols-6 min-h-[80px]">
                    <div className="p-4 border-r border-gray-200 bg-gray-50">
                      <span className="text-sm font-medium text-gray-900">{timeSlot}</span>
                    </div>
                    {currentWeek?.days.map((day) => {
                      const classInSlot = day.classes.find(c => c.time === timeSlot);
                      return (
                        <div key={`${day.date}-${timeSlot}`} className="p-2 border-r border-gray-200">
                          {classInSlot && (
                            <div className={`p-3 rounded-lg border-l-4 ${getClassStatusColor(classInSlot.status)} cursor-pointer hover:shadow-md transition-shadow`}>
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-sm">{classInSlot.subject}</h5>
                                {classInSlot.type === 'virtual' && (
                                  <Video className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{classInSlot.teacher}</p>
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="w-3 h-3 mr-1" />
                                {classInSlot.location}
                              </div>
                              {classInSlot.isSubstitute && (
                                <div className="flex items-center text-xs text-orange-600 mt-1">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Substitute
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Day View */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Day Selector */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Select Day</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {currentWeek?.days.map((day) => (
                      <button
                        key={day.date}
                        onClick={() => setSelectedDate(day.date)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedDate === day.date
                            ? 'bg-blue-100 text-blue-900 border-blue-200'
                            : 'hover:bg-gray-50 border-gray-200'
                        } border`}
                      >
                        <div className="font-medium">{day.dayName}</div>
                        <div className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{day.classes.length} classes</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Day Schedule */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDay?.dayName} - {selectedDay && new Date(selectedDay.date).toLocaleDateString()}
                  </h3>
                  {isToday(selectedDate) && (
                    <p className="text-blue-600 text-sm mt-1">Today</p>
                  )}
                </div>
                <div className="p-6">
                  {selectedDay?.classes.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No classes scheduled for this day</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDay?.classes.map((classSession) => (
                        <div key={classSession.id} className={`p-6 rounded-lg border-l-4 ${getClassStatusColor(classSession.status)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-3">
                                <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                                <h4 className="text-lg font-semibold text-gray-900">{classSession.subject}</h4>
                                {classSession.type === 'virtual' && (
                                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Virtual</span>
                                )}
                                {classSession.isSubstitute && (
                                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Substitute Teacher</span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center text-gray-600">
                                  <User className="w-4 h-4 mr-2" />
                                  <span>{classSession.isSubstitute ? classSession.substituteTeacher : classSession.teacher}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-2" />
                                  <span>{classSession.time} ({classSession.duration} min)</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  <span>{classSession.location}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  <span>Topic: {classSession.topic}</span>
                                </div>
                              </div>

                              {classSession.resources && classSession.resources.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="font-medium text-gray-900 mb-2">Resources:</h5>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {classSession.resources.map((resource, index) => (
                                      <li key={index}>{resource}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="ml-4 flex flex-col space-y-2">
                              {classSession.type === 'virtual' && classSession.zoomLink && (
                                <button
                                  onClick={() => joinVirtualClass(classSession.zoomLink!)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                                >
                                  <Video className="w-4 h-4 mr-2" />
                                  Join Class
                                </button>
                              )}
                              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Substitute Teacher Notifications */}
        {currentWeek?.days.some(day => day.classes.some(c => c.isSubstitute)) && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-orange-800 mb-1">Substitute Teacher Notifications</h3>
                <p className="text-sm text-orange-700">
                  Some of your classes this week will have substitute teachers. Please check individual class details for more information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
