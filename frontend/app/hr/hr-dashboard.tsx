'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
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
  PieChart,
  Clock3,
  CalendarDays,
  FileCheck,
  GraduationCap,
  Shield,
  Mail,
  MessageSquare,
  Bell,
  Download,
  Upload,
  CheckSquare,
  AlertTriangle,
  UserX,
  UserCheck2,
  CalendarCheck,
  FileClock,
  BookOpen,
  Phone,
  MapPin,
  CreditCard as CardIcon,
  FileText as DocumentIcon,
  Users as TeamIcon,
  Target as GoalIcon,
  TrendingDown,
  Activity,
  PieChart as ChartIcon
} from 'lucide-react';

// Enhanced interfaces based on client requirements
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  salaryType: 'fixed' | 'hourly';
  hourlyRate?: number;
  status: 'active' | 'on_leave' | 'terminated' | 'probation';
  leaveBalance: number;
  performance: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: {
    id: string;
    name: string;
    type: 'contract' | 'dbs_check' | 'safeguarding' | 'visa' | 'qualification' | 'first_aid';
    expiryDate: string;
    status: 'valid' | 'expired' | 'expiring_soon';
  }[];
  qualifications: {
    id: string;
    name: string;
    institution: string;
    date: string;
    expiryDate?: string;
  }[];
  workHistory: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
  }[];
  training: {
    id: string;
    name: string;
    type: 'safeguarding' | 'first_aid' | 'teaching' | 'other';
    date: string;
    expiryDate?: string;
    status: 'completed' | 'pending' | 'expired';
  }[];
  schedule: {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    classes: string[];
  }[];
}

interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity' | 'bereavement';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
  approvedBy?: string;
  approvedDate?: string;
}

interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
}

interface Payroll {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
  paymentDate?: string;
}

interface PerformanceReview {
  id: number;
  employeeId: number;
  employeeName: string;
  reviewDate: string;
  reviewer: string;
  rating: number;
  goals: string[];
  achievements: string[];
  areasForImprovement: string[];
  nextReviewDate: string;
  status: 'draft' | 'submitted' | 'approved';
}

interface JobPosting {
  id: number;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract';
  status: 'active' | 'closed';
  postedDate: string;
  applications: JobApplication[];
}

interface JobApplication {
  id: number;
  jobId: number;
  name: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  status: 'applied' | 'reviewing' | 'interviewed' | 'offered' | 'rejected';
  appliedDate: string;
  rating?: number;
  notes?: string;
}

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'policy' | 'handbook' | 'form';
  category: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'draft';
  fileUrl: string;
}

