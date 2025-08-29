'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  Search, 
  Filter,
  Bell,
  AlertCircle,
  CheckCircle,
  FileText,
  Image,
  Paperclip,
  Smile,
  X,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  sender: 'student' | 'tutor';
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
  tutorName: string;
  tutorAvatar?: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'general' | 'exam' | 'event' | 'urgent';
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Tutor {
  id: number;
  name: string;
  subject: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export default function StudentCommunicationPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements'>('messages');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load communication data
    const loadData = () => {
      try {
        // Mock tutors
        const mockTutors: Tutor[] = [
          {
            id: 1,
            name: 'Mr. John Smith',
            subject: 'Mathematics',
            isOnline: true,
            lastSeen: '2 minutes ago'
          },
          {
            id: 2,
            name: 'Ms. Sarah Johnson',
            subject: 'English Literature',
            isOnline: false,
            lastSeen: '1 hour ago'
          },
          {
            id: 3,
            name: 'Dr. Michael Brown',
            subject: 'Science',
            isOnline: true,
            lastSeen: '5 minutes ago'
          }
        ];
        setTutors(mockTutors);

        // Mock messages
        const mockMessages: Message[] = [
          {
            id: 1,
            sender: 'tutor',
            content: 'Hi! I wanted to discuss your recent assignment. You did great work on the algebra problems!',
            timestamp: '2024-01-15T10:30:00Z',
            isRead: true,
            tutorName: 'Mr. John Smith'
          },
          {
            id: 2,
            sender: 'student',
            content: 'Thank you! I found the quadratic equations challenging but I think I understand them better now.',
            timestamp: '2024-01-15T10:35:00Z',
            isRead: true,
            tutorName: 'Mr. John Smith'
          },
          {
            id: 3,
            sender: 'tutor',
            content: 'That\'s excellent progress! For next week, we\'ll be covering calculus basics. Are you ready for that?',
            timestamp: '2024-01-15T10:40:00Z',
            isRead: false,
            tutorName: 'Mr. John Smith'
          }
        ];
        setMessages(mockMessages);

        // Mock announcements
        const mockAnnouncements: Announcement[] = [
          {
            id: 1,
            title: 'Exam Schedule Update',
            content: 'The Mathematics mid-term exam has been rescheduled to next Friday at 2:00 PM. Please check your timetable for updates.',
            type: 'exam',
            timestamp: '2024-01-15T09:00:00Z',
            isRead: false,
            priority: 'high'
          },
          {
            id: 2,
            title: 'Science Fair Registration',
            content: 'Registration for the annual science fair is now open. Projects are due by the end of this month. Contact your science teacher for more details.',
            type: 'event',
            timestamp: '2024-01-14T14:30:00Z',
            isRead: true,
            priority: 'medium'
          },
          {
            id: 3,
            title: 'Library Hours Extended',
            content: 'The library will now be open until 8:00 PM on weekdays to accommodate students preparing for exams.',
            type: 'general',
            timestamp: '2024-01-13T16:00:00Z',
            isRead: true,
            priority: 'low'
          }
        ];
        setAnnouncements(mockAnnouncements);

      } catch (error) {
        console.error('Error loading communication data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedTutor) return;

    const message: Message = {
      id: Date.now(),
      sender: 'student',
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
      tutorName: selectedTutor.name
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent successfully!');
  };

  const markAnnouncementAsRead = (announcementId: number) => {
    setAnnouncements(announcements.map(announcement => 
      announcement.id === announcementId 
        ? { ...announcement, isRead: true }
        : announcement
    ));
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'exam': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'event': return <Bell className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-green-500';
    }
  };

  const filteredMessages = messages.filter(message => 
    message.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'student') {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Communication</h1>
            <p className="text-gray-600">Connect with your tutors and stay updated with announcements</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'announcements'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Announcements
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'messages' ? 'messages' : 'announcements'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {activeTab === 'messages' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tutors List */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tutors</h3>
                  <div className="space-y-3">
                    {tutors.map((tutor) => (
                      <div
                        key={tutor.id}
                        onClick={() => setSelectedTutor(tutor)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedTutor?.id === tutor.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {tutor.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{tutor.name}</p>
                              <p className="text-sm text-gray-600">{tutor.subject}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${tutor.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className="text-xs text-gray-500">{tutor.isOnline ? 'Online' : tutor.lastSeen}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="lg:col-span-2">
                  {selectedTutor ? (
                    <div className="h-96 flex flex-col">
                      {/* Messages Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {selectedTutor.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{selectedTutor.name}</p>
                            <p className="text-sm text-gray-600">{selectedTutor.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${selectedTutor.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-xs text-gray-500">{selectedTutor.isOnline ? 'Online' : selectedTutor.lastSeen}</span>
                        </div>
                      </div>

                      {/* Messages List */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {filteredMessages
                          .filter(message => message.tutorName === selectedTutor.name)
                          .map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender === 'student'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  message.sender === 'student' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Select a tutor to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Announcements */
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    onClick={() => markAnnouncementAsRead(announcement.id)}
                    className={`p-4 border-l-4 rounded-lg cursor-pointer transition-colors ${
                      getPriorityColor(announcement.priority)
                    } ${announcement.isRead ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-50`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getAnnouncementIcon(announcement.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                            {!announcement.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{announcement.content}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(announcement.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.priority === 'high' 
                            ? 'bg-red-100 text-red-800'
                            : announcement.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {announcement.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
