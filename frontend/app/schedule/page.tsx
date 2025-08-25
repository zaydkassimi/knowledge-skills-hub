'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video,
  BookOpen,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleEvent {
  id: number;
  title: string;
  type: 'class' | 'assignment' | 'exam' | 'meeting';
  startTime: string;
  endTime: string;
  day: string;
  room: string;
  teacher?: string;
  subject?: string;
  description?: string;
  meetingLink?: string;
}

interface DaySchedule {
  day: string;
  date: string;
  events: ScheduleEvent[];
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [filterType, setFilterType] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockSchedule: DaySchedule[] = [
      {
        day: 'Monday',
        date: '2024-01-22',
        events: [
          {
            id: 1,
            title: 'Advanced Mathematics',
            type: 'class',
            startTime: '09:00',
            endTime: '10:00',
            day: 'Monday',
            room: 'Room 201',
            teacher: 'Sarah Johnson',
            subject: 'Mathematics',
            description: 'Calculus and linear algebra concepts',
            meetingLink: 'https://meet.google.com/abc-defg-hij'
          },
          {
            id: 2,
            title: 'English Literature',
            type: 'class',
            startTime: '10:30',
            endTime: '11:45',
            day: 'Monday',
            room: 'Room 105',
            teacher: 'David Wilson',
            subject: 'English',
            description: 'Shakespeare and modern literature'
          },
          {
            id: 3,
            title: 'Math Homework Due',
            type: 'assignment',
            startTime: '23:59',
            endTime: '23:59',
            day: 'Monday',
            room: 'Online',
            subject: 'Mathematics'
          }
        ]
      },
      {
        day: 'Tuesday',
        date: '2024-01-23',
        events: [
          {
            id: 4,
            title: 'Physics Fundamentals',
            type: 'class',
            startTime: '13:00',
            endTime: '14:30',
            day: 'Tuesday',
            room: 'Room 205',
            teacher: 'Lisa Brown',
            subject: 'Physics',
            description: 'Introduction to physics concepts',
            meetingLink: 'https://meet.google.com/mno-pqr-stu'
          },
          {
            id: 5,
            title: 'Chemistry Lab',
            type: 'class',
            startTime: '15:00',
            endTime: '17:00',
            day: 'Tuesday',
            room: 'Lab 301',
            teacher: 'Emily Davis',
            subject: 'Science',
            description: 'Hands-on chemistry experiments'
          }
        ]
      },
      {
        day: 'Wednesday',
        date: '2024-01-24',
        events: [
          {
            id: 6,
            title: 'Advanced Mathematics',
            type: 'class',
            startTime: '09:00',
            endTime: '10:00',
            day: 'Wednesday',
            room: 'Room 201',
            teacher: 'Sarah Johnson',
            subject: 'Mathematics',
            meetingLink: 'https://meet.google.com/abc-defg-hij'
          },
          {
            id: 7,
            title: 'World History',
            type: 'class',
            startTime: '11:00',
            endTime: '12:00',
            day: 'Wednesday',
            room: 'Room 203',
            teacher: 'Michael Chen',
            subject: 'History',
            description: 'World War II and modern history'
          }
        ]
      },
      {
        day: 'Thursday',
        date: '2024-01-25',
        events: [
          {
            id: 8,
            title: 'English Literature',
            type: 'class',
            startTime: '10:30',
            endTime: '11:45',
            day: 'Thursday',
            room: 'Room 105',
            teacher: 'David Wilson',
            subject: 'English'
          },
          {
            id: 9,
            title: 'Physics Fundamentals',
            type: 'class',
            startTime: '13:00',
            endTime: '14:30',
            day: 'Thursday',
            room: 'Room 205',
            teacher: 'Lisa Brown',
            subject: 'Physics',
            meetingLink: 'https://meet.google.com/mno-pqr-stu'
          },
          {
            id: 10,
            title: 'Physics Midterm Exam',
            type: 'exam',
            startTime: '14:30',
            endTime: '16:00',
            day: 'Thursday',
            room: 'Room 205',
            subject: 'Physics'
          }
        ]
      },
      {
        day: 'Friday',
        date: '2024-01-26',
        events: [
          {
            id: 11,
            title: 'Advanced Mathematics',
            type: 'class',
            startTime: '09:00',
            endTime: '10:00',
            day: 'Friday',
            room: 'Room 201',
            teacher: 'Sarah Johnson',
            subject: 'Mathematics',
            meetingLink: 'https://meet.google.com/abc-defg-hij'
          },
          {
            id: 12,
            title: 'World History',
            type: 'class',
            startTime: '11:00',
            endTime: '12:00',
            day: 'Friday',
            room: 'Room 203',
            teacher: 'Michael Chen',
            subject: 'History'
          },
          {
            id: 13,
            title: 'English Essay Due',
            type: 'assignment',
            startTime: '23:59',
            endTime: '23:59',
            day: 'Friday',
            room: 'Online',
            subject: 'English'
          }
        ]
      }
    ];
    
    setTimeout(() => {
      setSchedule(mockSchedule);
      setLoading(false);
    }, 1000);
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assignment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <Calendar className="w-4 h-4" />;
      case 'exam': return <Clock className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredSchedule = schedule.map(day => ({
    ...day,
    events: day.events.filter(event => 
      filterType === 'all' || event.type === filterType
    )
  }));

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-600 mt-1">
              {isTeacher ? 'Manage your class schedule and appointments' : 'View your class schedule and upcoming events'}
            </p>
          </div>
          {isTeacher && (
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          )}
        </div>

        {/* Week Navigation */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentWeek(prev => prev - 1)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Week of January 22, 2024</h2>
              <button 
                onClick={() => setCurrentWeek(prev => prev + 1)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Events</option>
              <option value="class">Classes</option>
              <option value="assignment">Assignments</option>
              <option value="exam">Exams</option>
              <option value="meeting">Meetings</option>
            </select>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading schedule...</span>
              </div>
            </div>
          ) : filteredSchedule.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500">No events match your filter criteria.</p>
            </div>
          ) : (
            filteredSchedule.map((day) => (
              <div key={day.day} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Day Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">{day.day}</h3>
                  <p className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</p>
                </div>
                
                {/* Events */}
                <div className="p-4">
                  {day.events.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No events</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {day.events.map((event) => (
                        <div 
                          key={event.id} 
                          className={cn(
                            "p-3 rounded-lg border transition-all duration-200 hover:shadow-md",
                            getEventTypeColor(event.type)
                          )}
                        >
                          {/* Event Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getEventTypeIcon(event.type)}
                              <span className="text-xs font-medium uppercase tracking-wide">
                                {event.type}
                              </span>
                            </div>
                            {event.meetingLink && (
                              <a
                                href={event.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                                title="Join meeting"
                              >
                                <Video className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          
                          {/* Event Title */}
                          <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                          
                          {/* Event Details */}
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{event.startTime} - {event.endTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{event.room}</span>
                            </div>
                            {event.teacher && (
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{event.teacher}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Description */}
                          {event.description && (
                            <p className="text-xs mt-2 opacity-80">{event.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Today's Summary */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today's Summary</h2>
            <p className="text-gray-600 mt-1">Overview of today's events and tasks</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-600">Classes Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-gray-600">Assignments Due</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-gray-600">Exams Today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
