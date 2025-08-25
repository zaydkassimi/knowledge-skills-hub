'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  Building
} from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerName: string;
  managerEmail: string;
  status: 'active' | 'inactive' | 'maintenance';
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  enrollmentRate: number;
  createdAt: string;
}

export default function BranchesPage() {
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    managerName: '',
    managerEmail: '',
    status: 'active'
  });

  // Load data from localStorage or use mock data for first time
  useEffect(() => {
    const savedBranches = localStorage.getItem('branches');

    if (savedBranches) {
      // Load saved data
      setBranches(JSON.parse(savedBranches));
      setLoading(false);
    } else {
      // Use mock data for first time
      const mockBranches: Branch[] = [
        {
          id: 1,
          name: 'Downtown Branch',
          address: '123 Main Street, Downtown, City Center',
          phone: '+1 (555) 123-4567',
          email: 'downtown@knowledgehub.com',
          managerName: 'Sarah Johnson',
          managerEmail: 'sarah.johnson@knowledgehub.com',
          status: 'active',
          totalStudents: 245,
          totalTeachers: 18,
          totalClasses: 32,
          enrollmentRate: 94,
          createdAt: '2023-01-15'
        },
        {
          id: 2,
          name: 'North Branch',
          address: '456 North Avenue, North District',
          phone: '+1 (555) 234-5678',
          email: 'north@knowledgehub.com',
          managerName: 'David Wilson',
          managerEmail: 'david.wilson@knowledgehub.com',
          status: 'active',
          totalStudents: 189,
          totalTeachers: 14,
          totalClasses: 28,
          enrollmentRate: 87,
          createdAt: '2023-03-20'
        },
        {
          id: 3,
          name: 'South Branch',
          address: '789 South Boulevard, South District',
          phone: '+1 (555) 345-6789',
          email: 'south@knowledgehub.com',
          managerName: 'Lisa Brown',
          managerEmail: 'lisa.brown@knowledgehub.com',
          status: 'maintenance',
          totalStudents: 156,
          totalTeachers: 12,
          totalClasses: 24,
          enrollmentRate: 82,
          createdAt: '2023-06-10'
        },
        {
          id: 4,
          name: 'East Branch',
          address: '321 East Road, East District',
          phone: '+1 (555) 456-7890',
          email: 'east@knowledgehub.com',
          managerName: 'Mike Chen',
          managerEmail: 'mike.chen@knowledgehub.com',
          status: 'active',
          totalStudents: 203,
          totalTeachers: 16,
          totalClasses: 30,
          enrollmentRate: 91,
          createdAt: '2023-08-05'
        },
        {
          id: 5,
          name: 'West Branch',
          address: '654 West Street, West District',
          phone: '+1 (555) 567-8901',
          email: 'west@knowledgehub.com',
          managerName: 'Emily Davis',
          managerEmail: 'emily.davis@knowledgehub.com',
          status: 'inactive',
          totalStudents: 0,
          totalTeachers: 0,
          totalClasses: 0,
          enrollmentRate: 0,
          createdAt: '2023-09-15'
        }
      ];

      setTimeout(() => {
        setBranches(mockBranches);
        // Save to localStorage
        localStorage.setItem('branches', JSON.stringify(mockBranches));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.managerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setNewBranch({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      managerName: branch.managerName,
      managerEmail: branch.managerEmail,
      status: branch.status
    });
    setShowEditModal(true);
  };

  const handleUpdateBranch = async () => {
    if (!editingBranch || !newBranch.name || !newBranch.address || !newBranch.phone || !newBranch.email || !newBranch.managerName || !newBranch.managerEmail) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedBranch: Branch = {
      ...editingBranch,
      name: newBranch.name,
      address: newBranch.address,
      phone: newBranch.phone,
      email: newBranch.email,
      managerName: newBranch.managerName,
      managerEmail: newBranch.managerEmail,
      status: newBranch.status as 'active' | 'inactive' | 'maintenance'
    };

    const updatedBranches = branches.map(branch => branch.id === editingBranch.id ? updatedBranch : branch);
    setBranches(updatedBranches);
    
    // Save to localStorage
    localStorage.setItem('branches', JSON.stringify(updatedBranches));
    
    // Reset form
    setNewBranch({
      name: '',
      address: '',
      phone: '',
      email: '',
      managerName: '',
      managerEmail: '',
      status: 'active' as const
    });
    
    setShowEditModal(false);
    setEditingBranch(null);
  };

  const handleDeleteBranch = async (branchId: number) => {
    if (!confirm('Are you sure you want to delete this branch?')) {
      return;
    }

    const updatedBranches = branches.filter(branch => branch.id !== branchId);
    setBranches(updatedBranches);
    
    // Save to localStorage
    localStorage.setItem('branches', JSON.stringify(updatedBranches));
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...branches.map(branch => branch.id)) + 1;
    const branch: Branch = {
      id: newId,
      ...newBranch,
      status: newBranch.status as 'active' | 'inactive' | 'maintenance',
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      enrollmentRate: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedBranches = [branch, ...branches];
    setBranches(updatedBranches);
    
    // Save to localStorage
    localStorage.setItem('branches', JSON.stringify(updatedBranches));
    
    setShowAddModal(false);
    setNewBranch({
      name: '',
      address: '',
      phone: '',
      email: '',
      managerName: '',
      managerEmail: '',
      status: 'active' as const
    });
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-600 mt-1">Manage multiple branch locations and their operations</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Branch
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900">{branches.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Branches</p>
              <p className="text-2xl font-bold text-gray-900">
                {branches.filter(b => b.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {branches.reduce((acc, b) => acc + b.totalStudents, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Enrollment</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(branches.reduce((acc, b) => acc + b.enrollmentRate, 0) / branches.length)}%
              </p>
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
            placeholder="Search branches..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBranches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{branch.name}</h3>
                <div className="flex items-center mt-1">
                  {getStatusIcon(branch.status)}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(branch.status)}`}>
                    {branch.status}
                  </span>
                </div>
              </div>
                             <div className="flex space-x-2">
                 <button 
                   onClick={() => alert(`View branch details: ${branch.name}`)}
                   className="btn-icon btn-icon-primary" 
                   title="View Details"
                 >
                   <Eye className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleEditBranch(branch)}
                   className="btn-icon btn-icon-secondary"
                   title="Edit Branch"
                 >
                   <Edit className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleDeleteBranch(branch.id)}
                   className="btn-icon btn-icon-danger"
                   title="Delete Branch"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {branch.address}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {branch.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {branch.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                Manager: {branch.managerName}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{branch.totalStudents}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{branch.totalTeachers}</p>
                  <p className="text-sm text-gray-600">Teachers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{branch.totalClasses}</p>
                  <p className="text-sm text-gray-600">Classes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{branch.enrollmentRate}%</p>
                  <p className="text-sm text-gray-600">Enrollment</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created: {new Date(branch.createdAt).toLocaleDateString()}</span>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Branch</h3>
            <form onSubmit={handleAddBranch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  required
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={newBranch.phone}
                  onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newBranch.email}
                  onChange={(e) => setNewBranch({...newBranch, email: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager Name</label>
                <input
                  type="text"
                  required
                  value={newBranch.managerName}
                  onChange={(e) => setNewBranch({...newBranch, managerName: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager Email</label>
                <input
                  type="email"
                  required
                  value={newBranch.managerEmail}
                  onChange={(e) => setNewBranch({...newBranch, managerEmail: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  required
                  value={newBranch.status}
                  onChange={(e) => setNewBranch({...newBranch, status: e.target.value as any})}
                  className="select-field"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Add Branch
                </button>
              </div>
            </form>
                     </div>
         </div>
       )}

       {/* Edit Branch Modal */}
       {showEditModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Branch</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                 <input
                   type="text"
                   required
                   value={newBranch.name}
                   onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                   className="input-field"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                 <textarea
                   required
                   value={newBranch.address}
                   onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                   className="input-field"
                   rows={3}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                 <input
                   type="tel"
                   required
                   value={newBranch.phone}
                   onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
                   className="input-field"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                 <input
                   type="email"
                   required
                   value={newBranch.email}
                   onChange={(e) => setNewBranch({...newBranch, email: e.target.value})}
                   className="input-field"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Manager Name</label>
                 <input
                   type="text"
                   required
                   value={newBranch.managerName}
                   onChange={(e) => setNewBranch({...newBranch, managerName: e.target.value})}
                   className="input-field"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Manager Email</label>
                 <input
                   type="email"
                   required
                   value={newBranch.managerEmail}
                   onChange={(e) => setNewBranch({...newBranch, managerEmail: e.target.value})}
                   className="input-field"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                 <select
                   required
                   value={newBranch.status}
                   onChange={(e) => setNewBranch({...newBranch, status: e.target.value as any})}
                   className="select-field"
                 >
                   <option value="active">Active</option>
                   <option value="inactive">Inactive</option>
                   <option value="maintenance">Maintenance</option>
                 </select>
               </div>
               <div className="flex space-x-3 pt-4">
                 <button
                   type="button"
                   onClick={() => setShowEditModal(false)}
                   className="btn-secondary flex-1"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleUpdateBranch}
                   className="btn-primary flex-1"
                 >
                   Update Branch
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
