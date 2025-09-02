'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Receipt,
  FileText,
  Filter,
  Search,
  Plus,
  Eye,
  Wallet,
  Building,
  Star,
  Award,
  Percent,
  History,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TuitionFee {
  id: number;
  description: string;
  subject: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount: number;
  paymentDate?: string;
  invoiceNumber: string;
  term: string;
  academicYear: string;
}

interface PaymentHistory {
  id: number;
  type: 'payment' | 'refund' | 'adjustment';
  description: string;
  amount: number;
  date: string;
  method: 'card' | 'bank_transfer' | 'paypal' | 'stripe';
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
  invoiceNumber?: string;
}

interface Scholarship {
  id: number;
  name: string;
  description: string;
  amount: number;
  type: 'percentage' | 'fixed';
  appliedDate: string;
  status: 'active' | 'expired' | 'pending';
  expiryDate?: string;
}

interface Receipt {
  id: number;
  invoiceNumber: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  status: 'issued' | 'sent';
}

export default function StudentFeesPage() {
  const { user } = useAuth();
  const [tuitionFees, setTuitionFees] = useState<TuitionFee[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [activeTab, setActiveTab] = useState<'fees' | 'history' | 'scholarships' | 'receipts'>('fees');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<TuitionFee | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'paypal' | 'stripe'>('card');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Check if user is student
  if (user && user.role !== 'student') {
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
    if (user) {
      setLoading(true);
      loadFeesData();
      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFeesData = () => {
    if (!user) return;
    
    try {
      // Load tuition fees
      const savedFees = localStorage.getItem('student_tuition_fees');
      if (savedFees) {
        setTuitionFees(JSON.parse(savedFees));
      } else {
        // Mock tuition fees
        const mockFees: TuitionFee[] = [
          {
            id: 1,
            description: 'Mathematics Tuition - January 2024',
            subject: 'Mathematics',
            amount: 250,
            dueDate: '2024-01-31',
            status: 'pending',
            paidAmount: 0,
            invoiceNumber: 'INV-2024-001',
            term: 'Spring Term',
            academicYear: '2023-2024'
          },
          {
            id: 2,
            description: 'English Literature Tuition - January 2024',
            subject: 'English Literature',
            amount: 200,
            dueDate: '2024-01-31',
            status: 'paid',
            paidAmount: 200,
            paymentDate: '2024-01-15T10:30:00',
            invoiceNumber: 'INV-2024-002',
            term: 'Spring Term',
            academicYear: '2023-2024'
          },
          {
            id: 3,
            description: 'Science Tuition - January 2024',
            subject: 'Science',
            amount: 275,
            dueDate: '2024-01-31',
            status: 'partial',
            paidAmount: 150,
            paymentDate: '2024-01-10T14:20:00',
            invoiceNumber: 'INV-2024-003',
            term: 'Spring Term',
            academicYear: '2023-2024'
          },
          {
            id: 4,
            description: 'History Tuition - December 2023',
            subject: 'History',
            amount: 180,
            dueDate: '2023-12-31',
            status: 'overdue',
            paidAmount: 0,
            invoiceNumber: 'INV-2023-012',
            term: 'Autumn Term',
            academicYear: '2023-2024'
          },
          {
            id: 5,
            description: 'French Tuition - February 2024',
            subject: 'French',
            amount: 220,
            dueDate: '2024-02-29',
            status: 'pending',
            paidAmount: 0,
            invoiceNumber: 'INV-2024-004',
            term: 'Spring Term',
            academicYear: '2023-2024'
          }
        ];
        setTuitionFees(mockFees);
        localStorage.setItem('student_tuition_fees', JSON.stringify(mockFees));
      }

      // Load payment history
      const savedHistory = localStorage.getItem('student_payment_history');
      if (savedHistory) {
        setPaymentHistory(JSON.parse(savedHistory));
      } else {
        // Mock payment history
        const mockHistory: PaymentHistory[] = [
          {
            id: 1,
            type: 'payment',
            description: 'English Literature Tuition - January 2024',
            amount: 200,
            date: '2024-01-15T10:30:00',
            method: 'card',
            status: 'completed',
            transactionId: 'TXN-2024-001',
            invoiceNumber: 'INV-2024-002'
          },
          {
            id: 2,
            type: 'payment',
            description: 'Science Tuition - Partial Payment',
            amount: 150,
            date: '2024-01-10T14:20:00',
            method: 'paypal',
            status: 'completed',
            transactionId: 'TXN-2024-002',
            invoiceNumber: 'INV-2024-003'
          },
          {
            id: 3,
            type: 'payment',
            description: 'Mathematics Tuition - December 2023',
            amount: 250,
            date: '2023-12-15T09:15:00',
            method: 'bank_transfer',
            status: 'completed',
            transactionId: 'TXN-2023-025'
          },
          {
            id: 4,
            type: 'refund',
            description: 'Class Cancellation Refund',
            amount: 50,
            date: '2023-12-20T16:45:00',
            method: 'card',
            status: 'completed',
            transactionId: 'TXN-2023-026'
          }
        ];
        setPaymentHistory(mockHistory);
        localStorage.setItem('student_payment_history', JSON.stringify(mockHistory));
      }

      // Load scholarships
      const savedScholarships = localStorage.getItem('student_scholarships');
      if (savedScholarships) {
        setScholarships(JSON.parse(savedScholarships));
      } else {
        // Mock scholarships
        const mockScholarships: Scholarship[] = [
          {
            id: 1,
            name: 'Academic Excellence Scholarship',
            description: '15% discount on all tuition fees for maintaining an A average',
            amount: 15,
            type: 'percentage',
            appliedDate: '2023-09-01',
            status: 'active',
            expiryDate: '2024-08-31'
          },
          {
            id: 2,
            name: 'Mathematics Competition Winner',
            description: 'One-time scholarship for winning regional mathematics competition',
            amount: 500,
            type: 'fixed',
            appliedDate: '2023-11-15',
            status: 'active'
          }
        ];
        setScholarships(mockScholarships);
        localStorage.setItem('student_scholarships', JSON.stringify(mockScholarships));
      }

      // Load receipts
      const savedReceipts = localStorage.getItem('student_receipts');
      if (savedReceipts) {
        setReceipts(JSON.parse(savedReceipts));
      } else {
        // Mock receipts
        const mockReceipts: Receipt[] = [
          {
            id: 1,
            invoiceNumber: 'INV-2024-002',
            amount: 200,
            date: '2024-01-15T10:30:00',
            description: 'English Literature Tuition - January 2024',
            paymentMethod: 'Credit Card',
            status: 'issued'
          },
          {
            id: 2,
            invoiceNumber: 'INV-2024-003',
            amount: 150,
            date: '2024-01-10T14:20:00',
            description: 'Science Tuition - Partial Payment',
            paymentMethod: 'PayPal',
            status: 'sent'
          }
        ];
        setReceipts(mockReceipts);
        localStorage.setItem('student_receipts', JSON.stringify(mockReceipts));
      }

    } catch (error) {
      console.error('Error loading fees data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (fee: TuitionFee) => {
    setSelectedFee(fee);
    setPaymentAmount((fee.amount - fee.paidAmount).toString());
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (selectedFee && paymentAmount) {
      const amount = parseFloat(paymentAmount);
      const newPaidAmount = selectedFee.paidAmount + amount;
      const newStatus: 'pending' | 'paid' | 'overdue' | 'partial' = 
        newPaidAmount >= selectedFee.amount ? 'paid' : 'partial';

      // Update fee
      const updatedFees = tuitionFees.map(fee =>
        fee.id === selectedFee.id
          ? {
              ...fee,
              paidAmount: newPaidAmount,
              status: newStatus,
              paymentDate: new Date().toISOString()
            }
          : fee
      );
      setTuitionFees(updatedFees);
      localStorage.setItem('student_tuition_fees', JSON.stringify(updatedFees));

      // Add to payment history
      const newPayment: PaymentHistory = {
        id: Date.now(),
        type: 'payment',
        description: selectedFee.description,
        amount,
        date: new Date().toISOString(),
        method: paymentMethod,
        status: 'completed',
        transactionId: `TXN-${Date.now()}`,
        invoiceNumber: selectedFee.invoiceNumber
      };
      const updatedHistory = [newPayment, ...paymentHistory];
      setPaymentHistory(updatedHistory);
      localStorage.setItem('student_payment_history', JSON.stringify(updatedHistory));

      setShowPaymentModal(false);
      setSelectedFee(null);
      setPaymentAmount('');
      toast.success('Payment processed successfully!');
    }
  };

  const downloadReceipt = (receipt: Receipt) => {
    // Create a mock PDF download
    const blob = new Blob([`Receipt: ${receipt.invoiceNumber}\nAmount: £${receipt.amount}\nDate: ${receipt.date}\nDescription: ${receipt.description}\nPayment Method: ${receipt.paymentMethod}\nStatus: ${receipt.status}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receipt.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success(`Receipt ${receipt.invoiceNumber} downloaded successfully!`);
  };

  const downloadInvoice = (fee: TuitionFee) => {
    // Create a mock PDF download
    const blob = new Blob([`Invoice: ${fee.invoiceNumber}\nSubject: ${fee.subject}\nAmount: £${fee.amount}\nDue Date: ${fee.dueDate}\nTerm: ${fee.term}\nAcademic Year: ${fee.academicYear}\nStatus: ${fee.status}\nPaid Amount: £${fee.paidAmount}\nOutstanding: £${fee.amount - fee.paidAmount}`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${fee.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success(`Invoice ${fee.invoiceNumber} downloaded successfully!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
      case 'stripe':
        return <CreditCard className="w-4 h-4" />;
      case 'paypal':
        return <Wallet className="w-4 h-4" />;
      case 'bank_transfer':
      case 'bank':
        return <Building className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const filteredFees = tuitionFees.filter(fee =>
    statusFilter === 'all' || fee.status === statusFilter
  );

  const totalOutstanding = tuitionFees.reduce((sum, fee) => 
    sum + (fee.amount - fee.paidAmount), 0
  );

  const totalPaid = paymentHistory
    .filter(p => p.type === 'payment' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeScholarshipValue = scholarships
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.type === 'fixed' ? s.amount : 0), 0);

  // Show loading state first
  if (loading || !user) {
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
            <h1 className="text-2xl font-bold text-gray-900">Fees & Payments</h1>
            <p className="text-gray-600">Manage your tuition fees, payments, and view financial information</p>
          </div>
          <button
            onClick={() => {
              // If there are fees with outstanding amounts, select the first one
              const outstandingFees = tuitionFees.filter(fee => fee.status !== 'paid');
              if (outstandingFees.length > 0) {
                setSelectedFee(outstandingFees[0]);
                setPaymentAmount((outstandingFees[0].amount - outstandingFees[0].paidAmount).toString());
                setShowPaymentModal(true);
              } else {
                toast.success('No outstanding fees to pay');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Make Payment
          </button>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                <p className="text-2xl font-semibold text-gray-900">£{totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-semibold text-gray-900">£{totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scholarship Value</p>
                <p className="text-2xl font-semibold text-gray-900">£{activeScholarshipValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tuitionFees.filter(f => f.status === 'overdue').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'fees', name: 'Tuition Fees', icon: DollarSign },
                { id: 'history', name: 'Payment History', icon: History },
                { id: 'scholarships', name: 'Scholarships', icon: Award },
                { id: 'receipts', name: 'Receipts', icon: Receipt }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'fees' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Tuition Fees</h3>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredFees.map((fee) => (
                    <div key={fee.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">{fee.description}</h4>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                              {fee.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-gray-600">Subject:</span>
                              <p className="font-medium text-gray-900">{fee.subject}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Amount:</span>
                              <p className="font-medium text-gray-900">£{fee.amount}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Paid:</span>
                              <p className="font-medium text-gray-900">£{fee.paidAmount}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Outstanding:</span>
                              <p className="font-medium text-gray-900">£{fee.amount - fee.paidAmount}</p>
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              <span>Invoice: {fee.invoiceNumber}</span>
                            </div>
                            <div className="flex items-center">
                              <span>{fee.term} - {fee.academicYear}</span>
                            </div>
                          </div>

                          {fee.paymentDate && (
                            <div className="mt-2 text-sm text-green-600">
                              Last payment: {new Date(fee.paymentDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          {fee.status !== 'paid' && (
                            <button
                              onClick={() => handlePayment(fee)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => downloadInvoice(fee)}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment History</h3>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-4 ${
                            payment.type === 'payment' ? 'bg-green-100' : 
                            payment.type === 'refund' ? 'bg-blue-100' : 'bg-yellow-100'
                          }`}>
                            {payment.type === 'payment' ? (
                              <ArrowUpRight className="w-5 h-5 text-green-600" />
                            ) : payment.type === 'refund' ? (
                              <ArrowDownRight className="w-5 h-5 text-blue-600" />
                            ) : (
                              <RefreshCw className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{payment.description}</h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              {getPaymentMethodIcon(payment.method)}
                              <span className="ml-1 capitalize">{payment.method.replace('_', ' ')}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(payment.date).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <span>ID: {payment.transactionId}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${
                            payment.type === 'refund' ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {payment.type === 'refund' ? '+' : ''}£{payment.amount}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'scholarships' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Scholarships & Discounts</h3>
                <div className="space-y-4">
                  {scholarships.map((scholarship) => (
                    <div key={scholarship.id} className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <Award className="w-5 h-5 text-purple-600 mr-2" />
                            <h4 className="text-lg font-semibold text-gray-900">{scholarship.name}</h4>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scholarship.status)}`}>
                              {scholarship.status}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">{scholarship.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Value:</span>
                              <p className="font-medium text-gray-900">
                                {scholarship.type === 'percentage' ? `${scholarship.amount}%` : `£${scholarship.amount}`}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Applied Date:</span>
                              <p className="font-medium text-gray-900">{new Date(scholarship.appliedDate).toLocaleDateString()}</p>
                            </div>
                            {scholarship.expiryDate && (
                              <div>
                                <span className="text-gray-600">Expires:</span>
                                <p className="font-medium text-gray-900">{new Date(scholarship.expiryDate).toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {scholarship.type === 'percentage' ? (
                            <Percent className="w-8 h-8 text-purple-600" />
                          ) : (
                            <DollarSign className="w-8 h-8 text-purple-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'receipts' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Receipts & Invoices</h3>
                <div className="space-y-4">
                  {receipts.map((receipt) => (
                    <div key={receipt.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded-lg mr-4">
                            <Receipt className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{receipt.description}</h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <span>Invoice: {receipt.invoiceNumber}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(receipt.date).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <span>{receipt.paymentMethod}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">£{receipt.amount}</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(receipt.status)}`}>
                              {receipt.status}
                            </span>
                          </div>
                          <button
                            onClick={() => downloadReceipt(receipt)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedFee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Make Payment</h3>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{selectedFee.description}</h4>
                    <div className="text-sm text-gray-600">
                      <p>Total Amount: £{selectedFee.amount}</p>
                      <p>Paid: £{selectedFee.paidAmount}</p>
                      <p className="font-medium">Outstanding: £{selectedFee.amount - selectedFee.paidAmount}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min="0"
                      max={selectedFee.amount - selectedFee.paidAmount}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="mr-2"
                        />
                        <CreditCard className="w-4 h-4 mr-2" />
                        Credit/Debit Card
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="mr-2"
                        />
                        <Wallet className="w-4 h-4 mr-2" />
                        PayPal
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="bank_transfer"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="mr-2"
                        />
                        <Building className="w-4 h-4 mr-2" />
                        Bank Transfer
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Process Payment
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
