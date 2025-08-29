'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Users, 
  Plus, 
  X, 
  User, 
  Clock, 
  CheckCircle,
  Shield,
  GraduationCap,
  UserCheck,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

interface InternalMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderRole: 'admin' | 'teacher' | 'parent';
  recipientId: number;
  recipientName: string;
  recipientRole: 'admin' | 'teacher' | 'parent';
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'file' | 'announcement';
  fileName?: string;
}

interface Contact {
  id: number;
  name: string;
  role: 'admin' | 'teacher' | 'parent';
  email: string;
  isOnline: boolean;
  lastSeen: string;
}

interface ChatRoom {
  id: number;
  name: string;
  type: 'direct' | 'group';
  participants: number[];
  lastMessage?: InternalMessage;
  unreadCount: number;
}

export default function InternalCommunicationPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load contacts, messages, and chat rooms
    const loadData = () => {
      try {
        // Load contacts (admins, teachers, parents)
        const mockContacts: Contact[] = [
          {
            id: 1,
            name: 'System Admin',
            role: 'admin',
            email: 'admin@school.com',
            isOnline: true,
            lastSeen: new Date().toISOString()
          },
          {
            id: 2,
            name: 'John Smith',
            role: 'teacher',
            email: 'john.smith@school.com',
            isOnline: true,
            lastSeen: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Sarah Johnson',
            role: 'teacher',
            email: 'sarah.johnson@school.com',
            isOnline: false,
            lastSeen: '2024-01-15T10:30:00'
          },
          {
            id: 4,
            name: 'Robert Johnson',
            role: 'parent',
            email: 'robert.johnson@email.com',
            isOnline: false,
            lastSeen: '2024-01-15T09:15:00'
          },
          {
            id: 5,
            name: 'Linda Smith',
            role: 'parent',
            email: 'linda.smith@email.com',
            isOnline: true,
            lastSeen: new Date().toISOString()
          }
        ];
        setContacts(mockContacts);

        // Load messages from localStorage
        const savedMessages = localStorage.getItem('internal_messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          // Mock messages
          const mockMessages: InternalMessage[] = [
            {
              id: 1,
              senderId: 1,
              senderName: 'System Admin',
              senderRole: 'admin',
              recipientId: 2,
              recipientName: 'John Smith',
              recipientRole: 'teacher',
              content: 'Please review the new curriculum guidelines for mathematics.',
              timestamp: '2024-01-15T09:30:00',
              isRead: true,
              type: 'text'
            },
            {
              id: 2,
              senderId: 2,
              senderName: 'John Smith',
              senderRole: 'teacher',
              recipientId: 1,
              recipientName: 'System Admin',
              recipientRole: 'admin',
              content: 'I have reviewed the guidelines. When should we implement the changes?',
              timestamp: '2024-01-15T10:15:00',
              isRead: false,
              type: 'text'
            },
            {
              id: 3,
              senderId: 4,
              senderName: 'Robert Johnson',
              senderRole: 'parent',
              recipientId: 2,
              recipientName: 'John Smith',
              recipientRole: 'teacher',
              content: 'Could we schedule a meeting to discuss Emily\'s progress in mathematics?',
              timestamp: '2024-01-15T11:00:00',
              isRead: true,
              type: 'text'
            }
          ];
          setMessages(mockMessages);
          localStorage.setItem('internal_messages', JSON.stringify(mockMessages));
        }

        // Load chat rooms
        const savedRooms = localStorage.getItem('chat_rooms');
        if (savedRooms) {
          setChatRooms(JSON.parse(savedRooms));
        } else {
          // Create initial chat rooms
          const mockRooms: ChatRoom[] = [
            {
              id: 1,
              name: 'Staff General',
              type: 'group',
              participants: [1, 2, 3],
              unreadCount: 0
            },
            {
              id: 2,
              name: 'Parent Communications',
              type: 'group',
              participants: [1, 4, 5],
              unreadCount: 2
            }
          ];
          setChatRooms(mockRooms);
          localStorage.setItem('chat_rooms', JSON.stringify(mockRooms));
        }

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContact) {
      toast.error('Please enter a message and select a recipient');
      return;
    }

    const message: InternalMessage = {
      id: Date.now(),
      senderId: user?.id || 1,
      senderName: user?.name || 'Unknown',
      senderRole: user?.role as 'admin' | 'teacher' | 'parent' || 'admin',
      recipientId: selectedContact.id,
      recipientName: selectedContact.name,
      recipientRole: selectedContact.role,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('internal_messages', JSON.stringify(updatedMessages));

    setNewMessage('');
    toast.success('Message sent successfully!');
  };

  const getMessagesWithContact = (contactId: number) => {
    return messages.filter(m => 
      (m.senderId === (user?.id || 1) && m.recipientId === contactId) ||
      (m.senderId === contactId && m.recipientId === (user?.id || 1))
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const markAsRead = (messageId: number) => {
    const updatedMessages = messages.map(m => 
      m.id === messageId ? { ...m, isRead: true } : m
    );
    setMessages(updatedMessages);
    localStorage.setItem('internal_messages', JSON.stringify(updatedMessages));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'teacher': return <GraduationCap className="w-4 h-4 text-green-600" />;
      case 'parent': return <UserCheck className="w-4 h-4 text-orange-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-2xl font-bold text-gray-900">Internal Communication</h1>
            <p className="text-gray-600">Secure messaging between admin, teachers, and parents</p>
          </div>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
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
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Online Contacts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contacts.filter(c => c.isOnline).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {messages.filter(m => !m.isRead && m.recipientId === (user?.id || 1)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Chats</p>
                <p className="text-2xl font-semibold text-gray-900">{chatRooms.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredContacts.map((contact) => {
                  const contactMessages = getMessagesWithContact(contact.id);
                  const unreadCount = contactMessages.filter(m => !m.isRead && m.senderId === contact.id).length;
                  
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              {getRoleIcon(contact.role)}
                            </div>
                            {contact.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(contact.role)}`}>
                                {contact.role}
                              </span>
                              {contact.isOnline ? (
                                <span className="text-xs text-green-600">Online</span>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  {new Date(contact.lastSeen).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96">
              {selectedContact ? (
                <div className="flex flex-col h-full">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getRoleIcon(selectedContact.role)}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{selectedContact.name}</h3>
                          <p className="text-sm text-gray-500">
                            {selectedContact.role} • {selectedContact.isOnline ? 'Online' : 'Offline'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <Video className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {getMessagesWithContact(selectedContact.id).map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === (user?.id || 1) ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === (user?.id || 1)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                            onClick={() => !message.isRead && markAsRead(message.id)}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-xs ${
                                message.senderId === (user?.id || 1) ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                              {message.senderId === (user?.id || 1) && (
                                <div className={`text-xs ${message.isRead ? 'text-blue-100' : 'text-blue-200'}`}>
                                  {message.isRead ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Type your message..."
                        />
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Smile className="w-4 h-4" />
                      </button>
                      <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a contact to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
                <button onClick={() => setShowNewChatModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select a contact to start messaging:</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {contacts.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => {
                        setSelectedContact(contact);
                        setShowNewChatModal(false);
                      }}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getRoleIcon(contact.role)}
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
