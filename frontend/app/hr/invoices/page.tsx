'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
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
  Download,
  Send,
  ArrowLeft,
  Save,
  X,
  Building,
  User,
  Receipt
} from 'lucide-react';

interface Invoice {
  id: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  description: string;
  amount: number;
  tax: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: string;
  notes?: string;
}

export default function InvoicesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    description: '',
    amount: '',
    tax: '0',
    dueDate: '',
    notes: ''
  });

  // Load data from localStorage or use mock data for first time
  useEffect(() => {
    const savedInvoices = localStorage.getItem('hr_invoices');

    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
      setLoading(false);
    } else {
      // Use mock data for first time
      const mockInvoices: Invoice[] = [
        {
          id: 1,
          invoiceNumber: 'INV-2024-001',
          clientName: 'ABC Corporation',
          clientEmail: 'accounts@abccorp.com',
          description: 'Educational consulting services for Q1 2024',
          amount: 5000,
          tax: 500,
          totalAmount: 5500,
          issueDate: '2024-01-15',
          dueDate: '2024-02-15',
          status: 'paid',
          paymentMethod: 'Bank Transfer',
          paymentDate: '2024-02-10',
          notes: 'Payment received on time'
        },
        {
          id: 2,
          invoiceNumber: 'INV-2024-002',
          clientName: 'XYZ School District',
          clientEmail: 'finance@xyzschools.edu',
          description: 'Professional development training sessions',
          amount: 3500,
          tax: 350,
          totalAmount: 3850,
          issueDate: '2024-01-20',
          dueDate: '2024-02-20',
          status: 'sent'
        },
        {
          id: 3,
          invoiceNumber: 'INV-2024-003',
          clientName: 'Tech Solutions Inc.',
          clientEmail: 'billing@techsolutions.com',
          description: 'IT infrastructure consultation',
          amount: 7500,
          tax: 750,
          totalAmount: 8250,
          issueDate: '2024-01-25',
          dueDate: '2024-02-25',
          status: 'overdue',
          notes: 'Follow up required'
        }
      ];

      setTimeout(() => {
        setInvoices(mockInvoices);
        localStorage.setItem('hr_invoices', JSON.stringify(mockInvoices));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const handleAddInvoice = async () => {
    if (!newInvoice.invoiceNumber || !newInvoice.clientName || !newInvoice.amount || !newInvoice.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const amount = parseFloat(newInvoice.amount);
    const tax = parseFloat(newInvoice.tax);
    
    const newInv: Invoice = {
      id: invoices.length + 1,
      invoiceNumber: newInvoice.invoiceNumber,
      clientName: newInvoice.clientName,
      clientEmail: newInvoice.clientEmail,
      description: newInvoice.description,
      amount: amount,
      tax: tax,
      totalAmount: amount + tax,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate,
      status: 'draft',
      notes: newInvoice.notes
    };

    const updatedInvoices = [...invoices, newInv];
    setInvoices(updatedInvoices);
    localStorage.setItem('hr_invoices', JSON.stringify(updatedInvoices));
    
    // Reset form
    setNewInvoice({
      invoiceNumber: '',
      clientName: '',
      clientEmail: '',
      description: '',
      amount: '',
      tax: '0',
      dueDate: '',
      notes: ''
    });
    
    setShowAddModal(false);
    setIsSaving(false);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setNewInvoice({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      description: invoice.description,
      amount: invoice.amount.toString(),
      tax: invoice.tax.toString(),
      dueDate: invoice.dueDate,
      notes: invoice.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateInvoice = async () => {
    if (!editingInvoice || !newInvoice.invoiceNumber || !newInvoice.clientName || !newInvoice.amount || !newInvoice.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const amount = parseFloat(newInvoice.amount);
    const tax = parseFloat(newInvoice.tax);
    
    const updatedInv: Invoice = {
      ...editingInvoice,
      invoiceNumber: newInvoice.invoiceNumber,
      clientName: newInvoice.clientName,
      clientEmail: newInvoice.clientEmail,
      description: newInvoice.description,
      amount: amount,
      tax: tax,
      totalAmount: amount + tax,
      dueDate: newInvoice.dueDate,
      notes: newInvoice.notes
    };

    const updatedInvoices = invoices.map(inv => inv.id === editingInvoice.id ? updatedInv : inv);
    setInvoices(updatedInvoices);
    localStorage.setItem('hr_invoices', JSON.stringify(updatedInvoices));
    
    // Reset form
    setNewInvoice({
      invoiceNumber: '',
      clientName: '',
      clientEmail: '',
      description: '',
      amount: '',
      tax: '0',
      dueDate: '',
      notes: ''
    });
    
    setShowEditModal(false);
    setEditingInvoice(null);
    setIsSaving(false);
  };

  const handleDeleteInvoice = async (invoiceId: number) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId);
    setInvoices(updatedInvoices);
    localStorage.setItem('hr_invoices', JSON.stringify(updatedInvoices));
    setIsSaving(false);
  };

  const handleStatusUpdate = async (invoiceId: number, newStatus: Invoice['status']) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: newStatus,
          paymentDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : inv.paymentDate
        };
      }
      return inv;
    });
    
    setInvoices(updatedInvoices);
    localStorage.setItem('hr_invoices', JSON.stringify(updatedInvoices));
    setIsSaving(false);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600 mt-1">Manage and track invoices</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Invoices</p>
                <p className="text-3xl font-bold text-blue-900">{invoices.length}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <FileText className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Paid</p>
                <p className="text-3xl font-bold text-green-900">
                  {invoices.filter(r => r.status === 'paid').length}
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
                  {invoices.filter(r => r.status === 'overdue').length}
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
                  ${invoices.reduce((acc, r) => acc + r.totalAmount, 0).toLocaleString()}
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
              placeholder="Search invoices..."
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
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Invoice Details</th>
                  <th className="table-header">Client</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Issue Date</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">{invoice.description}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{invoice.clientName}</div>
                        <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">${invoice.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">${invoice.amount} + ${invoice.tax} tax</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="table-cell">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <div className={`${isOverdue(invoice.dueDate) ? 'text-red-600 font-medium' : ''}`}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => alert(`View invoice details: ${invoice.invoiceNumber}`)}
                          className="btn-icon btn-icon-primary hover:bg-primary-100" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditInvoice(invoice)}
                          className="btn-icon btn-icon-secondary hover:bg-gray-100"
                          title="Edit Invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => alert(`Download invoice: ${invoice.invoiceNumber}`)}
                          className="btn-icon btn-icon-success hover:bg-green-100"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button 
                            onClick={() => handleStatusUpdate(invoice.id, 'sent')}
                            className="btn-icon btn-icon-primary hover:bg-blue-100"
                            title="Send Invoice"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {invoice.status === 'sent' && (
                          <button 
                            onClick={() => handleStatusUpdate(invoice.id, 'paid')}
                            className="btn-icon btn-icon-success hover:bg-green-100"
                            title="Mark as Paid"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="btn-icon btn-icon-danger hover:bg-red-100"
                          title="Delete Invoice"
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

        {/* Add Invoice Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">New Invoice</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number *</label>
                    <input
                      type="text"
                      value={newInvoice.invoiceNumber}
                      onChange={(e) => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})}
                      className="input-field w-full"
                      placeholder="e.g., INV-2024-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                    <input
                      type="text"
                      value={newInvoice.clientName}
                      onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter client name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                    <input
                      type="email"
                      value={newInvoice.clientEmail}
                      onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter client email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                      className="input-field w-full"
                      rows={3}
                      placeholder="Enter invoice description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                      <input
                        type="number"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                        className="input-field w-full"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
                      <input
                        type="number"
                        value={newInvoice.tax}
                        onChange={(e) => setNewInvoice({...newInvoice, tax: e.target.value})}
                        className="input-field w-full"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                    <input
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newInvoice.notes}
                      onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
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
                    onClick={handleAddInvoice}
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
                        Create Invoice
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Invoice Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit Invoice</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number *</label>
                    <input
                      type="text"
                      value={newInvoice.invoiceNumber}
                      onChange={(e) => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})}
                      className="input-field w-full"
                      placeholder="e.g., INV-2024-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                    <input
                      type="text"
                      value={newInvoice.clientName}
                      onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter client name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                    <input
                      type="email"
                      value={newInvoice.clientEmail}
                      onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter client email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                      className="input-field w-full"
                      rows={3}
                      placeholder="Enter invoice description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                      <input
                        type="number"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                        className="input-field w-full"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
                      <input
                        type="number"
                        value={newInvoice.tax}
                        onChange={(e) => setNewInvoice({...newInvoice, tax: e.target.value})}
                        className="input-field w-full"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                    <input
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newInvoice.notes}
                      onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
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
                    onClick={handleUpdateInvoice}
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
                        Update Invoice
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
