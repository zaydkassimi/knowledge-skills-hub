'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Plus, 
  X, 
  User, 
  Clock, 
  CheckCircle,
  Mail,
  Phone,
  Baby
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Parent {
  id: number;
  name: string;
  email: string;
  phone: string;
  children: string[];
  relationshipType: string;
}

interface Message {
  id: number;
  parentId: number;
  teacherId: number;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  sender: 'teacher' | 'parent';
}

export default function ParentCommunicationPage() {
  const { user } = useAuth();
  const [parents, setParents] = useState<Parent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({
    parentId: 0,
    subject: '',
    content: ''
  });

  // Check if user is a teacher
  if (user?.role !== 'teacher') {
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
    // Load parents and messages
    const loadData = () => {
      try {
        // Load parents from localStorage
        const savedParents = localStorage.getItem('parents');
        const parentsData = savedParents ? JSON.parse(savedParents) : [];
        setParents(parentsData);

        // Load messages from localStorage
        const savedMessages = localStorage.getItem('teacher_parent_messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          // Mock messages
          const mockMessages: Message[] = [
            {
              id: 1,
              parentId: 1,
              teacherId: user?.teacher_id || 1,
              subject: 'Math Progress Update',
              content: 'Hello Mr. Johnson, I wanted to update you on Emily\'s progress in mathematics. She has shown great improvement this week.',
              timestamp: '2024-01-10T09:30:00',
              isRead: true,
              sender: 'teacher'
            },
            {
              id: 2,
              parentId: 1,
              teacherId: user?.teacher_id || 1,
              subject: 'Re: Math Progress Update',
              content: 'Thank you for the update! We are very proud of Emily. Are there any specific areas she should focus on at home?',
              timestamp: '2024-01-10T14:20:00',
              isRead: false,
              sender: 'parent'
            }
          ];
          setMessages(mockMessages);
          localStorage.setItem('teacher_parent_messages', JSON.stringify(mockMessages));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleSendMessage = () => {
    if (!newMessage.parentId || !newMessage.subject || !newMessage.content) {
      toast.error('Please fill in all fields');
      return;
    }

    const message: Message = {
      id: Date.now(),
      parentId: newMessage.parentId,
      teacherId: user?.teacher_id || 1,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toISOString(),
      isRead: true,
      sender: 'teacher'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('teacher_parent_messages', JSON.stringify(updatedMessages));

    setNewMessage({ parentId: 0, subject: '', content: '' });
    setShowNewMessageModal(false);
    toast.success('Message sent successfully!');
  };

  const getParentMessages = (parentId: number) => {
    return messages.filter(m => m.parentId === parentId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.children.some(child => child.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Parent Communication</h1>
            <p className="text-gray-600">Connect with parents regarding their children's progress</p>
          </div>
          <button
            onClick={() => setShowNewMessageModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Message
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-semibold text-gray-900">{messages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {messages.filter(m => 
                    m.sender === 'teacher' && 
                    new Date(m.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Parent Contacts</p>
                <p className="text-2xl font-semibold text-gray-900">{parents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {messages.filter(m => !m.isRead && m.sender === 'parent').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parents List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search parents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredParents.map((parent) => {
                  const parentMessages = getParentMessages(parent.id);
                  const unreadCount = parentMessages.filter(m => !m.isRead && m.sender === 'parent').length;
                  
                  return (
                    <div
                      key={parent.id}
                      onClick={() => setSelectedParent(parent)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedParent?.id === parent.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{parent.name}</p>
                            <p className="text-xs text-gray-500">{parent.relationshipType}</p>
                          </div>
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Baby className="w-3 h-3 mr-1" />
                          {parent.children.join(', ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Messages View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96">
              {selectedParent ? (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedParent.name}</h3>
                        <p className="text-sm text-gray-500">
                          Parent of: {selectedParent.children.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedParent.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {getParentMessages(selectedParent.id).map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender === 'teacher'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm font-medium">{message.subject}</p>
                            <p className="text-sm mt-1">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.sender === 'teacher' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Reply */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setNewMessage({ ...newMessage, parentId: selectedParent.id });
                        setShowNewMessageModal(true);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a parent to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Message Modal */}
        {showNewMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
                <button onClick={() => setShowNewMessageModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Send to</label>
                  <select
                    value={newMessage.parentId}
                    onChange={(e) => setNewMessage({...newMessage, parentId: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>Select a parent</option>
                    {parents.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name} - {parent.children.join(', ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter message subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Enter your message"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
