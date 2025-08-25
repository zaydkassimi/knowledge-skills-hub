'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import { 
  Receipt, 
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
  Building,
  ArrowLeft,
  Save,
  X,
  AlertCircle,
  Package,
  Truck
} from 'lucide-react';

interface PurchaseRequest {
  id: number;
  requesterName: string;
  department: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  requestDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  approvedBy?: string;
  approvedDate?: string;
  supplier?: string;
  expectedDelivery?: string;
}

export default function PurchaseRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<PurchaseRequest | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newRequest, setNewRequest] = useState({
    requesterName: '',
    department: 'Academics',
    itemName: '',
    description: '',
    quantity: '',
    unitPrice: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    supplier: '',
    expectedDelivery: ''
  });

  // Load data from localStorage or use mock data for first time
  useEffect(() => {
    const savedRequests = localStorage.getItem('hr_purchase_requests');

    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
      setLoading(false);
    } else {
      // Use mock data for first time
      const mockRequests: PurchaseRequest[] = [
        {
          id: 1,
          requesterName: 'Sarah Johnson',
          department: 'Academics',
          itemName: 'Projector',
          description: 'High-quality projector for classroom presentations',
          quantity: 2,
          unitPrice: 800,
          totalAmount: 1600,
          requestDate: '2024-01-15',
          priority: 'high',
          status: 'approved',
          approvedBy: 'HR Manager',
          approvedDate: '2024-01-16',
          supplier: 'Tech Supplies Inc.',
          expectedDelivery: '2024-01-25'
        },
        {
          id: 2,
          requesterName: 'David Wilson',
          department: 'Technology',
          itemName: 'Laptop Computers',
          description: 'Dell Latitude laptops for IT department',
          quantity: 5,
          unitPrice: 1200,
          totalAmount: 6000,
          requestDate: '2024-01-18',
          priority: 'urgent',
          status: 'pending'
        },
        {
          id: 3,
          requesterName: 'Lisa Brown',
          department: 'Administration',
          itemName: 'Office Chairs',
          description: 'Ergonomic office chairs for staff',
          quantity: 10,
          unitPrice: 250,
          totalAmount: 2500,
          requestDate: '2024-01-20',
          priority: 'medium',
          status: 'in_progress',
          approvedBy: 'HR Manager',
          approvedDate: '2024-01-21',
          supplier: 'Office Furniture Co.',
          expectedDelivery: '2024-02-05'
        }
      ];

      setTimeout(() => {
        setRequests(mockRequests);
        localStorage.setItem('hr_purchase_requests', JSON.stringify(mockRequests));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const handleAddRequest = async () => {
    if (!newRequest.requesterName || !newRequest.itemName || !newRequest.quantity || !newRequest.unitPrice) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReq: PurchaseRequest = {
      id: requests.length + 1,
      requesterName: newRequest.requesterName,
      department: newRequest.department,
      itemName: newRequest.itemName,
      description: newRequest.description,
      quantity: parseInt(newRequest.quantity),
      unitPrice: parseFloat(newRequest.unitPrice),
      totalAmount: parseInt(newRequest.quantity) * parseFloat(newRequest.unitPrice),
      requestDate: new Date().toISOString().split('T')[0],
      priority: newRequest.priority,
      status: 'pending',
      supplier: newRequest.supplier,
      expectedDelivery: newRequest.expectedDelivery
    };

    const updatedRequests = [...requests, newReq];
    setRequests(updatedRequests);
    localStorage.setItem('hr_purchase_requests', JSON.stringify(updatedRequests));
    
    // Reset form
    setNewRequest({
      requesterName: '',
      department: 'Academics',
      itemName: '',
      description: '',
      quantity: '',
      unitPrice: '',
      priority: 'medium',
      supplier: '',
      expectedDelivery: ''
    });
    
    setShowAddModal(false);
    setIsSaving(false);
  };

  const handleEditRequest = (request: PurchaseRequest) => {
    setEditingRequest(request);
    setNewRequest({
      requesterName: request.requesterName,
      department: request.department,
      itemName: request.itemName,
      description: request.description,
      quantity: request.quantity.toString(),
      unitPrice: request.unitPrice.toString(),
      priority: request.priority,
      supplier: request.supplier || '',
      expectedDelivery: request.expectedDelivery || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateRequest = async () => {
    if (!editingRequest || !newRequest.requesterName || !newRequest.itemName || !newRequest.quantity || !newRequest.unitPrice) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedRequest: PurchaseRequest = {
      ...editingRequest,
      requesterName: newRequest.requesterName,
      department: newRequest.department,
      itemName: newRequest.itemName,
      description: newRequest.description,
      quantity: parseInt(newRequest.quantity),
      unitPrice: parseFloat(newRequest.unitPrice),
      totalAmount: parseInt(newRequest.quantity) * parseFloat(newRequest.unitPrice),
      priority: newRequest.priority,
      supplier: newRequest.supplier,
      expectedDelivery: newRequest.expectedDelivery
    };

    const updatedRequests = requests.map(req => req.id === editingRequest.id ? updatedRequest : req);
    setRequests(updatedRequests);
    localStorage.setItem('hr_purchase_requests', JSON.stringify(updatedRequests));
    
    // Reset form
    setNewRequest({
      requesterName: '',
      department: 'Academics',
      itemName: '',
      description: '',
      quantity: '',
      unitPrice: '',
      priority: 'medium',
      supplier: '',
      expectedDelivery: ''
    });
    
    setShowEditModal(false);
    setEditingRequest(null);
    setIsSaving(false);
  };

  const handleDeleteRequest = async (requestId: number) => {
    if (!confirm('Are you sure you want to delete this purchase request?')) {
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedRequests = requests.filter(req => req.id !== requestId);
    setRequests(updatedRequests);
    localStorage.setItem('hr_purchase_requests', JSON.stringify(updatedRequests));
    setIsSaving(false);
  };

  const handleStatusUpdate = async (requestId: number, newStatus: PurchaseRequest['status']) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: newStatus,
          approvedBy: newStatus === 'approved' ? user?.name || 'HR Manager' : req.approvedBy,
          approvedDate: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : req.approvedDate
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    localStorage.setItem('hr_purchase_requests', JSON.stringify(updatedRequests));
    setIsSaving(false);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
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
              <h1 className="text-3xl font-bold text-gray-900">Purchase Requests</h1>
              <p className="text-gray-600 mt-1">Manage and approve purchase requests</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Requests</p>
                <p className="text-3xl font-bold text-blue-900">{requests.length}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <Receipt className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-200 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <p className="text-3xl font-bold text-green-900">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Value</p>
                <p className="text-3xl font-bold text-purple-900">
                  ${requests.reduce((acc, r) => acc + r.totalAmount, 0).toLocaleString()}
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
              placeholder="Search requests..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="select-field"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Request Details</th>
                  <th className="table-header">Department</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Priority</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Request Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">{request.itemName}</div>
                        <div className="text-sm text-gray-500">{request.requesterName}</div>
                        <div className="text-sm text-gray-400">{request.description}</div>
                      </div>
                    </td>
                    <td className="table-cell">{request.department}</td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900">${request.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{request.quantity} × ${request.unitPrice}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell">{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => alert(`View request details: ${request.itemName}`)}
                          className="btn-icon btn-icon-primary hover:bg-primary-100" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditRequest(request)}
                          className="btn-icon btn-icon-secondary hover:bg-gray-100"
                          title="Edit Request"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(request.id, 'approved')}
                              className="btn-icon btn-icon-success hover:bg-green-100"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(request.id, 'rejected')}
                              className="btn-icon btn-icon-danger hover:bg-red-100"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDeleteRequest(request.id)}
                          className="btn-icon btn-icon-danger hover:bg-red-100"
                          title="Delete Request"
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

        {/* Add Request Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">New Purchase Request</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requester Name *</label>
                    <input
                      type="text"
                      value={newRequest.requesterName}
                      onChange={(e) => setNewRequest({...newRequest, requesterName: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter requester name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={newRequest.department}
                      onChange={(e) => setNewRequest({...newRequest, department: e.target.value})}
                      className="select-field w-full"
                    >
                      <option value="Academics">Academics</option>
                      <option value="Technology">Technology</option>
                      <option value="Administration">Administration</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={newRequest.itemName}
                      onChange={(e) => setNewRequest({...newRequest, itemName: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter item name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                      className="input-field w-full"
                      rows={3}
                      placeholder="Enter item description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        value={newRequest.quantity}
                        onChange={(e) => setNewRequest({...newRequest, quantity: e.target.value})}
                        className="input-field w-full"
                        placeholder="1"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
                      <input
                        type="number"
                        value={newRequest.unitPrice}
                        onChange={(e) => setNewRequest({...newRequest, unitPrice: e.target.value})}
                        className="input-field w-full"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest({...newRequest, priority: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <input
                      type="text"
                      value={newRequest.supplier}
                      onChange={(e) => setNewRequest({...newRequest, supplier: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter supplier name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                    <input
                      type="date"
                      value={newRequest.expectedDelivery}
                      onChange={(e) => setNewRequest({...newRequest, expectedDelivery: e.target.value})}
                      className="input-field w-full"
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
                    onClick={handleAddRequest}
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
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Request Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit Purchase Request</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requester Name *</label>
                    <input
                      type="text"
                      value={newRequest.requesterName}
                      onChange={(e) => setNewRequest({...newRequest, requesterName: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter requester name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={newRequest.department}
                      onChange={(e) => setNewRequest({...newRequest, department: e.target.value})}
                      className="select-field w-full"
                    >
                      <option value="Academics">Academics</option>
                      <option value="Technology">Technology</option>
                      <option value="Administration">Administration</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={newRequest.itemName}
                      onChange={(e) => setNewRequest({...newRequest, itemName: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter item name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                      className="input-field w-full"
                      rows={3}
                      placeholder="Enter item description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        value={newRequest.quantity}
                        onChange={(e) => setNewRequest({...newRequest, quantity: e.target.value})}
                        className="input-field w-full"
                        placeholder="1"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
                      <input
                        type="number"
                        value={newRequest.unitPrice}
                        onChange={(e) => setNewRequest({...newRequest, unitPrice: e.target.value})}
                        className="input-field w-full"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest({...newRequest, priority: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <input
                      type="text"
                      value={newRequest.supplier}
                      onChange={(e) => setNewRequest({...newRequest, supplier: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter supplier name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                    <input
                      type="date"
                      value={newRequest.expectedDelivery}
                      onChange={(e) => setNewRequest({...newRequest, expectedDelivery: e.target.value})}
                      className="input-field w-full"
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
                    onClick={handleUpdateRequest}
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
                        Update Request
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
