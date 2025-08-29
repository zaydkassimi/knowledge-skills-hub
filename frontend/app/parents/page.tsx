'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  UserCheck,
  Baby,
  MessageSquare,
  Calendar,
  X,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Parent {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  children: string[];
  emergencyContact: string;
  relationshipType: 'Father' | 'Mother' | 'Guardian' | 'Other';
  occupation: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export default function ParentsPage() {
  const { user } = useAuth();
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [newParent, setNewParent] = useState<Partial<Parent>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    children: [],
    emergencyContact: '',
    relationshipType: 'Father',
    occupation: '',
    status: 'active'
  });

  // Check permissions
  if (user?.role !== 'admin' && user?.role !== 'hr_manager') {
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
    // Load parents from localStorage or API
    const loadParents = () => {
      try {
        const savedParents = localStorage.getItem('parents');
        if (savedParents) {
          setParents(JSON.parse(savedParents));
        } else {
          // Mock data
          const mockParents: Parent[] = [
            {
              id: 1,
              name: 'Robert Johnson',
              email: 'robert.johnson@email.com',
              phone: '+1234567890',
              address: '123 Oak Street, Springfield',
              children: ['Emily Johnson', 'Michael Johnson'],
              emergencyContact: '+1234567891',
              relationshipType: 'Father',
              occupation: 'Engineer',
              status: 'active',
              joinDate: '2023-01-15'
            },
            {
              id: 2,
              name: 'Linda Smith',
              email: 'linda.smith@email.com',
              phone: '+1234567892',
              address: '456 Pine Avenue, Springfield',
              children: ['Sarah Smith'],
              emergencyContact: '+1234567893',
              relationshipType: 'Mother',
              occupation: 'Teacher',
              status: 'active',
              joinDate: '2023-02-20'
            },
            {
              id: 3,
              name: 'David Wilson',
              email: 'david.wilson@email.com',
              phone: '+1234567894',
              address: '789 Elm Drive, Springfield',
              children: ['Alex Wilson', 'Jamie Wilson'],
              emergencyContact: '+1234567895',
              relationshipType: 'Father',
              occupation: 'Doctor',
              status: 'active',
              joinDate: '2023-03-10'
            },
            {
              id: 4,
              name: 'Maria Garcia',
              email: 'maria.garcia@email.com',
              phone: '+1234567896',
              address: '321 Maple Street, Springfield',
              children: ['Carlos Garcia'],
              emergencyContact: '+1234567897',
              relationshipType: 'Mother',
              occupation: 'Nurse',
              status: 'active',
              joinDate: '2023-04-05'
            }
          ];
          setParents(mockParents);
          localStorage.setItem('parents', JSON.stringify(mockParents));
        }
      } catch (error) {
        console.error('Error loading parents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParents();
  }, []);

  const saveParents = (updatedParents: Parent[]) => {
    setParents(updatedParents);
    localStorage.setItem('parents', JSON.stringify(updatedParents));
  };

  const handleAddParent = () => {
    if (!newParent.name || !newParent.email || !newParent.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const parent: Parent = {
      id: Date.now(),
      name: newParent.name!,
      email: newParent.email!,
      phone: newParent.phone!,
      address: newParent.address || '',
      children: newParent.children || [],
      emergencyContact: newParent.emergencyContact || '',
      relationshipType: newParent.relationshipType || 'Father',
      occupation: newParent.occupation || '',
      status: newParent.status as 'active' | 'inactive' || 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };

    const updatedParents = [...parents, parent];
    saveParents(updatedParents);
    
    setNewParent({
      name: '',
      email: '',
      phone: '',
      address: '',
      children: [],
      emergencyContact: '',
      relationshipType: 'Father',
      occupation: '',
      status: 'active'
    });
    setShowAddModal(false);
    toast.success('Parent added successfully!');
  };

  const handleEditParent = () => {
    if (!selectedParent) return;

    const updatedParents = parents.map(p => 
      p.id === selectedParent.id ? selectedParent : p
    );
    saveParents(updatedParents);
    setShowEditModal(false);
    setSelectedParent(null);
    toast.success('Parent updated successfully!');
  };

  const handleDeleteParent = (parentId: number) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      const updatedParents = parents.filter(p => p.id !== parentId);
      saveParents(updatedParents);
      toast.success('Parent deleted successfully!');
    }
  };

  const filteredParents = parents.filter(parent => {
    const matchesSearch = parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.children.some(child => child.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || parent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-2xl font-bold text-gray-900">Parents Management</h1>
            <p className="text-gray-600">Manage parent information and student relationships</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Parent
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Parents</p>
                <p className="text-2xl font-semibold text-gray-900">{parents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Parents</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {parents.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Baby className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Children</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {parents.reduce((sum, p) => sum + p.children.length, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {parents.filter(p => {
                    const joinMonth = new Date(p.joinDate).getMonth();
                    const currentMonth = new Date().getMonth();
                    return joinMonth === currentMonth;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search parents or children..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Parents List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Children
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{parent.name}</div>
                          <div className="text-sm text-gray-500">{parent.relationshipType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {parent.children.length > 0 ? (
                          <div className="space-y-1">
                            {parent.children.map((child, index) => (
                              <div key={index} className="flex items-center">
                                <Baby className="h-3 w-3 text-gray-400 mr-1" />
                                <span>{child}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">No children assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Mail className="h-3 w-3 text-gray-400 mr-1" />
                          {parent.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 text-gray-400 mr-1" />
                          {parent.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        parent.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {parent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedParent(parent);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteParent(parent.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Parent Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New Parent</h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newParent.name}
                    onChange={(e) => setNewParent({...newParent, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newParent.email}
                    onChange={(e) => setNewParent({...newParent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={newParent.phone}
                    onChange={(e) => setNewParent({...newParent, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Type</label>
                  <select
                    value={newParent.relationshipType}
                    onChange={(e) => setNewParent({...newParent, relationshipType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                  <input
                    type="text"
                    value={newParent.occupation}
                    onChange={(e) => setNewParent({...newParent, occupation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter occupation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    value={newParent.emergencyContact}
                    onChange={(e) => setNewParent({...newParent, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter emergency contact"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={newParent.address}
                    onChange={(e) => setNewParent({...newParent, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Enter address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Children Names (comma separated)</label>
                  <input
                    type="text"
                    value={newParent.children?.join(', ')}
                    onChange={(e) => setNewParent({...newParent, children: e.target.value.split(',').map(name => name.trim()).filter(name => name)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter children names separated by commas"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddParent}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Parent
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Parent Modal */}
        {showEditModal && selectedParent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Parent</h3>
                <button onClick={() => setShowEditModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={selectedParent.name}
                    onChange={(e) => setSelectedParent({...selectedParent, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedParent.email}
                    onChange={(e) => setSelectedParent({...selectedParent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={selectedParent.phone}
                    onChange={(e) => setSelectedParent({...selectedParent, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Type</label>
                  <select
                    value={selectedParent.relationshipType}
                    onChange={(e) => setSelectedParent({...selectedParent, relationshipType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                  <input
                    type="text"
                    value={selectedParent.occupation}
                    onChange={(e) => setSelectedParent({...selectedParent, occupation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedParent.status}
                    onChange={(e) => setSelectedParent({...selectedParent, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    value={selectedParent.emergencyContact}
                    onChange={(e) => setSelectedParent({...selectedParent, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={selectedParent.address}
                    onChange={(e) => setSelectedParent({...selectedParent, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Children Names (comma separated)</label>
                  <input
                    type="text"
                    value={selectedParent.children.join(', ')}
                    onChange={(e) => setSelectedParent({...selectedParent, children: e.target.value.split(',').map(name => name.trim()).filter(name => name)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditParent}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Update Parent
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