export default function HRDashboard() {
  const { user } = useAuth();
  
  // State management
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'attendance' | 'leave' | 'payroll' | 'performance' | 'recruitment' | 'documents' | 'reports'>('dashboard');
  
  // Modal states
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const savedEmployees = localStorage.getItem('hr_employees');
      const savedLeaveRequests = localStorage.getItem('hr_leave_requests');
      const savedAttendance = localStorage.getItem('hr_attendance');
      const savedPayroll = localStorage.getItem('hr_payroll');
      const savedPerformanceReviews = localStorage.getItem('hr_performance_reviews');
      const savedJobPostings = localStorage.getItem('hr_job_postings');
      const savedDocuments = localStorage.getItem('hr_documents');

      if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
      if (savedLeaveRequests) setLeaveRequests(JSON.parse(savedLeaveRequests));
      if (savedAttendance) setAttendance(JSON.parse(savedAttendance));
      if (savedPayroll) setPayroll(JSON.parse(savedPayroll));
      if (savedPerformanceReviews) setPerformanceReviews(JSON.parse(savedPerformanceReviews));
      if (savedJobPostings) setJobPostings(JSON.parse(savedJobPostings));
      if (savedDocuments) setDocuments(JSON.parse(savedDocuments));

      // If no data exists, initialize with sample data
      if (!savedEmployees) {
        const sampleEmployees: Employee[] = [
          {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@school.com',
            phone: '+44 7911 123456',
            address: '123 Oak Street, London, UK',
            position: 'Senior Teacher',
            department: 'Academics',
            hireDate: '2023-01-15',
            salary: 45000,
            salaryType: 'fixed',
            status: 'active',
            leaveBalance: 25,
            performance: 92,
            emergencyContact: {
              name: 'John Johnson',
              phone: '+44 7911 654321',
              relationship: 'Spouse'
            },
            documents: [
              {
                id: '1',
                name: 'Employment Contract',
                type: 'contract',
                expiryDate: '2025-01-15',
                status: 'valid'
              },
              {
                id: '2',
                name: 'DBS Check',
                type: 'dbs_check',
                expiryDate: '2024-06-15',
                status: 'expiring_soon'
              }
            ],
            qualifications: [
              {
                id: '1',
                name: 'PGCE',
                institution: 'University of London',
                date: '2022-07-01'
              }
            ],
            workHistory: [],
            training: [
              {
                id: '1',
                name: 'Safeguarding Training',
                type: 'safeguarding',
                date: '2023-03-15',
                expiryDate: '2024-03-15',
                status: 'completed'
              }
            ],
            schedule: []
          }
        ];
        setEmployees(sampleEmployees);
        localStorage.setItem('hr_employees', JSON.stringify(sampleEmployees));
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('hr_employees', JSON.stringify(employees));
      localStorage.setItem('hr_leave_requests', JSON.stringify(leaveRequests));
      localStorage.setItem('hr_attendance', JSON.stringify(attendance));
      localStorage.setItem('hr_payroll', JSON.stringify(payroll));
      localStorage.setItem('hr_performance_reviews', JSON.stringify(performanceReviews));
      localStorage.setItem('hr_job_postings', JSON.stringify(jobPostings));
      localStorage.setItem('hr_documents', JSON.stringify(documents));
    }
  }, [employees, leaveRequests, attendance, payroll, performanceReviews, jobPostings, documents, loading]);

  // Calculate dashboard metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const onLeaveEmployees = employees.filter(emp => emp.status === 'on_leave').length;
  const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'pending').length;
  const expiringDocuments = employees.flatMap(emp => 
    emp.documents.filter(doc => doc.status === 'expiring_soon')
  ).length;

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = (employeeData: Partial<Employee>) => {
    const newEmployee: Employee = {
      id: Date.now(),
      name: employeeData.name || '',
      email: employeeData.email || '',
      phone: employeeData.phone || '',
      address: employeeData.address || '',
      position: employeeData.position || '',
      department: employeeData.department || 'Academics',
      hireDate: employeeData.hireDate || new Date().toISOString().split('T')[0],
      salary: employeeData.salary || 0,
      salaryType: employeeData.salaryType || 'fixed',
      status: employeeData.status || 'active',
      leaveBalance: employeeData.leaveBalance || 25,
      performance: employeeData.performance || 85,
      emergencyContact: employeeData.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      documents: employeeData.documents || [],
      qualifications: employeeData.qualifications || [],
      workHistory: employeeData.workHistory || [],
      training: employeeData.training || [],
      schedule: employeeData.schedule || []
    };
    setEmployees([...employees, newEmployee]);
    setShowAddEmployee(false);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeProfile(true);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-green-600">{activeEmployees}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-orange-600">{onLeaveEmployees}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-red-600">{pendingLeaveRequests}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAddEmployee(true)}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Employee</span>
          </button>
          
          <button
            onClick={() => setShowAddLeave(true)}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <CalendarDays className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Leave Request</span>
          </button>
          
          <button
            onClick={() => setActiveTab('attendance')}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Clock3 className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Attendance</span>
          </button>
          
          <button
            onClick={() => setShowAddJob(true)}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <Briefcase className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Post Job</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leave Requests</h3>
          <div className="space-y-3">
            {leaveRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{request.employeeName}</p>
                  <p className="text-sm text-gray-600">{request.leaveType} • {request.days} days</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expiring Documents</h3>
          <div className="space-y-3">
            {employees.flatMap(emp => 
              emp.documents.filter(doc => doc.status === 'expiring_soon')
            ).slice(0, 5).map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-600">Expires: {doc.expiryDate}</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600">Manage staff profiles, contracts, and compliance</p>
        </div>
        <button
          onClick={() => setShowAddEmployee(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Departments</option>
              <option value="Academics">Academics</option>
              <option value="Administration">Administration</option>
              <option value="Support">Support</option>
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="probation">Probation</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div>
            <button className="btn-secondary w-full flex items-center justify-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === 'active' ? 'bg-green-100 text-green-800' :
                      employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                      employee.status === 'probation' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {employee.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${employee.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{employee.performance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
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
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
          <p className="text-gray-600">Track clock-in/clock-out and manage schedules</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          Clock In/Out
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Attendance tracking system will be implemented here with clock-in/clock-out functionality, shift management, and schedule linking.</p>
      </div>
    </div>
  );

  const renderLeave = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-600">Manage leave requests and approvals</p>
        </div>
        <button
          onClick={() => setShowAddLeave(true)}
          className="btn-primary flex items-center gap-2"
        >
          <CalendarDays className="h-4 w-4" />
          New Leave Request
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Leave management system with request workflow, approval process, and leave balance tracking will be implemented here.</p>
      </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll Management</h2>
          <p className="text-gray-600">Manage salaries, overtime, and compensation</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Process Payroll
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Payroll system with salary management, overtime tracking, bonus calculations, and integration with payroll software will be implemented here.</p>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Management</h2>
          <p className="text-gray-600">Conduct reviews and track professional development</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Target className="h-4 w-4" />
          New Review
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Performance review system with appraisals, goal-setting, feedback cycles, and professional development tracking will be implemented here.</p>
      </div>
    </div>
  );

  const renderRecruitment = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recruitment & Onboarding</h2>
          <p className="text-gray-600">Manage job postings and candidate applications</p>
        </div>
        <button
          onClick={() => setShowAddJob(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Briefcase className="h-4 w-4" />
          Post Job
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Recruitment system with job posting, applicant tracking, interview scheduling, candidate rating, and onboarding workflow will be implemented here.</p>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
          <p className="text-gray-600">Store and manage contracts, policies, and forms</p>
        </div>
        <button
          onClick={() => setShowAddDocument(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Document management system with digital contract storage, policy library, form templates, and expiry alerts will be implemented here.</p>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">HR Reports & Analytics</h2>
          <p className="text-gray-600">Generate reports and analyze HR metrics</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Reporting system with staff turnover, retention, absence, payroll costs, and compliance reports will be implemented here.</p>
      </div>
    </div>
  );

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Human Resources</h1>
            <p className="text-gray-600">Comprehensive HR management system</p>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-400" />
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'employees', name: 'Employees', icon: Users },
              { id: 'attendance', name: 'Attendance', icon: Clock3 },
              { id: 'leave', name: 'Leave', icon: CalendarDays },
              { id: 'payroll', name: 'Payroll', icon: DollarSign },
              { id: 'performance', name: 'Performance', icon: Target },
              { id: 'recruitment', name: 'Recruitment', icon: Briefcase },
              { id: 'documents', name: 'Documents', icon: FileText },
              { id: 'reports', name: 'Reports', icon: ChartIcon }
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

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'attendance' && renderAttendance()}
        {activeTab === 'leave' && renderLeave()}
        {activeTab === 'payroll' && renderPayroll()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'recruitment' && renderRecruitment()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Modals will be implemented here */}
    </DashboardLayout>
  );
}
