'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FileText, 
  Shield, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Edit, 
  X, 
  Upload,
  User,
  Building,
  Mail,
  Phone,
  Award,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Employee {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  startDate: string;
}

interface Contract {
  id: number;
  employeeId: number;
  employeeName: string;
  contractType: 'permanent' | 'temporary' | 'freelance' | 'probation';
  startDate: string;
  endDate?: string;
  salary: number;
  workingHours: number;
  holidayEntitlement: number;
  noticePeriod: string;
  status: 'active' | 'expired' | 'terminated' | 'pending';
  signedDate?: string;
  filePath?: string;
}

interface DBSCheck {
  id: number;
  employeeId: number;
  employeeName: string;
  dbsLevel: 'basic' | 'standard' | 'enhanced' | 'enhanced_barred';
  applicationDate: string;
  issueDate?: string;
  expiryDate: string;
  certificateNumber?: string;
  status: 'pending' | 'clear' | 'disclosed' | 'expired' | 'failed';
  renewalRequired: boolean;
  notes?: string;
}

interface Training {
  id: number;
  employeeId: number;
  employeeName: string;
  trainingType: string;
  provider: string;
  completionDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  status: 'completed' | 'in_progress' | 'expired' | 'required';
  filePath?: string;
}

export default function EmployeeContractsPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [dbsChecks, setDbsChecks] = useState<DBSCheck[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [activeTab, setActiveTab] = useState<'contracts' | 'dbs' | 'training'>('contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

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
    // Load data
    const loadData = () => {
      try {
        // Load employees
        const savedEmployees = localStorage.getItem('employees');
        if (savedEmployees) {
          setEmployees(JSON.parse(savedEmployees));
        } else {
          // Mock employees
          const mockEmployees: Employee[] = [
            {
              id: 1,
              name: 'John Smith',
              employeeId: 'EMP001',
              department: 'Teaching',
              position: 'Mathematics Teacher',
              email: 'john.smith@school.com',
              phone: '+1234567890',
              startDate: '2023-01-15'
            },
            {
              id: 2,
              name: 'Sarah Johnson',
              employeeId: 'EMP002',
              department: 'Teaching',
              position: 'English Teacher',
              email: 'sarah.johnson@school.com',
              phone: '+1234567891',
              startDate: '2023-03-01'
            },
            {
              id: 3,
              name: 'Michael Brown',
              employeeId: 'EMP003',
              department: 'Administration',
              position: 'Admin Assistant',
              email: 'michael.brown@school.com',
              phone: '+1234567892',
              startDate: '2023-06-10'
            }
          ];
          setEmployees(mockEmployees);
          localStorage.setItem('employees', JSON.stringify(mockEmployees));
        }

        // Load contracts
        const savedContracts = localStorage.getItem('employee_contracts');
        if (savedContracts) {
          setContracts(JSON.parse(savedContracts));
        } else {
          // Mock contracts
          const mockContracts: Contract[] = [
            {
              id: 1,
              employeeId: 1,
              employeeName: 'John Smith',
              contractType: 'permanent',
              startDate: '2023-01-15',
              salary: 42000,
              workingHours: 37.5,
              holidayEntitlement: 25,
              noticePeriod: '1 month',
              status: 'active',
              signedDate: '2023-01-10',
              filePath: '/contracts/john-smith-contract.pdf'
            },
            {
              id: 2,
              employeeId: 2,
              employeeName: 'Sarah Johnson',
              contractType: 'permanent',
              startDate: '2023-03-01',
              salary: 40000,
              workingHours: 37.5,
              holidayEntitlement: 25,
              noticePeriod: '1 month',
              status: 'active',
              signedDate: '2023-02-28',
              filePath: '/contracts/sarah-johnson-contract.pdf'
            },
            {
              id: 3,
              employeeId: 3,
              employeeName: 'Michael Brown',
              contractType: 'probation',
              startDate: '2023-06-10',
              endDate: '2023-12-10',
              salary: 35000,
              workingHours: 40,
              holidayEntitlement: 20,
              noticePeriod: '1 week',
              status: 'active',
              signedDate: '2023-06-08'
            }
          ];
          setContracts(mockContracts);
          localStorage.setItem('employee_contracts', JSON.stringify(mockContracts));
        }

        // Load DBS checks
        const savedDBS = localStorage.getItem('employee_dbs');
        if (savedDBS) {
          setDbsChecks(JSON.parse(savedDBS));
        } else {
          // Mock DBS checks
          const mockDBS: DBSCheck[] = [
            {
              id: 1,
              employeeId: 1,
              employeeName: 'John Smith',
              dbsLevel: 'enhanced',
              applicationDate: '2023-01-01',
              issueDate: '2023-01-15',
              expiryDate: '2026-01-15',
              certificateNumber: 'DBS001234567',
              status: 'clear',
              renewalRequired: false,
              notes: 'No criminal convictions disclosed'
            },
            {
              id: 2,
              employeeId: 2,
              employeeName: 'Sarah Johnson',
              dbsLevel: 'enhanced',
              applicationDate: '2023-02-15',
              issueDate: '2023-03-01',
              expiryDate: '2026-03-01',
              certificateNumber: 'DBS001234568',
              status: 'clear',
              renewalRequired: false
            },
            {
              id: 3,
              employeeId: 3,
              employeeName: 'Michael Brown',
              dbsLevel: 'basic',
              applicationDate: '2023-06-01',
              issueDate: '2023-06-10',
              expiryDate: '2024-06-10',
              certificateNumber: 'DBS001234569',
              status: 'clear',
              renewalRequired: true,
              notes: 'Renewal required within 3 months'
            }
          ];
          setDbsChecks(mockDBS);
          localStorage.setItem('employee_dbs', JSON.stringify(mockDBS));
        }

        // Load training records
        const savedTraining = localStorage.getItem('employee_training');
        if (savedTraining) {
          setTrainings(JSON.parse(savedTraining));
        } else {
          // Mock training records
          const mockTraining: Training[] = [
            {
              id: 1,
              employeeId: 1,
              employeeName: 'John Smith',
              trainingType: 'Safeguarding Training',
              provider: 'Education Safety Council',
              completionDate: '2023-02-01',
              expiryDate: '2026-02-01',
              certificateNumber: 'SAFE2023001',
              status: 'completed',
              filePath: '/training/john-safeguarding.pdf'
            },
            {
              id: 2,
              employeeId: 1,
              employeeName: 'John Smith',
              trainingType: 'First Aid Training',
              provider: 'Red Cross',
              completionDate: '2023-03-15',
              expiryDate: '2026-03-15',
              certificateNumber: 'FA2023001',
              status: 'completed'
            },
            {
              id: 3,
              employeeId: 2,
              employeeName: 'Sarah Johnson',
              trainingType: 'Safeguarding Training',
              provider: 'Education Safety Council',
              completionDate: '2023-04-01',
              expiryDate: '2024-04-01',
              certificateNumber: 'SAFE2023002',
              status: 'expired'
            }
          ];
          setTrainings(mockTraining);
          localStorage.setItem('employee_training', JSON.stringify(mockTraining));
        }

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'clear':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'disclosed':
        return 'bg-orange-100 text-orange-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDbsLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'standard':
        return 'bg-purple-100 text-purple-800';
      case 'enhanced':
        return 'bg-orange-100 text-orange-800';
      case 'enhanced_barred':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow;
  };

  const renderContracts = () => {
    const filteredContracts = contracts.filter(contract => {
      const matchesSearch = contract.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{contract.employeeName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-900">{contract.contractType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(contract.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    £{contract.salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View Contract">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDBS = () => {
    const filteredDBS = dbsChecks.filter(dbs => {
      const matchesSearch = dbs.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || dbs.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DBS Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDBS.map((dbs) => (
                <tr key={dbs.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{dbs.employeeName}</div>
                        {dbs.certificateNumber && (
                          <div className="text-sm text-gray-500">{dbs.certificateNumber}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDbsLevelColor(dbs.dbsLevel)}`}>
                      {dbs.dbsLevel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dbs.issueDate ? new Date(dbs.issueDate).toLocaleDateString() : 'Pending'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{new Date(dbs.expiryDate).toLocaleDateString()}</span>
                      {isExpiringSoon(dbs.expiryDate) && (
                        <span title="Expiring soon">
                          <AlertTriangle className="h-4 w-4 text-orange-500 ml-2" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dbs.status)}`}>
                      {dbs.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View DBS">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTraining = () => {
    const filteredTraining = trainings.filter(training => {
      const matchesSearch = training.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.trainingType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || training.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTraining.map((training) => (
                <tr key={training.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{training.employeeName}</div>
                        <div className="text-sm text-gray-500">{training.provider}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{training.trainingType}</div>
                    {training.certificateNumber && (
                      <div className="text-sm text-gray-500">{training.certificateNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(training.completionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {training.expiryDate ? (
                        <>
                          <span className="text-sm text-gray-900">{new Date(training.expiryDate).toLocaleDateString()}</span>
                          {isExpiringSoon(training.expiryDate) && (
                            <span title="Expiring soon">
                              <AlertTriangle className="h-4 w-4 text-orange-500 ml-2" />
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">No expiry</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(training.status)}`}>
                      {training.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View Certificate">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Employee Contracts & Compliance</h1>
            <p className="text-gray-600">Manage contracts, DBS checks, and training records</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contracts.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valid DBS</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dbsChecks.filter(d => d.status === 'clear').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {[...dbsChecks, ...trainings.filter(t => t.expiryDate)]
                    .filter(item => isExpiringSoon(item.expiryDate!)).length}
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
                <p className="text-sm font-medium text-gray-600">Training Records</p>
                <p className="text-2xl font-semibold text-gray-900">{trainings.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'contracts', name: 'Contracts', icon: FileText },
                { id: 'dbs', name: 'DBS Checks', icon: Shield },
                { id: 'training', name: 'Training', icon: Award }
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

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="clear">Clear</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'contracts' && renderContracts()}
            {activeTab === 'dbs' && renderDBS()}
            {activeTab === 'training' && renderTraining()}
          </div>
        </div>

        {/* Expiring Items Alert */}
        {[...dbsChecks, ...trainings.filter(t => t.expiryDate)]
          .filter(item => isExpiringSoon(item.expiryDate!)).length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-orange-800 mb-1">Items Expiring Soon</h3>
                <p className="text-sm text-orange-700">
                  You have items that will expire within the next 3 months. Please review and take action as needed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
