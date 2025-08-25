'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Save,
  UserPlus,
  DollarSign,
  Receipt,
  CreditCard,
  Building,
  Zap,
  FileSpreadsheet,
  Briefcase,
  UserCheck,
  BarChart3,
  Settings,
  ArrowRight,
  Star,
  Award,
  Target,
  PieChart
} from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'on_leave' | 'terminated' | 'probation';
  leaveBalance: number;
  performance: number;
}

interface LeaveRequest {
  id: number;
  employeeName: string;
  leaveType: 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
}

export default function HRPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'employees' | 'leave' | 'analytics'>('employees');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: 'Academics',
    hireDate: '',
    salary: '',
    status: 'active' as 'active' | 'on_leave' | 'terminated' | 'probation',
    leaveBalance: '20',
    performance: '85'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load data from localStorage or use mock data for first time
  useEffect(() => {
    const savedEmployees = localStorage.getItem('hr_employees');
    const savedLeaveRequests = localStorage.getItem('hr_leave_requests');

    if (savedEmployees && savedLeaveRequests) {
      setEmployees(JSON.parse(savedEmployees));
      setLeaveRequests(JSON.parse(savedLeaveRequests));
      setLoading(false);
    } else {
      const mockEmployees: Employee[] = [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@school.com',
          position: 'Mathematics Teacher',
          department: 'Academics',
          hireDate: '2023-01-15',
          salary: 45000,
          status: 'active',
          leaveBalance: 15,
          performance: 92
        },
        {
          id: 2,
          name: 'David Wilson',
          email: 'david.wilson@school.com',
          position: 'English Teacher',
          department: 'Academics',
          hireDate: '2022-08-20',
          salary: 42000,
          status: 'active',
          leaveBalance: 8,
          performance: 88
        }
      ];

      const mockLeaveRequests: LeaveRequest[] = [
        {
          id: 1,
          employeeName: 'Sarah Johnson',
          leaveType: 'vacation',
          startDate: '2024-01-20',
          endDate: '2024-01-25',
          reason: 'Family vacation',
          status: 'approved',
          days: 5
        }
      ];

      setTimeout(() => {
        setEmployees(mockEmployees);
        setLeaveRequests(mockLeaveRequests);
        localStorage.setItem('hr_employees', JSON.stringify(mockEmployees));
        localStorage.setItem('hr_leave_requests', JSON.stringify(mockLeaveRequests));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.position || !newEmployee.hireDate || !newEmployee.salary) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEmp: Employee = {
      id: employees.length + 1,
      name: newEmployee.name,
      email: newEmployee.email,
      position: newEmployee.position,
      department: newEmployee.department,
      hireDate: newEmployee.hireDate,
      salary: parseInt(newEmployee.salary),
      status: newEmployee.status,
      leaveBalance: parseInt(newEmployee.leaveBalance),
      performance: parseInt(newEmployee.performance)
    };

    const updatedEmployees = [...employees, newEmp];
    setEmployees(updatedEmployees);
    localStorage.setItem('hr_employees', JSON.stringify(updatedEmployees));
    
    setNewEmployee({
      name: '',
      email: '',
      position: '',
      department: 'Academics',
      hireDate: '',
      salary: '',
      status: 'active',
      leaveBalance: '20',
      performance: '85'
    });
    
    setShowAddModal(false);
    setIsSaving(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      hireDate: employee.hireDate,
      salary: employee.salary.toString(),
      status: employee.status,
      leaveBalance: employee.leaveBalance.toString(),
      performance: employee.performance.toString()
    });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee || !newEmployee.name || !newEmployee.email || !newEmployee.position || !newEmployee.hireDate || !newEmployee.salary) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedEmployee: Employee = {
      ...editingEmployee,
      name: newEmployee.name,
      email: newEmployee.email,
      position: newEmployee.position,
      department: newEmployee.department,
      hireDate: newEmployee.hireDate,
      salary: parseInt(newEmployee.salary),
      status: newEmployee.status,
      leaveBalance: parseInt(newEmployee.leaveBalance),
      performance: parseInt(newEmployee.performance)
    };

    const updatedEmployees = employees.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp);
    setEmployees(updatedEmployees);
    localStorage.setItem('hr_employees', JSON.stringify(updatedEmployees));
    
    setNewEmployee({
      name: '',
      email: '',
      position: '',
      department: 'Academics',
      hireDate: '',
      salary: '',
      status: 'active',
      leaveBalance: '20',
      performance: '85'
    });
    
    setShowEditModal(false);
    setEditingEmployee(null);
    setIsSaving(false);
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    setEmployees(updatedEmployees);
    localStorage.setItem('hr_employees', JSON.stringify(updatedEmployees));
    setIsSaving(false);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'probation': return 'bg-orange-100 text-orange-800';
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
      <div className="space-y-8">
        {/* Fancy Header with Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">HR Management Hub</h1>
                <p className="text-blue-100 text-lg">Centralized Human Resources & Financial Management</p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{employees.length}</div>
                    <div className="text-blue-100 text-sm">Employees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{leaveRequests.filter(r => r.status === 'pending').length}</div>
                    <div className="text-blue-100 text-sm">Pending Requests</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => router.push('/hr/purchase-request')}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchase Requests</h3>
            <p className="text-gray-600 text-sm">Manage and approve purchase requests</p>
          </div>

          <div 
            onClick={() => router.push('/hr/invoices')}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoices</h3>
            <p className="text-gray-600 text-sm">Track and manage invoices</p>
          </div>

          <div 
            onClick={() => router.push('/hr/student-fees')}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Fees</h3>
            <p className="text-gray-600 text-sm">Manage student fee collection</p>
          </div>

          <div 
            onClick={() => router.push('/hr/utilities')}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Utilities & Rent</h3>
            <p className="text-gray-600 text-sm">Track rent and utility bills</p>
          </div>
        </div>

        {/* Employee Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
              <p className="text-gray-600 mt-1">Manage your workforce efficiently</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2 hover:bg-primary-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Employee
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Employees</p>
                  <p className="text-3xl font-bold text-blue-900">{employees.length}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-xl">
                  <Users className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Employees</p>
                  <p className="text-3xl font-bold text-green-900">
                    {employees.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-200 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending Leave</p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {leaveRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-700" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Performance</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {employees.length > 0 ? Math.round(employees.reduce((acc, e) => acc + e.performance, 0) / employees.length) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-purple-200 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="select-field"
              >
                <option value="all">All Departments</option>
                <option value="Academics">Academics</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Technology">Technology</option>
                <option value="Administration">Administration</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select-field"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="terminated">Terminated</option>
                <option value="probation">Probation</option>
              </select>
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Employee</th>
                    <th className="table-header">Position</th>
                    <th className="table-header">Department</th>
                    <th className="table-header">Hire Date</th>
                    <th className="table-header">Salary</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Leave Balance</th>
                    <th className="table-header">Performance</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell">
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </td>
                      <td className="table-cell">{employee.position}</td>
                      <td className="table-cell">{employee.department}</td>
                      <td className="table-cell">{new Date(employee.hireDate).toLocaleDateString()}</td>
                      <td className="table-cell">${employee.salary.toLocaleString()}</td>
                      <td className="table-cell">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="table-cell">{employee.leaveBalance} days</td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${employee.performance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{employee.performance}%</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => alert(`View employee details: ${employee.name}`)}
                            className="btn-icon btn-icon-primary hover:bg-primary-100" 
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditEmployee(employee)}
                            className="btn-icon btn-icon-secondary hover:bg-gray-100"
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="btn-icon btn-icon-danger hover:bg-red-100"
                            title="Delete Employee"
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
        </div>

        {/* Add Employee Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                    <input
                      type="text"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter job position"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                      className="select-field w-full"
                    >
                      <option value="Academics">Academics</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Technology">Technology</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date *</label>
                    <input
                      type="date"
                      value={newEmployee.hireDate}
                      onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
                    <input
                      type="number"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter annual salary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newEmployee.status}
                      onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="active">Active</option>
                      <option value="probation">Probation</option>
                      <option value="on_leave">On Leave</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Balance</label>
                    <input
                      type="number"
                      value={newEmployee.leaveBalance}
                      onChange={(e) => setNewEmployee({...newEmployee, leaveBalance: e.target.value})}
                      className="input-field w-full"
                      placeholder="Days remaining"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Performance Rating (%)</label>
                    <input
                      type="number"
                      value={newEmployee.performance}
                      onChange={(e) => setNewEmployee({...newEmployee, performance: e.target.value})}
                      className="input-field w-full"
                      placeholder="0-100"
                      min="0"
                      max="100"
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
                    onClick={handleAddEmployee}
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
                        Save Employee
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit Employee</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                    <input
                      type="text"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter job position"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                      className="select-field w-full"
                    >
                      <option value="Academics">Academics</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Technology">Technology</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date *</label>
                    <input
                      type="date"
                      value={newEmployee.hireDate}
                      onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                      className="input-field w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
                    <input
                      type="number"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                      className="input-field w-full"
                      placeholder="Enter annual salary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newEmployee.status}
                      onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value as any})}
                      className="select-field w-full"
                    >
                      <option value="active">Active</option>
                      <option value="probation">Probation</option>
                      <option value="on_leave">On Leave</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Balance</label>
                    <input
                      type="number"
                      value={newEmployee.leaveBalance}
                      onChange={(e) => setNewEmployee({...newEmployee, leaveBalance: e.target.value})}
                      className="input-field w-full"
                      placeholder="Days remaining"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Performance Rating (%)</label>
                    <input
                      type="number"
                      value={newEmployee.performance}
                      onChange={(e) => setNewEmployee({...newEmployee, performance: e.target.value})}
                      className="input-field w-full"
                      placeholder="0-100"
                      min="0"
                      max="100"
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
                    onClick={handleUpdateEmployee}
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
                        Update Employee
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
