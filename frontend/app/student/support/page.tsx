'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  HelpCircle, 
  MessageSquare, 
  AlertTriangle, 
  FileText, 
  Search, 
  ChevronDown,
  ChevronUp,
  Send,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  X,
  Plus,
  Shield,
  BookOpen,
  Users,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'academic' | 'technical' | 'safety';
  isExpanded: boolean;
}

interface SupportTicket {
  id: number;
  title: string;
  description: string;
  category: 'general' | 'academic' | 'technical' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  response?: string;
}

interface SafeguardingReport {
  id: number;
  type: 'bullying' | 'harassment' | 'safety_concern' | 'other';
  description: string;
  location?: string;
  date?: string;
  witnesses?: string;
  status: 'submitted' | 'investigating' | 'resolved';
  createdAt: string;
  isAnonymous: boolean;
}

export default function StudentSupportPage() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [safeguardingReports, setSafeguardingReports] = useState<SafeguardingReport[]>([]);
  const [activeTab, setActiveTab] = useState<'faqs' | 'helpdesk' | 'safeguarding'>('faqs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showSafeguardingModal, setShowSafeguardingModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general' as const,
    priority: 'medium' as const
  });
  const [newSafeguardingReport, setNewSafeguardingReport] = useState({
    type: 'other' as const,
    description: '',
    location: '',
    date: '',
    witnesses: '',
    isAnonymous: false
  });

  useEffect(() => {
    // Load support data
    const loadData = () => {
      try {
        // Mock FAQs
        const mockFaqs: FAQ[] = [
          {
            id: 1,
            question: 'How do I submit an assignment?',
            answer: 'To submit an assignment, go to the Assignments page, click on the assignment you want to submit, and use the upload button to attach your files. Make sure to include all required documents and submit before the deadline.',
            category: 'academic',
            isExpanded: false
          },
          {
            id: 2,
            question: 'What should I do if I can\'t access my online classes?',
            answer: 'First, check your internet connection and try refreshing the page. If the problem persists, contact technical support through the helpdesk. Make sure you\'re using a supported browser (Chrome, Firefox, Safari, or Edge).',
            category: 'technical',
            isExpanded: false
          },
          {
            id: 3,
            question: 'How do I request a grade review?',
            answer: 'To request a grade review, contact your teacher directly through the messaging system. Provide specific reasons for your request and any additional evidence you believe supports your case.',
            category: 'academic',
            isExpanded: false
          },
          {
            id: 4,
            question: 'What are the library hours?',
            answer: 'The library is open Monday to Friday from 8:00 AM to 8:00 PM, and Saturdays from 9:00 AM to 5:00 PM. Extended hours are available during exam periods.',
            category: 'general',
            isExpanded: false
          },
          {
            id: 5,
            question: 'How do I report bullying or harassment?',
            answer: 'You can report bullying or harassment through the Safeguarding section of this support page. All reports are taken seriously and can be submitted anonymously if you prefer.',
            category: 'safety',
            isExpanded: false
          },
          {
            id: 6,
            question: 'What should I do if I feel unsafe at school?',
            answer: 'If you feel unsafe, immediately report to a teacher, counselor, or administrator. You can also use the safeguarding reporting system on this page. Your safety is our top priority.',
            category: 'safety',
            isExpanded: false
          }
        ];
        setFaqs(mockFaqs);

        // Mock support tickets
        const mockTickets: SupportTicket[] = [
          {
            id: 1,
            title: 'Cannot access Mathematics resources',
            description: 'I\'m trying to access the Mathematics resources but I keep getting an error message saying "Access Denied". I\'ve tried logging out and back in but the issue persists.',
            category: 'technical',
            status: 'in_progress',
            priority: 'medium',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T14:20:00Z',
            assignedTo: 'IT Support',
            response: 'We are investigating this issue. Please try clearing your browser cache and cookies. If the problem continues, we will provide an update within 24 hours.'
          },
          {
            id: 2,
            title: 'Request for additional study materials',
            description: 'I would like to request additional study materials for the upcoming calculus exam. The current resources are helpful but I need more practice problems.',
            category: 'academic',
            status: 'open',
            priority: 'low',
            createdAt: '2024-01-14T16:45:00Z',
            updatedAt: '2024-01-14T16:45:00Z'
          }
        ];
        setSupportTickets(mockTickets);

        // Mock safeguarding reports
        const mockReports: SafeguardingReport[] = [
          {
            id: 1,
            type: 'bullying',
            description: 'I have been experiencing verbal harassment from another student during lunch breaks. This has been happening for the past week.',
            location: 'School cafeteria',
            date: '2024-01-15',
            witnesses: 'Several students from my class',
            status: 'investigating',
            createdAt: '2024-01-15T12:00:00Z',
            isAnonymous: false
          }
        ];
        setSafeguardingReports(mockReports);

      } catch (error) {
        console.error('Error loading support data:', error);
      }
    };

    loadData();
  }, []);

  const toggleFaq = (faqId: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === faqId ? { ...faq, isExpanded: !faq.isExpanded } : faq
    ));
  };

  const submitSupportTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ticket: SupportTicket = {
      id: Date.now(),
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category,
      status: 'open',
      priority: newTicket.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSupportTickets([ticket, ...supportTickets]);
    setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
    setShowNewTicketModal(false);
    toast.success('Support ticket submitted successfully!');
  };

  const submitSafeguardingReport = () => {
    if (!newSafeguardingReport.description.trim()) {
      toast.error('Please provide a description of the incident');
      return;
    }

    const report: SafeguardingReport = {
      id: Date.now(),
      type: newSafeguardingReport.type,
      description: newSafeguardingReport.description,
      location: newSafeguardingReport.location,
      date: newSafeguardingReport.date,
      witnesses: newSafeguardingReport.witnesses,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      isAnonymous: newSafeguardingReport.isAnonymous
    };

    setSafeguardingReports([report, ...safeguardingReports]);
    setNewSafeguardingReport({
      type: 'other',
      description: '',
      location: '',
      date: '',
      witnesses: '',
      isAnonymous: false
    });
    setShowSafeguardingModal(false);
    toast.success('Safeguarding report submitted successfully! This will be reviewed immediately.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return <BookOpen className="w-4 h-4" />;
      case 'technical': return <Settings className="w-4 h-4" />;
      case 'safety': return <Shield className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTickets = supportTickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-2xl font-bold text-gray-900">Support & Help</h1>
            <p className="text-gray-600">Get help, find answers, and report concerns</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('faqs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'faqs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                FAQs
              </button>
              <button
                onClick={() => setActiveTab('helpdesk')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'helpdesk'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Helpdesk
              </button>
              <button
                onClick={() => setActiveTab('safeguarding')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'safeguarding'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Safeguarding
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="general">General</option>
                    <option value="academic">Academic</option>
                    <option value="technical">Technical</option>
                    <option value="safety">Safety</option>
                  </select>
                </div>

                {/* FAQs List */}
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(faq.category)}
                          <span className="font-medium text-gray-900">{faq.question}</span>
                        </div>
                        {faq.isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {faq.isExpanded && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'helpdesk' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                    <p className="text-gray-600">Track your support requests and get help</p>
                  </div>
                  <button
                    onClick={() => setShowNewTicketModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Ticket</span>
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        {ticket.assignedTo && (
                          <span>Assigned to: {ticket.assignedTo}</span>
                        )}
                      </div>
                      {ticket.response && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-900">
                            <strong>Response:</strong> {ticket.response}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'safeguarding' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Safeguarding Reports</h3>
                    <p className="text-gray-600">Report safety concerns, bullying, or harassment</p>
                  </div>
                  <button
                    onClick={() => setShowSafeguardingModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Report Incident</span>
                  </button>
                </div>

                {/* Important Notice */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900">Important</h4>
                      <p className="text-sm text-red-700 mt-1">
                        If you are in immediate danger, please contact emergency services (911) or speak to a teacher or administrator immediately. 
                        All reports submitted here are taken seriously and will be investigated promptly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reports List */}
                <div className="space-y-4">
                  {safeguardingReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {report.type.replace('_', ' ').charAt(0).toUpperCase() + report.type.replace('_', ' ').slice(1)} Report
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                          {report.location && (
                            <p className="text-sm text-gray-500 mt-1">Location: {report.location}</p>
                          )}
                          {report.date && (
                            <p className="text-sm text-gray-500">Date: {report.date}</p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(report.createdAt).toLocaleDateString()}
                        {report.isAnonymous && ' (Anonymous)'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Ticket Modal */}
        {showNewTicketModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">New Support Ticket</h2>
                <button onClick={() => setShowNewTicketModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detailed description of your issue"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="academic">Academic</option>
                      <option value="technical">Technical</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitSupportTicket}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Safeguarding Report Modal */}
        {showSafeguardingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Report Incident</h2>
                <button onClick={() => setShowSafeguardingModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type of Incident</label>
                  <select
                    value={newSafeguardingReport.type}
                    onChange={(e) => setNewSafeguardingReport({...newSafeguardingReport, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="bullying">Bullying</option>
                    <option value="harassment">Harassment</option>
                    <option value="safety_concern">Safety Concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newSafeguardingReport.description}
                    onChange={(e) => setNewSafeguardingReport({...newSafeguardingReport, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide a detailed description of what happened"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={newSafeguardingReport.location}
                      onChange={(e) => setNewSafeguardingReport({...newSafeguardingReport, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Where did this happen?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={newSafeguardingReport.date}
                      onChange={(e) => setNewSafeguardingReport({...newSafeguardingReport, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Witnesses</label>
                  <input
                    type="text"
                    value={newSafeguardingReport.witnesses}
                    onChange={(e) => setNewSafeguardingReport({...newSafeguardingReport, witnesses: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Were there any witnesses?"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newSafeguardingReport.isAnonymous}
                    onChange={(e) => setNewSafeguardingReport({...newSafeguardingReport, isAnonymous: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Submit anonymously
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSafeguardingModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitSafeguardingReport}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
