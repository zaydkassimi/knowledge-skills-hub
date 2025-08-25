'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  AlertCircle,
  X,
  Save,
  UserPlus,
  TrendingUp,
  BookOpen
} from 'lucide-react';

interface WaitingListEntry {
  id: number;
  studentName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  desiredGrade: string;
  desiredSubjects: string;
  branchName: string;
  applicationDate: string;
  status: 'waiting' | 'contacted' | 'enrolled' | 'rejected';
  priority: number;
  notes: string;
}

export default function WaitingListPage() {
  const { user } = useAuth();
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WaitingListEntry | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    studentName: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    desiredGrade: '',
    desiredSubjects: '',
    branchName: 'Downtown Branch',
    notes: ''
  });

  // Load data from localStorage or use mock data for first time
  useEffect(() => {
    const savedWaitingList = localStorage.getItem('waiting_list');

    if (savedWaitingList) {
      // Load saved data
      setWaitingList(JSON.parse(savedWaitingList));
      setLoading(false);
    } else {
      // Use mock data for first time
      const mockWaitingList: WaitingListEntry[] = [
        {
          id: 1,
          studentName: 'Alex Johnson',
          parentName: 'Michael Johnson',
          parentEmail: 'michael.johnson@email.com',
          parentPhone: '+1 (555) 123-4567',
          desiredGrade: '10th Grade',
          desiredSubjects: 'Mathematics, Physics, Chemistry',
          branchName: 'Downtown Branch',
          applicationDate: '2024-01-15',
          status: 'waiting',
          priority: 1,
          notes: 'Interested in advanced mathematics program'
        },
        {
          id: 2,
          studentName: 'Emma Wilson',
          parentName: 'Sarah Wilson',
          parentEmail: 'sarah.wilson@email.com',
          parentPhone: '+1 (555) 234-5678',
          desiredGrade: '8th Grade',
          desiredSubjects: 'English, Science, Art',
          branchName: 'North Branch',
          applicationDate: '2024-01-12',
          status: 'contacted',
          priority: 2,
          notes: 'Parent called on 2024-01-14, interested in tour'
        },
        {
          id: 3,
          studentName: 'Lucas Brown',
          parentName: 'David Brown',
          parentEmail: 'david.brown@email.com',
          parentPhone: '+1 (555) 345-6789',
          desiredGrade: '12th Grade',
          desiredSubjects: 'Advanced Mathematics, Computer Science',
          branchName: 'Downtown Branch',
          applicationDate: '2024-01-10',
          status: 'enrolled',
          priority: 1,
          notes: 'Enrolled successfully, starting next semester'
        },
        {
          id: 4,
          studentName: 'Sophia Davis',
          parentName: 'Jennifer Davis',
          parentEmail: 'jennifer.davis@email.com',
          parentPhone: '+1 (555) 456-7890',
          desiredGrade: '9th Grade',
          desiredSubjects: 'Biology, Chemistry, Literature',
          branchName: 'South Branch',
          applicationDate: '2024-01-08',
          status: 'waiting',
          priority: 3,
          notes: 'Waiting for space availability'
        },
        {
          id: 5,
          studentName: 'Noah Miller',
          parentName: 'Robert Miller',
          parentEmail: 'robert.miller@email.com',
          parentPhone: '+1 (555) 567-8901',
          desiredGrade: '11th Grade',
          desiredSubjects: 'Physics, Calculus, History',
          branchName: 'North Branch',
          applicationDate: '2024-01-05',
          status: 'rejected',
          priority: 2,
          notes: 'Program not available at requested location'
        }
      ];

      setTimeout(() => {
        setWaitingList(mockWaitingList);
        // Save to localStorage
        localStorage.setItem('waiting_list', JSON.stringify(mockWaitingList));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const handleAddApplication = async () => {
    if (!newEntry.studentName || !newEntry.parentName || !newEntry.parentEmail || !newEntry.desiredGrade) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newApp: WaitingListEntry = {
      id: waitingList.length + 1,
      studentName: newEntry.studentName,
      parentName: newEntry.parentName,
      parentEmail: newEntry.parentEmail,
      parentPhone: newEntry.parentPhone,
      desiredGrade: newEntry.desiredGrade,
      desiredSubjects: newEntry.desiredSubjects,
      branchName: newEntry.branchName,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'waiting',
      priority: Math.floor(Math.random() * 3) + 1,
      notes: newEntry.notes
    };

    const updatedWaitingList = [newApp, ...waitingList];
    setWaitingList(updatedWaitingList);
    
    // Save to localStorage
    localStorage.setItem('waiting_list', JSON.stringify(updatedWaitingList));
    
    // Reset form
    setNewEntry({
      studentName: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      desiredGrade: '',
      desiredSubjects: '',
      branchName: 'Downtown Branch',
      notes: ''
    });
    
    setShowAddModal(false);
    setIsSaving(false);
  };

  const handleEditEntry = (entry: WaitingListEntry) => {
    setEditingEntry(entry);
    setNewEntry({
      studentName: entry.studentName,
      parentName: entry.parentName,
      parentEmail: entry.parentEmail,
      parentPhone: entry.parentPhone,
      desiredGrade: entry.desiredGrade,
      desiredSubjects: entry.desiredSubjects,
      branchName: entry.branchName,
      notes: entry.notes
    });
    setShowEditModal(true);
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry || !newEntry.studentName || !newEntry.parentName || !newEntry.parentEmail || !newEntry.desiredGrade) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedEntry: WaitingListEntry = {
      ...editingEntry,
      studentName: newEntry.studentName,
      parentName: newEntry.parentName,
      parentEmail: newEntry.parentEmail,
      parentPhone: newEntry.parentPhone,
      desiredGrade: newEntry.desiredGrade,
      desiredSubjects: newEntry.desiredSubjects,
      branchName: newEntry.branchName,
      notes: newEntry.notes
    };

    const updatedWaitingList = waitingList.map(entry => entry.id === editingEntry.id ? updatedEntry : entry);
    setWaitingList(updatedWaitingList);
    
    // Save to localStorage
    localStorage.setItem('waiting_list', JSON.stringify(updatedWaitingList));
    
    // Reset form
    setNewEntry({
      studentName: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      desiredGrade: '',
      desiredSubjects: '',
      branchName: 'Downtown Branch',
      notes: ''
    });
    
    setShowEditModal(false);
    setEditingEntry(null);
    setIsSaving(false);
  };

  const handleDeleteEntry = async (entryId: number) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedWaitingList = waitingList.filter(entry => entry.id !== entryId);
    setWaitingList(updatedWaitingList);
    
    // Save to localStorage
    localStorage.setItem('waiting_list', JSON.stringify(updatedWaitingList));
    setIsSaving(false);
  };

  const updateStatus = (id: number, newStatus: WaitingListEntry['status']) => {
    const updatedWaitingList = waitingList.map(entry => 
      entry.id === id ? { ...entry, status: newStatus } : entry
    );
    setWaitingList(updatedWaitingList);
    
    // Save to localStorage
    localStorage.setItem('waiting_list', JSON.stringify(updatedWaitingList));
  };

  const filteredWaitingList = waitingList.filter(entry => {
    const matchesSearch = entry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.parentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || entry.desiredGrade === gradeFilter;
    const matchesBranch = branchFilter === 'all' || entry.branchName === branchFilter;
    return matchesSearch && matchesStatus && matchesGrade && matchesBranch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'enrolled': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 1: return <Star className="w-4 h-4 fill-current" />;
      case 2: return <Star className="w-4 h-4 fill-current" />;
      case 3: return <Star className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (user?.role !== 'admin' && user?.role !== 'branch_manager') {
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const totalApplications = waitingList.length;
  const waitingCount = waitingList.filter(e => e.status === 'waiting').length;
  const enrolledCount = waitingList.filter(e => e.status === 'enrolled').length;
  const highPriorityCount = waitingList.filter(e => e.priority === 1).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Waiting List</h1>
          <p className="text-gray-600 mt-1">Manage student applications and enrollment requests</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
            </div>
          </div>
        </div>
        <div className="stat-card hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Waiting</p>
              <p className="text-2xl font-bold text-gray-900">{waitingCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{enrolledCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-xl">
              <Star className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
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
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field"
          >
            <option value="all">All Status</option>
            <option value="waiting">Waiting</option>
            <option value="contacted">Contacted</option>
            <option value="enrolled">Enrolled</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="select-field"
          >
            <option value="all">All Grades</option>
            <option value="8th Grade">8th Grade</option>
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
            <option value="11th Grade">11th Grade</option>
            <option value="12th Grade">12th Grade</option>
          </select>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="select-field"
          >
            <option value="all">All Branches</option>
            <option value="Downtown Branch">Downtown Branch</option>
            <option value="North Branch">North Branch</option>
            <option value="South Branch">South Branch</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Student & Parent</th>
                <th className="table-header">Grade & Subjects</th>
                <th className="table-header">Branch</th>
                <th className="table-header">Application Date</th>
                <th className="table-header">Priority</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWaitingList.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-gray-900">{entry.studentName}</div>
                      <div className="text-sm text-gray-500">{entry.parentName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{entry.parentEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{entry.parentPhone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-gray-900">{entry.desiredGrade}</div>
                      <div className="text-sm text-gray-600">{entry.desiredSubjects}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-700">{entry.branchName}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-700">
                        {new Date(entry.applicationDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      {getPriorityIcon(entry.priority)}
                      <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(entry.priority)}`}>
                        {entry.priority === 1 ? 'High' : entry.priority === 2 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                                     <td className="table-cell">
                     <div className="flex space-x-2">
                       <button 
                         onClick={() => alert(`View application details: ${entry.studentName}`)}
                         className="btn-icon btn-icon-primary hover:bg-primary-100" 
                         title="View Details"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleEditEntry(entry)}
                         className="btn-icon btn-icon-secondary hover:bg-gray-100"
                         title="Edit Application"
                       >
                         <Edit className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDeleteEntry(entry.id)}
                         className="btn-icon btn-icon-danger hover:bg-red-100"
                         title="Delete Application"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                      {entry.status === 'waiting' && (
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => updateStatus(entry.id, 'contacted')}
                            className="btn-icon btn-icon-success hover:bg-green-100"
                            title="Mark as Contacted"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateStatus(entry.id, 'enrolled')}
                            className="btn-icon btn-icon-success hover:bg-green-100"
                            title="Mark as Enrolled"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateStatus(entry.id, 'rejected')}
                            className="btn-icon btn-icon-danger hover:bg-red-100"
                            title="Reject Application"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Application</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    value={newEntry.studentName}
                    onChange={(e) => setNewEntry({...newEntry, studentName: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter student name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name *</label>
                  <input
                    type="text"
                    value={newEntry.parentName}
                    onChange={(e) => setNewEntry({...newEntry, parentName: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter parent name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email *</label>
                  <input
                    type="email"
                    value={newEntry.parentEmail}
                    onChange={(e) => setNewEntry({...newEntry, parentEmail: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter parent email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                  <input
                    type="tel"
                    value={newEntry.parentPhone}
                    onChange={(e) => setNewEntry({...newEntry, parentPhone: e.target.value})}
                    className="input-field w-full"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desired Grade *</label>
                  <select
                    value={newEntry.desiredGrade}
                    onChange={(e) => setNewEntry({...newEntry, desiredGrade: e.target.value})}
                    className="select-field w-full"
                  >
                    <option value="">Select Grade</option>
                    <option value="8th Grade">8th Grade</option>
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                    <option value="11th Grade">11th Grade</option>
                    <option value="12th Grade">12th Grade</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desired Subjects</label>
                  <input
                    type="text"
                    value={newEntry.desiredSubjects}
                    onChange={(e) => setNewEntry({...newEntry, desiredSubjects: e.target.value})}
                    className="input-field w-full"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Branch</label>
                  <select
                    value={newEntry.branchName}
                    onChange={(e) => setNewEntry({...newEntry, branchName: e.target.value})}
                    className="select-field w-full"
                  >
                    <option value="Downtown Branch">Downtown Branch</option>
                    <option value="North Branch">North Branch</option>
                    <option value="South Branch">South Branch</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    className="input-field w-full h-20 resize-none"
                    placeholder="Additional notes or special requirements"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddApplication}
                  disabled={isSaving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Application
                    </>
                  )}
                </button>
              </div>
            </div>
                     </div>
         </div>
       )}

       {/* Edit Application Modal */}
       {showEditModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
             <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-gray-900">Edit Application</h2>
                 <button
                   onClick={() => setShowEditModal(false)}
                   className="text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                   <input
                     type="text"
                     value={newEntry.studentName}
                     onChange={(e) => setNewEntry({...newEntry, studentName: e.target.value})}
                     className="input-field w-full"
                     placeholder="Enter student name"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name *</label>
                   <input
                     type="text"
                     value={newEntry.parentName}
                     onChange={(e) => setNewEntry({...newEntry, parentName: e.target.value})}
                     className="input-field w-full"
                     placeholder="Enter parent name"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email *</label>
                   <input
                     type="email"
                     value={newEntry.parentEmail}
                     onChange={(e) => setNewEntry({...newEntry, parentEmail: e.target.value})}
                     className="input-field w-full"
                     placeholder="Enter parent email"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                   <input
                     type="tel"
                     value={newEntry.parentPhone}
                     onChange={(e) => setNewEntry({...newEntry, parentPhone: e.target.value})}
                     className="input-field w-full"
                     placeholder="Enter phone number"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Desired Grade *</label>
                   <select
                     value={newEntry.desiredGrade}
                     onChange={(e) => setNewEntry({...newEntry, desiredGrade: e.target.value})}
                     className="select-field w-full"
                   >
                     <option value="">Select Grade</option>
                     <option value="8th Grade">8th Grade</option>
                     <option value="9th Grade">9th Grade</option>
                     <option value="10th Grade">10th Grade</option>
                     <option value="11th Grade">11th Grade</option>
                     <option value="12th Grade">12th Grade</option>
                   </select>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Desired Subjects</label>
                   <input
                     type="text"
                     value={newEntry.desiredSubjects}
                     onChange={(e) => setNewEntry({...newEntry, desiredSubjects: e.target.value})}
                     className="input-field w-full"
                     placeholder="e.g., Mathematics, Physics, Chemistry"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Branch</label>
                   <select
                     value={newEntry.branchName}
                     onChange={(e) => setNewEntry({...newEntry, branchName: e.target.value})}
                     className="select-field w-full"
                   >
                     <option value="Downtown Branch">Downtown Branch</option>
                     <option value="North Branch">North Branch</option>
                     <option value="South Branch">South Branch</option>
                   </select>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                   <textarea
                     value={newEntry.notes}
                     onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                     className="input-field w-full h-20 resize-none"
                     placeholder="Additional notes or special requirements"
                   />
                 </div>
               </div>
               
               <div className="flex gap-3 mt-6">
                 <button
                   onClick={() => setShowEditModal(false)}
                   className="btn-secondary flex-1"
                   disabled={isSaving}
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleUpdateEntry}
                   disabled={isSaving}
                   className="btn-primary flex-1 flex items-center justify-center gap-2"
                 >
                   {isSaving ? (
                     <>
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                       Saving...
                     </>
                   ) : (
                     <>
                       <Save className="w-4 h-4" />
                       Update Application
                     </>
                   )}
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
