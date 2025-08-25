'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  BookOpen,
  ArrowLeft,
  Save,
  X,
  AlertCircle,
  GraduationCap,
  Receipt
} from 'lucide-react';

interface StudentFee {
  id: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  feeType: 'tuition' | 'registration' | 'library' | 'laboratory' | 'transportation' | 'other';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived';
  paidAmount: number;
  paymentDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  notes?: string;
}

export default function StudentFeesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFee, setEditingFee] = useState<StudentFee | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newFee, setNewFee] = useState({
    studentId: '',
    studentName: '',
    studentEmail: '',
    course: '',
    feeType: 'tuition' as 'tuition' | 'registration' | 'library' | 'laboratory' | 'transportation' | 'other',
    amount: '',
    dueDate: '',
    notes: ''
  });

  // Load data from localStorage or use mock data for first time
  useEffect(() => {
    const savedFees = localStorage.getItem('hr_student_fees');

    if (savedFees) {
      setFees(JSON.parse(savedFees));
      setLoading(false);
    } else {
      // Use mock data for first time
      const mockFees: StudentFee[] = [
        {
          id: 1,
          studentId: 'STU001',
          studentName: 'John Smith',
          studentEmail: 'john.smith@student.edu',
          course: 'Computer Science',
          feeType: 'tuition',
          amount: 2500,
          dueDate: '2024-02-15',
          status: 'paid',
          paidAmount: 2500,
          paymentDate: '2024-02-10',
          paymentMethod: 'Credit Card',
          receiptNumber: 'RCPT-2024-001',
          notes: 'Payment received on time'
        },
        {
          id: 2,
          studentId: 'STU002',
          studentName: 'Sarah Johnson',
          studentEmail: 'sarah.johnson@student.edu',
          course: 'Mathematics',
          feeType: 'tuition',
          amount: 2200,
          dueDate: '2024-02-20',
          status: 'pending',
          paidAmount: 0,
          notes: 'Payment reminder sent'
        },
        {
          id: 3,
          studentId: 'STU003',
          studentName: 'Mike Davis',
          studentEmail: 'mike.davis@student.edu',
          course: 'Physics',
          feeType: 'laboratory',
          amount: 500,
          dueDate: '2024-02-10',
          status: 'overdue',
          paidAmount: 0,
          notes: 'Follow up required'
        },
        {
          id: 4,
          studentId: 'STU004',
          studentName: 'Emily Wilson',
          studentEmail: 'emily.wilson@student.edu',
          course: 'English Literature',
          feeType: 'library',
          amount: 150,
          dueDate: '2024-02-25',
          status: 'partial',
          paidAmount: 75,
          notes: 'Partial payment received'
        }
      ];

      setTimeout(() => {
        setFees(mockFees);
        localStorage.setItem('hr_student_fees', JSON.stringify(mockFees));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const handleAddFee = async () => {
    if (!newFee.studentId || !newFee.studentName || !newFee.amount || !newFee.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newFeeRecord: StudentFee = {
      id: fees.length + 1,
      studentId: newFee.studentId,
      studentName: newFee.studentName,
      studentEmail: newFee.studentEmail,
      course: newFee.course,
      feeType: newFee.feeType,
      amount: parseFloat(newFee.amount),
      dueDate: newFee.dueDate,
      status: 'pending',
      paidAmount: 0,
      notes: newFee.notes
    };

    const updatedFees = [...fees, newFeeRecord];
    setFees(updatedFees);
    localStorage.setItem('hr_student_fees', JSON.stringify(updatedFees));
    
    // Reset form
    setNewFee({
      studentId: '',
      studentName: '',
      studentEmail: '',
      course: '',
      feeType: 'tuition',
      amount: '',
      dueDate: '',
      notes: ''
    });
    
    setShowAddModal(false);
    setIsSaving(false);
  };

  const handleEditFee = (fee: StudentFee) => {
    setEditingFee(fee);
    setNewFee({
      studentId: fee.studentId,
      studentName: fee.studentName,
      studentEmail: fee.studentEmail,
      course: fee.course,
      feeType: fee.feeType,
      amount: fee.amount.toString(),
      dueDate: fee.dueDate,
      notes: fee.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateFee = async () => {
    if (!editingFee || !newFee.studentId || !newFee.studentName || !newFee.amount || !newFee.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedFeeRecord: StudentFee = {
      ...editingFee,
      studentId: newFee.studentId,
      studentName: newFee.studentName,
      studentEmail: newFee.studentEmail,
      course: newFee.course,
      feeType: newFee.feeType,
      amount: parseFloat(newFee.amount),
      dueDate: newFee.dueDate,
      notes: newFee.notes
    };

    const updatedFees = fees.map(f => f.id === editingFee.id ? updatedFeeRecord : f);
    setFees(updatedFees);
    localStorage.setItem('hr_student_fees', JSON.stringify(updatedFees));
    
    // Reset form
    setNewFee({
      studentId: '',
      studentName: '',
      studentEmail: '',
      course: '',
      feeType: 'tuition',
      amount: '',
      dueDate: '',
      notes: ''
    });
    
    setShowEditModal(false);
    setEditingFee(null);
    setIsSaving(false);
  };

  const handleDeleteFee = async (feeId: number) => {
    if (!confirm('Are you sure you want to delete this fee record?')) {
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedFees = fees.filter(f => f.id !== feeId);
    setFees(updatedFees);
    localStorage.setItem('hr_student_fees', JSON.stringify(updatedFees));
    setIsSaving(false);
  };

  const handlePaymentUpdate = async (feeId: number, paidAmount: number) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedFees = fees.map(f => {
      if (f.id === feeId) {
        const newStatus: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived' = 
          paidAmount >= f.amount ? 'paid' : paidAmount > 0 ? 'partial' : 'pending';
        return {
          ...f,
          paidAmount: paidAmount,
          status: newStatus,
          paymentDate: paidAmount > 0 ? new Date().toISOString().split('T')[0] : f.paymentDate
        };
      }
      return f;
    });
    
    setFees(updatedFees);
    localStorage.setItem('hr_student_fees', JSON.stringify(updatedFees));
    setIsSaving(false);
  };

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    const matchesFeeType = feeTypeFilter === 'all' || fee.feeType === feeTypeFilter;
    return matchesSearch && matchesStatus && matchesFeeType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'waived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeeTypeIcon = (type: string) => {
    switch (type) {
      case 'tuition': return <GraduationCap className="w-4 h-4" />;
      case 'registration': return <User className="w-4 h-4" />;
      case 'library': return <BookOpen className="w-4 h-4" />;
      case 'laboratory': return <AlertCircle className="w-4 h-4" />;
      case 'transportation': return <Receipt className="w-4 h-4" />;
      case 'other': return <CreditCard className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate) < new Date(new Date().setDate(new Date().getDate() - 1));
  };

  if (user?.role !== 'admin' && user?.role !== 'hr_manager') {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/hr')}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Fees</h1>
              <p className="text-gray-600 mt-1">Manage student fee collection and payments</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Fee Record
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Fees</p>
                <p className="text-3xl font-bold text-blue-900">{fees.length}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <CreditCard className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Paid</p>
                <p className="text-3xl font-bold text-green-900">
                  {fees.filter(r => r.status === 'paid').length}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Overdue</p>
                <p className="text-3xl font-bold text-red-900">
                  {fees.filter(r => r.status === 'overdue').length}
                </p>
              </div>
              <div className="p-3 bg-red-200 rounded-xl">
                <Clock className="w-6 h-6 text-red-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Amount</p>
                <p className="text-3xl font-bold text-purple-900">
                  ${fees.reduce((acc, r) => acc + r.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-200 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-700" />
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
              placeholder="Search students..."
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
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="partial">Partial</option>
              <option value="waived">Waived</option>
            </select>
            <select
              value={feeTypeFilter}
              onChange={(e) => setFeeTypeFilter(e.target.value)}
              className="select-field"
            >
              <option value="all">All Types</option>
              <option value="tuition">Tuition</option>
              <option value="registration">Registration</option>
              <option value="library">Library</option>
              <option value="laboratory">Laboratory</option>
              <option value="transportation">Transportation</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Fees Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Student Details</th>
                  <th className="table-header">Fee Information</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{fee.studentName}</div>
                        <div className="text-sm text-gray-500">{fee.studentId}</div>
                        <div className="text-sm text-gray-400">{fee.course}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        {getFeeTypeIcon(fee.feeType)}
                        <span className="ml-2 capitalize">{fee.feeType}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">${fee.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          Paid: ${fee.paidAmount.toLocaleString()}
                        </div>
                        {fee.paidAmount > 0 && (
                          <div className="text-sm text-gray-400">
                            Balance: ${(fee.amount - fee.paidAmount).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className={`${isOverdue(fee.dueDate) ? 'text-red-600 font-medium' : ''}`}>
                        {new Date(fee.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => alert(`View fee details: ${fee.studentName} - ${fee.feeType}`)}
                          className="btn-icon btn-icon-primary hover:bg-primary-100" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditFee(fee)}
                          className="btn-icon btn-icon-secondary hover:bg-gray-100"
                          title="Edit Fee"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {fee.status !== 'paid' && (
                          <button 
                            onClick={() => {
                              const amount = prompt(`Enter payment amount for ${fee.studentName} (max: $${fee.amount})`);
                              if (amount && !isNaN(parseFloat(amount))) {
                                handlePaymentUpdate(fee.id, parseFloat(amount));
                              }
                            }}
                            className="btn-icon btn-icon-success hover:bg-green-100"
                            title="Record Payment"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteFee(fee.id)}
                          className="btn-icon btn-icon-danger hover:bg-red-100"
                          title="Delete Fee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Fee Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">New Fee Record</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                    <input
                      type="text"
                      value={newFee.studentId}
                      onChange={(e) => setNewFee({...newFee, studentId: e.target.value})}
                      className="input-field w-full"
                      placeholder="e.g., STU001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                    <input
                      type="text"
                      value={newFee.studentName}
                      onChange={(e) => setNewFee({...newFee, studentName: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter student name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                    <input
                      type="email"
                      value={newFee.studentEmail}
                      onChange={(e) => setNewFee({...newFee, studentEmail: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter student email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <input
                      type="text"
                      value={newFee.course}
                      onChange={(e) => setNewFee({...newFee, course: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter course name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                    <select
                      value={newFee.feeType}
                      onChange={(e) => setNewFee({...newFee, feeType: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="tuition">Tuition</option>
                      <option value="registration">Registration</option>
                      <option value="library">Library</option>
                      <option value="laboratory">Laboratory</option>
                      <option value="transportation">Transportation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      value={newFee.amount}
                      onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                      className="input-field w-full"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                    <input
                      type="date"
                      value={newFee.dueDate}
                      onChange={(e) => setNewFee({...newFee, dueDate: e.target.value})}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newFee.notes}
                      onChange={(e) => setNewFee({...newFee, notes: e.target.value})}
                      className="input-field w-full"
                      rows={2}
                      placeholder="Additional notes"
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
                    onClick={handleAddFee}
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
                        Create Fee Record
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Fee Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit Fee Record</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                    <input
                      type="text"
                      value={newFee.studentId}
                      onChange={(e) => setNewFee({...newFee, studentId: e.target.value})}
                      className="input-field w-full"
                      placeholder="e.g., STU001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                    <input
                      type="text"
                      value={newFee.studentName}
                      onChange={(e) => setNewFee({...newFee, studentName: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter student name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                    <input
                      type="email"
                      value={newFee.studentEmail}
                      onChange={(e) => setNewFee({...newFee, studentEmail: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter student email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <input
                      type="text"
                      value={newFee.course}
                      onChange={(e) => setNewFee({...newFee, course: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter course name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                    <select
                      value={newFee.feeType}
                      onChange={(e) => setNewFee({...newFee, feeType: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="tuition">Tuition</option>
                      <option value="registration">Registration</option>
                      <option value="library">Library</option>
                      <option value="laboratory">Laboratory</option>
                      <option value="transportation">Transportation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      value={newFee.amount}
                      onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                      className="input-field w-full"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                    <input
                      type="date"
                      value={newFee.dueDate}
                      onChange={(e) => setNewFee({...newFee, dueDate: e.target.value})}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newFee.notes}
                      onChange={(e) => setNewFee({...newFee, notes: e.target.value})}
                      className="input-field w-full"
                      rows={2}
                      placeholder="Additional notes"
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
                    onClick={handleUpdateFee}
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
                        Update Fee Record
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
