'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
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
  Building,
  ArrowLeft,
  Save,
  X,
  AlertCircle,
  Home,
  Droplets,
  Wifi,
  Phone
} from 'lucide-react';

interface UtilityBill {
  id: number;
  billNumber: string;
  billType: 'electricity' | 'water' | 'internet' | 'phone' | 'rent' | 'maintenance' | 'other';
  provider: string;
  property: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'disputed';
  paidAmount: number;
  paymentDate?: string;
  paymentMethod?: string;
  meterReading?: string;
  previousReading?: string;
  consumption?: string;
  notes?: string;
}

export default function UtilitiesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bills, setBills] = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [billTypeFilter, setBillTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBill, setEditingBill] = useState<UtilityBill | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newBill, setNewBill] = useState({
    billNumber: '',
    billType: 'electricity' as 'electricity' | 'water' | 'internet' | 'phone' | 'rent' | 'maintenance' | 'other',
    provider: '',
    property: '',
    amount: '',
    dueDate: '',
    meterReading: '',
    previousReading: '',
    consumption: '',
    notes: ''
  });

  // Load data from localStorage or use mock data for first time
  useEffect(() => {
    const savedBills = localStorage.getItem('hr_utility_bills');

    if (savedBills) {
      setBills(JSON.parse(savedBills));
      setLoading(false);
    } else {
      // Use mock data for first time
      const mockBills: UtilityBill[] = [
        {
          id: 1,
          billNumber: 'ELEC-2024-001',
          billType: 'electricity',
          provider: 'City Power Company',
          property: 'Main Campus Building A',
          amount: 850,
          dueDate: '2024-02-15',
          status: 'paid',
          paidAmount: 850,
          paymentDate: '2024-02-10',
          paymentMethod: 'Bank Transfer',
          meterReading: '12345.67',
          previousReading: '12200.45',
          consumption: '145.22 kWh',
          notes: 'Payment received on time'
        },
        {
          id: 2,
          billNumber: 'WATER-2024-001',
          billType: 'water',
          provider: 'Municipal Water Services',
          property: 'Main Campus Building A',
          amount: 320,
          dueDate: '2024-02-20',
          status: 'pending',
          paidAmount: 0,
          meterReading: '5678.90',
          previousReading: '5600.25',
          consumption: '78.65 m³',
          notes: 'Payment reminder sent'
        },
        {
          id: 3,
          billNumber: 'RENT-2024-001',
          billType: 'rent',
          provider: 'Property Management Co.',
          property: 'Branch Office Downtown',
          amount: 2500,
          dueDate: '2024-02-01',
          status: 'overdue',
          paidAmount: 0,
          notes: 'Follow up required'
        },
        {
          id: 4,
          billNumber: 'INTERNET-2024-001',
          billType: 'internet',
          provider: 'TechConnect ISP',
          property: 'Main Campus Building A',
          amount: 180,
          dueDate: '2024-02-25',
          status: 'paid',
          paidAmount: 180,
          paymentDate: '2024-02-20',
          paymentMethod: 'Credit Card',
          notes: 'Monthly internet service'
        }
      ];

      setTimeout(() => {
        setBills(mockBills);
        localStorage.setItem('hr_utility_bills', JSON.stringify(mockBills));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const handleAddBill = async () => {
    if (!newBill.billNumber || !newBill.provider || !newBill.amount || !newBill.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBillRecord: UtilityBill = {
      id: bills.length + 1,
      billNumber: newBill.billNumber,
      billType: newBill.billType,
      provider: newBill.provider,
      property: newBill.property,
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      status: 'pending',
      paidAmount: 0,
      meterReading: newBill.meterReading,
      previousReading: newBill.previousReading,
      consumption: newBill.consumption,
      notes: newBill.notes
    };

    const updatedBills = [...bills, newBillRecord];
    setBills(updatedBills);
    localStorage.setItem('hr_utility_bills', JSON.stringify(updatedBills));
    
    // Reset form
    setNewBill({
      billNumber: '',
      billType: 'electricity',
      provider: '',
      property: '',
      amount: '',
      dueDate: '',
      meterReading: '',
      previousReading: '',
      consumption: '',
      notes: ''
    });
    
    setShowAddModal(false);
    setIsSaving(false);
  };

  const handleEditBill = (bill: UtilityBill) => {
    setEditingBill(bill);
    setNewBill({
      billNumber: bill.billNumber,
      billType: bill.billType,
      provider: bill.provider,
      property: bill.property,
      amount: bill.amount.toString(),
      dueDate: bill.dueDate,
      meterReading: bill.meterReading || '',
      previousReading: bill.previousReading || '',
      consumption: bill.consumption || '',
      notes: bill.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateBill = async () => {
    if (!editingBill || !newBill.billNumber || !newBill.provider || !newBill.amount || !newBill.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedBillRecord: UtilityBill = {
      ...editingBill,
      billNumber: newBill.billNumber,
      billType: newBill.billType,
      provider: newBill.provider,
      property: newBill.property,
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
      meterReading: newBill.meterReading,
      previousReading: newBill.previousReading,
      consumption: newBill.consumption,
      notes: newBill.notes
    };

    const updatedBills = bills.map(b => b.id === editingBill.id ? updatedBillRecord : b);
    setBills(updatedBills);
    localStorage.setItem('hr_utility_bills', JSON.stringify(updatedBills));
    
    // Reset form
    setNewBill({
      billNumber: '',
      billType: 'electricity',
      provider: '',
      property: '',
      amount: '',
      dueDate: '',
      meterReading: '',
      previousReading: '',
      consumption: '',
      notes: ''
    });
    
    setShowEditModal(false);
    setEditingBill(null);
    setIsSaving(false);
  };

  const handleDeleteBill = async (billId: number) => {
    if (!confirm('Are you sure you want to delete this utility bill?')) {
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedBills = bills.filter(b => b.id !== billId);
    setBills(updatedBills);
    localStorage.setItem('hr_utility_bills', JSON.stringify(updatedBills));
    setIsSaving(false);
  };

  const handlePaymentUpdate = async (billId: number, paidAmount: number) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedBills = bills.map(b => {
      if (b.id === billId) {
        const newStatus: 'pending' | 'paid' | 'overdue' | 'disputed' = 
          paidAmount >= b.amount ? 'paid' : 'pending';
        return {
          ...b,
          paidAmount: paidAmount,
          status: newStatus,
          paymentDate: paidAmount > 0 ? new Date().toISOString().split('T')[0] : b.paymentDate
        };
      }
      return b;
    });
    
    setBills(updatedBills);
    localStorage.setItem('hr_utility_bills', JSON.stringify(updatedBills));
    setIsSaving(false);
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    const matchesBillType = billTypeFilter === 'all' || bill.billType === billTypeFilter;
    return matchesSearch && matchesStatus && matchesBillType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'disputed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillTypeIcon = (type: string) => {
    switch (type) {
      case 'electricity': return <Zap className="w-4 h-4" />;
      case 'water': return <Droplets className="w-4 h-4" />;
      case 'internet': return <Wifi className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'rent': return <Home className="w-4 h-4" />;
      case 'maintenance': return <Building className="w-4 h-4" />;
      case 'other': return <AlertCircle className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
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
              <h1 className="text-3xl font-bold text-gray-900">Utilities & Rent</h1>
              <p className="text-gray-600 mt-1">Manage utility bills and rent payments</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Bill
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Bills</p>
                <p className="text-3xl font-bold text-blue-900">{bills.length}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <Zap className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Paid</p>
                <p className="text-3xl font-bold text-green-900">
                  {bills.filter(r => r.status === 'paid').length}
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
                  {bills.filter(r => r.status === 'overdue').length}
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
                  ${bills.reduce((acc, r) => acc + r.amount, 0).toLocaleString()}
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
              placeholder="Search bills..."
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
              <option value="disputed">Disputed</option>
            </select>
            <select
              value={billTypeFilter}
              onChange={(e) => setBillTypeFilter(e.target.value)}
              className="select-field"
            >
              <option value="all">All Types</option>
              <option value="electricity">Electricity</option>
              <option value="water">Water</option>
              <option value="internet">Internet</option>
              <option value="phone">Phone</option>
              <option value="rent">Rent</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Bills Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Bill Details</th>
                  <th className="table-header">Provider & Property</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{bill.billNumber}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          {getBillTypeIcon(bill.billType)}
                          <span className="ml-2 capitalize">{bill.billType}</span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{bill.provider}</div>
                        <div className="text-sm text-gray-500">{bill.property}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">${bill.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          Paid: ${bill.paidAmount.toLocaleString()}
                        </div>
                        {bill.paidAmount > 0 && (
                          <div className="text-sm text-gray-400">
                            Balance: ${(bill.amount - bill.paidAmount).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className={`${isOverdue(bill.dueDate) ? 'text-red-600 font-medium' : ''}`}>
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => alert(`View bill details: ${bill.billNumber} - ${bill.billType}`)}
                          className="btn-icon btn-icon-primary hover:bg-primary-100" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditBill(bill)}
                          className="btn-icon btn-icon-secondary hover:bg-gray-100"
                          title="Edit Bill"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {bill.status !== 'paid' && (
                          <button 
                            onClick={() => {
                              const amount = prompt(`Enter payment amount for ${bill.billNumber} (max: $${bill.amount})`);
                              if (amount && !isNaN(parseFloat(amount))) {
                                handlePaymentUpdate(bill.id, parseFloat(amount));
                              }
                            }}
                            className="btn-icon btn-icon-success hover:bg-green-100"
                            title="Record Payment"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteBill(bill.id)}
                          className="btn-icon btn-icon-danger hover:bg-red-100"
                          title="Delete Bill"
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

        {/* Add Bill Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">New Utility Bill</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number *</label>
                    <input
                      type="text"
                      value={newBill.billNumber}
                      onChange={(e) => setNewBill({...newBill, billNumber: e.target.value})}
                      className="input-field w-full"
                      placeholder="e.g., ELEC-2024-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bill Type</label>
                    <select
                      value={newBill.billType}
                      onChange={(e) => setNewBill({...newBill, billType: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="electricity">Electricity</option>
                      <option value="water">Water</option>
                      <option value="internet">Internet</option>
                      <option value="phone">Phone</option>
                      <option value="rent">Rent</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider *</label>
                    <input
                      type="text"
                      value={newBill.provider}
                      onChange={(e) => setNewBill({...newBill, provider: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter provider name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                    <input
                      type="text"
                      value={newBill.property}
                      onChange={(e) => setNewBill({...newBill, property: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter property name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      value={newBill.amount}
                      onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
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
                      value={newBill.dueDate}
                      onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Reading</label>
                      <input
                        type="text"
                        value={newBill.meterReading}
                        onChange={(e) => setNewBill({...newBill, meterReading: e.target.value})}
                        className="input-field w-full"
                        placeholder="Current meter reading"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Previous Reading</label>
                      <input
                        type="text"
                        value={newBill.previousReading}
                        onChange={(e) => setNewBill({...newBill, previousReading: e.target.value})}
                        className="input-field w-full"
                        placeholder="Previous meter reading"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consumption</label>
                    <input
                      type="text"
                      value={newBill.consumption}
                      onChange={(e) => setNewBill({...newBill, consumption: e.target.value})}
                      className="input-field w-full"
                      placeholder="e.g., 145.22 kWh"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newBill.notes}
                      onChange={(e) => setNewBill({...newBill, notes: e.target.value})}
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
                    onClick={handleAddBill}
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
                        Create Bill
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Bill Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit Utility Bill</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number *</label>
                    <input
                      type="text"
                      value={newBill.billNumber}
                      onChange={(e) => setNewBill({...newBill, billNumber: e.target.value})}
                      className="input-field w-full"
                      placeholder="e.g., ELEC-2024-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bill Type</label>
                    <select
                      value={newBill.billType}
                      onChange={(e) => setNewBill({...newBill, billType: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="electricity">Electricity</option>
                      <option value="water">Water</option>
                      <option value="internet">Internet</option>
                      <option value="phone">Phone</option>
                      <option value="rent">Rent</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider *</label>
                    <input
                      type="text"
                      value={newBill.provider}
                      onChange={(e) => setNewBill({...newBill, provider: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter provider name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                    <input
                      type="text"
                      value={newBill.property}
                      onChange={(e) => setNewBill({...newBill, property: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter property name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                    <input
                      type="number"
                      value={newBill.amount}
                      onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
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
                      value={newBill.dueDate}
                      onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Reading</label>
                      <input
                        type="text"
                        value={newBill.meterReading}
                        onChange={(e) => setNewBill({...newBill, meterReading: e.target.value})}
                        className="input-field w-full"
                        placeholder="Current meter reading"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Previous Reading</label>
                      <input
                        type="text"
                        value={newBill.previousReading}
                        onChange={(e) => setNewBill({...newBill, previousReading: e.target.value})}
                        className="input-field w-full"
                        placeholder="Previous meter reading"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consumption</label>
                    <input
                      type="text"
                      value={newBill.consumption}
                      onChange={(e) => setNewBill({...newBill, consumption: e.target.value})}
                      className="input-field w-full"
                      placeholder="e.g., 145.22 kWh"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newBill.notes}
                      onChange={(e) => setNewBill({...newBill, notes: e.target.value})}
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
                    onClick={handleUpdateBill}
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
                        Update Bill
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
