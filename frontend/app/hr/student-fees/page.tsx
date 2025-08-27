'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  User, 
  Search, 
  Filter,
  Plus, 
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  FileText,
  Receipt,
  TrendingUp,
  TrendingDown,
  Clock,
  X,
  Save
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  classes: string[];
  totalFees: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentHistory: Payment[];
}

interface Payment {
  id: number;
  studentId: number;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'bank_transfer' | 'online';
  status: 'pending' | 'completed' | 'failed';
  receiptNumber: string;
  notes?: string;
}

interface FeeStructure {
  id: number;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one_time';
  description: string;
  isActive: boolean;
}

export default function StudentFeesPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddFee, setShowAddFee] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newPayment, setNewPayment] = useState({
    studentId: 0,
    amount: '',
    method: 'card' as 'cash' | 'card' | 'bank_transfer' | 'online',
    notes: ''
  });
  const [newFee, setNewFee] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'annually' | 'one_time',
    description: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem('student_fees_students');
    const savedPayments = localStorage.getItem('student_fees_payments');
    const savedFeeStructures = localStorage.getItem('student_fees_structures');

    if (savedStudents && savedPayments && savedFeeStructures) {
      setStudents(JSON.parse(savedStudents));
      setPayments(JSON.parse(savedPayments));
      setFeeStructures(JSON.parse(savedFeeStructures));
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
          classes: ['Mathematics', 'English', 'Science'],
          totalFees: 5000,
          paidAmount: 3500,
          outstandingAmount: 1500,
          paymentHistory: []
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob.smith@school.com',
          grade: '9th Grade',
          parentName: 'Mary Smith',
          parentPhone: '+44 7911 234567',
          parentEmail: 'mary.smith@email.com',
          classes: ['Mathematics', 'History', 'Art'],
          totalFees: 4500,
          paidAmount: 4500,
          outstandingAmount: 0,
          paymentHistory: []
        }
      ];

      const samplePayments: Payment[] = [
        {
          id: 1,
          studentId: 1,
          amount: 1000,
          date: '2024-01-15',
          method: 'card',
          status: 'completed',
          receiptNumber: 'RCP001',
          notes: 'First installment'
        },
        {
          id: 2,
          studentId: 1,
          amount: 1000,
          date: '2024-02-15',
          method: 'bank_transfer',
          status: 'completed',
          receiptNumber: 'RCP002',
          notes: 'Second installment'
        }
      ];

      const sampleFeeStructures: FeeStructure[] = [
        {
          id: 1,
          name: 'Tuition Fee',
          amount: 3000,
          frequency: 'annually',
          description: 'Annual tuition fee for all students',
          isActive: true
        },
        {
          id: 2,
          name: 'Lab Fee',
          amount: 500,
          frequency: 'annually',
          description: 'Laboratory equipment and materials fee',
          isActive: true
        },
        {
          id: 3,
          name: 'Sports Fee',
          amount: 200,
          frequency: 'annually',
          description: 'Sports equipment and facilities fee',
          isActive: true
        }
      ];

      setStudents(sampleStudents);
      setPayments(samplePayments);
      setFeeStructures(sampleFeeStructures);
      localStorage.setItem('student_fees_students', JSON.stringify(sampleStudents));
      localStorage.setItem('student_fees_payments', JSON.stringify(samplePayments));
      localStorage.setItem('student_fees_structures', JSON.stringify(sampleFeeStructures));
    }
        setLoading(false);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('student_fees_students', JSON.stringify(students));
      localStorage.setItem('student_fees_payments', JSON.stringify(payments));
      localStorage.setItem('student_fees_structures', JSON.stringify(feeStructures));
    }
  }, [students, payments, feeStructures, loading]);

  const handleAddPayment = () => {
    if (!newPayment.studentId || !newPayment.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const payment: Payment = {
      id: Date.now(),
      studentId: newPayment.studentId,
      amount: parseFloat(newPayment.amount),
      date: new Date().toISOString().split('T')[0],
      method: newPayment.method,
      status: 'completed',
      receiptNumber: `RCP${Date.now()}`,
      notes: newPayment.notes
    };

    const updatedPayments = [...payments, payment];
    setPayments(updatedPayments);

    // Update student's paid amount
    const updatedStudents = students.map(student => {
      if (student.id === newPayment.studentId) {
        const newPaidAmount = student.paidAmount + parseFloat(newPayment.amount);
        return {
          ...student,
          paidAmount: newPaidAmount,
          outstandingAmount: student.totalFees - newPaidAmount,
          paymentHistory: [...student.paymentHistory, payment]
        };
      }
      return student;
    });
    setStudents(updatedStudents);

    setNewPayment({
      studentId: 0,
      amount: '',
      method: 'card',
      notes: ''
    });
    setShowAddPayment(false);
  };

  const handleAddFee = () => {
    if (!newFee.name || !newFee.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const fee: FeeStructure = {
      id: Date.now(),
      name: newFee.name,
      amount: parseFloat(newFee.amount),
      frequency: newFee.frequency,
      description: newFee.description,
      isActive: true
    };

    setFeeStructures([...feeStructures, fee]);
    setNewFee({
      name: '',
      amount: '',
      frequency: 'monthly',
      description: ''
    });
    setShowAddFee(false);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'paid' && student.outstandingAmount === 0) ||
                         (statusFilter === 'outstanding' && student.outstandingAmount > 0);
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = students.reduce((sum, student) => sum + student.paidAmount, 0);
  const totalOutstanding = students.reduce((sum, student) => sum + student.outstandingAmount, 0);
  const totalStudents = students.length;
  const paidStudents = students.filter(s => s.outstandingAmount === 0).length;

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Student Fees Management</h1>
              <p className="text-green-100 text-lg">Track payments, manage fees, and monitor revenue</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">£{totalRevenue.toLocaleString()}</div>
                  <div className="text-green-100 text-sm">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">£{totalOutstanding.toLocaleString()}</div>
                  <div className="text-green-100 text-sm">Outstanding</div>
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
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">£{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
                <p className="text-3xl font-bold text-red-600">£{totalOutstanding.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fully Paid</p>
                <p className="text-3xl font-bold text-purple-600">{paidStudents}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowAddPayment(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Record Payment
          </button>
          <button
            onClick={() => setShowAddFee(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Fee Structure
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field"
            >
            <option value="all">All Students</option>
            <option value="paid">Fully Paid</option>
            <option value="outstanding">Outstanding</option>
            </select>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Student</th>
                  <th className="table-header">Grade</th>
                  <th className="table-header">Parent</th>
                  <th className="table-header">Total Fees</th>
                  <th className="table-header">Paid Amount</th>
                  <th className="table-header">Outstanding</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </td>
                    <td className="table-cell">{student.grade}</td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{student.parentName}</div>
                        <div className="text-sm text-gray-500">{student.parentPhone}</div>
                      </div>
                    </td>
                    <td className="table-cell">£{student.totalFees.toLocaleString()}</td>
                    <td className="table-cell">£{student.paidAmount.toLocaleString()}</td>
                    <td className="table-cell">£{student.outstandingAmount.toLocaleString()}</td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.outstandingAmount === 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.outstandingAmount === 0 ? 'Paid' : 'Outstanding'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                            setSelectedStudent(student);
                            setNewPayment({...newPayment, studentId: student.id});
                            setShowAddPayment(true);
                          }}
                          className="btn-icon btn-icon-primary"
                            title="Record Payment"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        <button 
                          onClick={() => alert(`View payment history for ${student.name}`)}
                          className="btn-icon btn-icon-secondary"
                          title="View History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fee Structures */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Structures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeStructures.map((fee) => (
              <div key={fee.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{fee.name}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    fee.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {fee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-2">£{fee.amount}</p>
                <p className="text-sm text-gray-600 mb-2">{fee.frequency}</p>
                <p className="text-sm text-gray-500">{fee.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Payment Modal */}
        {showAddPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
                  <button
                    onClick={() => setShowAddPayment(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                    <select
                      value={newPayment.studentId}
                      onChange={(e) => setNewPayment({...newPayment, studentId: parseInt(e.target.value)})}
                      className="select-field w-full"
                    >
                      <option value={0}>Select Student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} - {student.grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={newPayment.method}
                      onChange={(e) => setNewPayment({...newPayment, method: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="card">Card</option>
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newPayment.notes}
                      onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                      className="input-field w-full"
                      rows={3}
                      placeholder="Optional notes"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddPayment(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPayment}
                    className="btn-primary flex-1"
                  >
                    Record Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Fee Structure Modal */}
        {showAddFee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Add Fee Structure</h2>
                  <button
                    onClick={() => setShowAddFee(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Name *</label>
                    <input
                      type="text"
                      value={newFee.name}
                      onChange={(e) => setNewFee({...newFee, name: e.target.value})}
                      className="input-field w-full"
                      placeholder="e.g., Tuition Fee"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      value={newFee.amount}
                      onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      value={newFee.frequency}
                      onChange={(e) => setNewFee({...newFee, frequency: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                      <option value="one_time">One Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newFee.description}
                      onChange={(e) => setNewFee({...newFee, description: e.target.value})}
                      className="input-field w-full"
                      rows={3}
                      placeholder="Fee description"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddFee(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFee}
                    className="btn-primary flex-1"
                  >
                    Add Fee
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
