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
  BookOpen, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Award,
  MessageSquare,
  DollarSign,
  FileText,
  X,
  Save,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  qualifications: string;
  experience: number;
  salary: number;
  joinDate: string;
  address: string;
  status: 'active' | 'inactive';
  image?: string;
}

export default function TeachersPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    department: '',
    qualifications: '',
    experience: 0,
    salary: 0,
    address: '',
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
    // Load teachers from localStorage or API
    const loadTeachers = () => {
      try {
        const savedTeachers = localStorage.getItem('teachers');
        if (savedTeachers) {
          setTeachers(JSON.parse(savedTeachers));
        } else {
          // Mock data
          const mockTeachers: Teacher[] = [
            {
              id: 1,
              name: 'John Smith',
              email: 'john.smith@school.com',
              phone: '+1234567890',
              subject: 'Mathematics',
              department: 'Science',
              qualifications: 'MSc Mathematics, BSc Education',
              experience: 8,
              salary: 45000,
              joinDate: '2020-01-15',
              address: '123 Main St, City',
              status: 'active'
            },
            {
              id: 2,
              name: 'Sarah Johnson',
              email: 'sarah.johnson@school.com',
              phone: '+1234567891',
              subject: 'English',
              department: 'Humanities',
              qualifications: 'MA English Literature, PGCE',
              experience: 5,
              salary: 42000,
              joinDate: '2021-09-01',
              address: '456 Oak Ave, City',
              status: 'active'
            },
            {
              id: 3,
              name: 'Michael Brown',
              email: 'michael.brown@school.com',
              phone: '+1234567892',
              subject: 'Physics',
              department: 'Science',
              qualifications: 'PhD Physics, BSc Education',
              experience: 12,
              salary: 52000,
              joinDate: '2018-03-10',
              address: '789 Pine St, City',
              status: 'active'
            }
          ];
          setTeachers(mockTeachers);
          localStorage.setItem('teachers', JSON.stringify(mockTeachers));
        }
      } catch (error) {
        console.error('Error loading teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  const saveTeachers = (updatedTeachers: Teacher[]) => {
    setTeachers(updatedTeachers);
    localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
  };

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    const teacher: Teacher = {
      id: Date.now(),
      name: newTeacher.name!,
      email: newTeacher.email!,
      phone: newTeacher.phone || '',
      subject: newTeacher.subject!,
      department: newTeacher.department || 'General',
      qualifications: newTeacher.qualifications || '',
      experience: newTeacher.experience || 0,
      salary: newTeacher.salary || 0,
      joinDate: new Date().toISOString().split('T')[0],
      address: newTeacher.address || '',
      status: newTeacher.status as 'active' | 'inactive' || 'active'
    };

    const updatedTeachers = [...teachers, teacher];
    saveTeachers(updatedTeachers);
    
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      subject: '',
      department: '',
      qualifications: '',
      experience: 0,
      salary: 0,
      address: '',
      status: 'active'
    });
    setShowAddModal(false);
    toast.success('Teacher added successfully!');
  };

  const handleEditTeacher = () => {
    if (!selectedTeacher) return;

    const updatedTeachers = teachers.map(t => 
      t.id === selectedTeacher.id ? selectedTeacher : t
    );
    saveTeachers(updatedTeachers);
    setShowEditModal(false);
    setSelectedTeacher(null);
    toast.success('Teacher updated successfully!');
  };

  const handleDeleteTeacher = (teacherId: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      const updatedTeachers = teachers.filter(t => t.id !== teacherId);
      saveTeachers(updatedTeachers);
      toast.success('Teacher deleted successfully!');
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || teacher.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(teachers.map(t => t.department)));

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
            <h1 className="text-2xl font-bold text-gray-900">Teachers Management</h1>
            <p className="text-gray-600">Manage teaching staff and their information</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Teacher
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
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-semibold text-gray-900">{teachers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teachers.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-semibold text-gray-900">{departments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Experience</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teachers.length > 0 ? Math.round(teachers.reduce((sum, t) => sum + t.experience, 0) / teachers.length) : 0} yrs
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
                  placeholder="Search teachers..."
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
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
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
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          <div className="text-sm text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.subject}</div>
                      <div className="text-sm text-gray-500">{teacher.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.experience} years</div>
                      <div className="text-sm text-gray-500">Since {teacher.joinDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        teacher.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
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

        {/* Add Teacher Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add New Teacher</h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Languages">Languages</option>
                    <option value="Arts">Arts</option>
                    <option value="Physical Education">Physical Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                  <input
                    type="number"
                    value={newTeacher.experience}
                    onChange={(e) => setNewTeacher({...newTeacher, experience: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Years of experience"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                  <textarea
                    value={newTeacher.qualifications}
                    onChange={(e) => setNewTeacher({...newTeacher, qualifications: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter qualifications"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={newTeacher.address}
                    onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Enter address"
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
                  onClick={handleAddTeacher}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Teacher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Teacher Modal */}
        {showEditModal && selectedTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Teacher</h3>
                <button onClick={() => setShowEditModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={selectedTeacher.name}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedTeacher.email}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={selectedTeacher.phone}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={selectedTeacher.subject}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={selectedTeacher.department}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Languages">Languages</option>
                    <option value="Arts">Arts</option>
                    <option value="Physical Education">Physical Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedTeacher.status}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                  <input
                    type="number"
                    value={selectedTeacher.experience}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, experience: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                  <input
                    type="number"
                    value={selectedTeacher.salary}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, salary: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                  <textarea
                    value={selectedTeacher.qualifications}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, qualifications: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={selectedTeacher.address}
                    onChange={(e) => setSelectedTeacher({...selectedTeacher, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
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
                  onClick={handleEditTeacher}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Update Teacher
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
