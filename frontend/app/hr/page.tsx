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
  PieChart,
  BookOpen,
  MessageSquare,
  Timer
} from 'lucide-react';

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

export default function HRPage() {
  const { user } = useAuth();
  const router = useRouter();
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: 'Academics',
    hireDate: '',
    salary: '',
    salaryType: 'fixed' as 'fixed' | 'hourly',
    hourlyRate: '',
    status: 'active' as 'active' | 'on_leave' | 'terminated' | 'probation',
    leaveBalance: '25',
    performance: '85',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Additional modal states
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showEmployeeProfile, setShowEmployeeProfile] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showClockInModal, setShowClockInModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [showLeaveRequestModal, setShowLeaveRequestModal] = useState(false);
  const [showPerformanceReviewModal, setShowPerformanceReviewModal] = useState(false);
  const [showJobPostingModal, setShowJobPostingModal] = useState(false);
  const [showDocumentAlertModal, setShowDocumentAlertModal] = useState(false);
  const [showEmployeePortalModal, setShowEmployeePortalModal] = useState(false);
  const [showReportingModal, setShowReportingModal] = useState(false);

  // Leave request state
  const [leaveRequestData, setLeaveRequestData] = useState({
    employeeId: 0,
    leaveType: 'vacation' as 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity' | 'bereavement',
    startDate: '',
    endDate: '',
    reason: '',
    days: 0
  });

  // Performance review state
  const [performanceReviewData, setPerformanceReviewData] = useState({
    employeeId: 0,
    reviewDate: new Date().toISOString().split('T')[0],
    rating: 85,
    goals: [''],
    achievements: [''],
    areasForImprovement: [''],
    nextReviewDate: ''
  });

  // Job posting state
  const [jobPostingData, setJobPostingData] = useState({
    title: '',
    department: 'Academics',
    description: '',
    requirements: [''],
    salary: '',
    location: 'London',
    type: 'full_time' as 'full_time' | 'part_time' | 'contract'
  });

  // Employee portal state
  const [selectedPortalEmployee, setSelectedPortalEmployee] = useState<Employee | null>(null);

  // Clock-in/out state
  const [clockInData, setClockInData] = useState({
    employeeId: 0,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: 'clock_in' as 'clock_in' | 'clock_out',
    notes: ''
  });

  // Communication state
  const [communicationData, setCommunicationData] = useState({
    subject: '',
    message: '',
    recipients: [] as number[],
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent'
  });

  // Overtime state
  const [overtimeData, setOvertimeData] = useState({
    employeeId: 0,
    date: new Date().toISOString().split('T')[0],
    hours: '',
    reason: '',
    approved: false
  });

  // Load data from localStorage or use mock data for first time
  useEffect(() => {
    const savedEmployees = localStorage.getItem('hr_employees');
    const savedLeaveRequests = localStorage.getItem('hr_leave_requests');
    const savedAttendance = localStorage.getItem('hr_attendance');
    const savedPayroll = localStorage.getItem('hr_payroll');
    const savedPerformanceReviews = localStorage.getItem('hr_performance_reviews');
    const savedJobPostings = localStorage.getItem('hr_job_postings');
    const savedDocuments = localStorage.getItem('hr_documents');

    if (savedEmployees && savedLeaveRequests && savedAttendance && savedPayroll && savedPerformanceReviews && savedJobPostings && savedDocuments) {
      if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
      if (savedLeaveRequests) setLeaveRequests(JSON.parse(savedLeaveRequests));
      if (savedAttendance) setAttendance(JSON.parse(savedAttendance));
      if (savedPayroll) setPayroll(JSON.parse(savedPayroll));
      if (savedPerformanceReviews) setPerformanceReviews(JSON.parse(savedPerformanceReviews));
      if (savedJobPostings) setJobPostings(JSON.parse(savedJobPostings));
      if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
      
      setLoading(false);
    } else {
      const mockEmployees: Employee[] = [
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
        },
        {
          id: 2,
          name: 'David Wilson',
          email: 'david.wilson@school.com',
          phone: '+44 7911 234567',
          address: '456 Pine Avenue, London, UK',
          position: 'English Teacher',
          department: 'Academics',
          hireDate: '2022-08-20',
          salary: 42000,
          salaryType: 'fixed',
          status: 'active',
          leaveBalance: 20,
          performance: 88,
          emergencyContact: {
            name: 'Mary Wilson',
            phone: '+44 7911 765432',
            relationship: 'Spouse'
          },
          documents: [],
          qualifications: [],
          workHistory: [],
          training: [],
          schedule: []
        }
      ];

      const mockLeaveRequests: LeaveRequest[] = [
        {
          id: 1,
          employeeId: 1,
          employeeName: 'Sarah Johnson',
          leaveType: 'vacation',
          startDate: '2024-01-20',
          endDate: '2024-01-25',
          reason: 'Family vacation',
          status: 'approved',
          days: 5,
          approvedBy: 'HR Manager',
          approvedDate: '2024-01-15'
        }
      ];

      setTimeout(() => {
        setEmployees(mockEmployees);
        setLeaveRequests(mockLeaveRequests);
        localStorage.setItem('hr_employees', JSON.stringify(mockEmployees));
        localStorage.setItem('hr_leave_requests', JSON.stringify(mockLeaveRequests));
        localStorage.setItem('hr_attendance', JSON.stringify([]));
        localStorage.setItem('hr_payroll', JSON.stringify([]));
        localStorage.setItem('hr_performance_reviews', JSON.stringify([]));
        localStorage.setItem('hr_job_postings', JSON.stringify([]));
        localStorage.setItem('hr_documents', JSON.stringify([]));
        setLoading(false);
      }, 1000);
    }
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
      phone: newEmployee.phone || '',
      address: newEmployee.address || '',
      position: newEmployee.position,
      department: newEmployee.department,
      hireDate: newEmployee.hireDate,
      salary: parseInt(newEmployee.salary),
      salaryType: newEmployee.salaryType || 'fixed',
      hourlyRate: newEmployee.hourlyRate ? parseFloat(newEmployee.hourlyRate) : undefined,
      status: newEmployee.status,
      leaveBalance: parseInt(newEmployee.leaveBalance),
      performance: parseInt(newEmployee.performance),
      emergencyContact: newEmployee.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      documents: [],
      qualifications: [],
      workHistory: [],
      training: [],
      schedule: []
    };

    const updatedEmployees = [...employees, newEmp];
    setEmployees(updatedEmployees);
    localStorage.setItem('hr_employees', JSON.stringify(updatedEmployees));
    
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      address: '',
      position: '',
      department: 'Academics',
      hireDate: '',
      salary: '',
      salaryType: 'fixed' as 'fixed' | 'hourly',
      hourlyRate: '',
      status: 'active' as 'active' | 'on_leave' | 'terminated' | 'probation',
      leaveBalance: '25',
      performance: '85',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    });
    
    setShowAddModal(false);
    setIsSaving(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      position: employee.position,
      department: employee.department,
      hireDate: employee.hireDate,
      salary: employee.salary.toString(),
      salaryType: employee.salaryType,
      hourlyRate: employee.hourlyRate?.toString() || '',
      status: employee.status,
      leaveBalance: employee.leaveBalance.toString(),
      performance: employee.performance.toString(),
      emergencyContact: employee.emergencyContact
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
      phone: newEmployee.phone || editingEmployee.phone,
      address: newEmployee.address || editingEmployee.address,
      position: newEmployee.position,
      department: newEmployee.department,
      hireDate: newEmployee.hireDate,
      salary: parseInt(newEmployee.salary),
      salaryType: newEmployee.salaryType || editingEmployee.salaryType,
      hourlyRate: newEmployee.hourlyRate ? parseFloat(newEmployee.hourlyRate) : editingEmployee.hourlyRate,
      status: newEmployee.status,
      leaveBalance: parseInt(newEmployee.leaveBalance),
      performance: parseInt(newEmployee.performance),
      emergencyContact: newEmployee.emergencyContact || editingEmployee.emergencyContact
    };

    const updatedEmployees = employees.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp);
    setEmployees(updatedEmployees);
    localStorage.setItem('hr_employees', JSON.stringify(updatedEmployees));
    
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      address: '',
      position: '',
      department: 'Academics',
      hireDate: '',
      salary: '',
      salaryType: 'fixed' as 'fixed' | 'hourly',
      hourlyRate: '',
      status: 'active' as 'active' | 'on_leave' | 'terminated' | 'probation',
      leaveBalance: '25',
      performance: '85',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
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

  // Calculate dashboard metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const onLeaveEmployees = employees.filter(emp => emp.status === 'on_leave').length;
  const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'pending').length;
  const expiringDocuments = employees.flatMap(emp => 
    emp.documents.filter(doc => doc.status === 'expiring_soon')
  ).length;

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

          <div 
            onClick={() => router.push('/hr/teacher-registers')}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">
                <UserCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Registers</h3>
            <p className="text-gray-600 text-sm">Take attendance and record performance</p>
          </div>

          <div 
            onClick={() => router.push('/hr/class-selection')}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors">
                <BookOpen className="w-6 h-6 text-teal-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Selection</h3>
            <p className="text-gray-600 text-sm">Manage student class enrollments</p>
          </div>

          <div 
            onClick={() => setShowClockInModal(true)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-cyan-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-100 rounded-xl group-hover:bg-cyan-200 transition-colors">
                <Clock className="w-6 h-6 text-cyan-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clock In/Out</h3>
            <p className="text-gray-600 text-sm">Record attendance and time tracking</p>
          </div>

          <div 
            onClick={() => setShowCommunicationModal(true)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-pink-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors">
                <MessageSquare className="w-6 h-6 text-pink-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Internal Communication</h3>
            <p className="text-gray-600 text-sm">Send announcements and messages</p>
          </div>

          <div 
            onClick={() => setShowOvertimeModal(true)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                <Timer className="w-6 h-6 text-amber-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overtime Management</h3>
            <p className="text-gray-600 text-sm">Track and approve overtime hours</p>
          </div>

          <div 
            onClick={() => setShowLeaveRequestModal(true)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Leave Requests</h3>
            <p className="text-gray-600 text-sm">Manage leave requests and approvals</p>
          </div>

          <div 
            onClick={() => setShowPerformanceReviewModal(true)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-violet-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-violet-100 rounded-xl group-hover:bg-violet-200 transition-colors">
                <Star className="w-6 h-6 text-violet-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-violet-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Reviews</h3>
            <p className="text-gray-600 text-sm">Conduct appraisals and feedback</p>
          </div>

          <div 
            onClick={() => setShowJobPostingModal(true)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-rose-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-100 rounded-xl group-hover:bg-rose-200 transition-colors">
                <Briefcase className="w-6 h-6 text-rose-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recruitment ATS</h3>
            <p className="text-gray-600 text-sm">Job postings and applicant tracking</p>
          </div>

          <div 
            onClick={() => setShowDocumentAlertModal(true)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Alerts</h3>
            <p className="text-gray-600 text-sm">Expiring DBS and training certificates</p>
          </div>

          <div 
            onClick={() => setShowEmployeePortalModal(true)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-sky-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-sky-100 rounded-xl group-hover:bg-sky-200 transition-colors">
                <Users className="w-6 h-6 text-sky-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sky-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Portal</h3>
            <p className="text-gray-600 text-sm">Self-service payslips and schedules</p>
          </div>

          <div 
            onClick={() => setShowReportingModal(true)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-lime-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-lime-100 rounded-xl group-hover:bg-lime-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-lime-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-lime-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">HR Analytics</h3>
            <p className="text-gray-600 text-sm">Reports and compliance tracking</p>
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

         {/* Clock In/Out Modal */}
         {showClockInModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
               <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-gray-900">Clock In/Out</h2>
                   <button
                     onClick={() => setShowClockInModal(false)}
                     className="text-gray-400 hover:text-gray-600 transition-colors"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                     <select
                       value={clockInData.employeeId}
                       onChange={(e) => setClockInData({...clockInData, employeeId: parseInt(e.target.value)})}
                       className="select-field w-full"
                     >
                       <option value={0}>Select Employee</option>
                       {employees.map(emp => (
                         <option key={emp.id} value={emp.id}>{emp.name}</option>
                       ))}
                     </select>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                     <select
                       value={clockInData.type}
                       onChange={(e) => setClockInData({...clockInData, type: e.target.value as 'clock_in' | 'clock_out'})}
                       className="select-field w-full"
                     >
                       <option value="clock_in">Clock In</option>
                       <option value="clock_out">Clock Out</option>
                     </select>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                     <input
                       type="date"
                       value={clockInData.date}
                       onChange={(e) => setClockInData({...clockInData, date: e.target.value})}
                       className="input-field w-full"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                     <input
                       type="time"
                       value={clockInData.time}
                       onChange={(e) => setClockInData({...clockInData, time: e.target.value})}
                       className="input-field w-full"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                     <textarea
                       value={clockInData.notes}
                       onChange={(e) => setClockInData({...clockInData, notes: e.target.value})}
                       className="input-field w-full"
                       rows={3}
                       placeholder="Any additional notes..."
                     />
                   </div>
                 </div>
                 
                 <div className="flex gap-3 mt-6">
                   <button
                     onClick={() => setShowClockInModal(false)}
                     className="btn-secondary flex-1"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={() => {
                       // Handle clock in/out logic here
                       alert(`${clockInData.type === 'clock_in' ? 'Clocked In' : 'Clocked Out'} successfully!`);
                       setShowClockInModal(false);
                     }}
                     className="btn-primary flex-1"
                   >
                     Record {clockInData.type === 'clock_in' ? 'Clock In' : 'Clock Out'}
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* Internal Communication Modal */}
         {showCommunicationModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
               <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-gray-900">Send Internal Communication</h2>
                   <button
                     onClick={() => setShowCommunicationModal(false)}
                     className="text-gray-400 hover:text-gray-600 transition-colors"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                     <input
                       type="text"
                       value={communicationData.subject}
                       onChange={(e) => setCommunicationData({...communicationData, subject: e.target.value})}
                       className="input-field w-full"
                       placeholder="Enter message subject"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                     <select
                       value={communicationData.priority}
                       onChange={(e) => setCommunicationData({...communicationData, priority: e.target.value as any})}
                       className="select-field w-full"
                     >
                       <option value="low">Low</option>
                       <option value="normal">Normal</option>
                       <option value="high">High</option>
                       <option value="urgent">Urgent</option>
                     </select>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                     <div className="space-y-2 max-h-32 overflow-y-auto">
                       {employees.map(emp => (
                         <label key={emp.id} className="flex items-center">
                           <input
                             type="checkbox"
                             checked={communicationData.recipients.includes(emp.id)}
                             onChange={(e) => {
                               if (e.target.checked) {
                                 setCommunicationData({
                                   ...communicationData,
                                   recipients: [...communicationData.recipients, emp.id]
                                 });
                               } else {
                                 setCommunicationData({
                                   ...communicationData,
                                   recipients: communicationData.recipients.filter(id => id !== emp.id)
                                 });
                               }
                             }}
                             className="mr-2"
                           />
                           <span className="text-sm">{emp.name} ({emp.position})</span>
                         </label>
                       ))}
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                     <textarea
                       value={communicationData.message}
                       onChange={(e) => setCommunicationData({...communicationData, message: e.target.value})}
                       className="input-field w-full"
                       rows={6}
                       placeholder="Enter your message..."
                     />
                   </div>
                 </div>
                 
                 <div className="flex gap-3 mt-6">
                   <button
                     onClick={() => setShowCommunicationModal(false)}
                     className="btn-secondary flex-1"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={() => {
                       if (!communicationData.subject || !communicationData.message) {
                         alert('Please fill in subject and message');
                         return;
                       }
                       alert(`Message sent to ${communicationData.recipients.length} recipients!`);
                       setShowCommunicationModal(false);
                     }}
                     className="btn-primary flex-1"
                   >
                     Send Message
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* Overtime Management Modal */}
         {showOvertimeModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
               <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-gray-900">Overtime Management</h2>
                   <button
                     onClick={() => setShowOvertimeModal(false)}
                     className="text-gray-400 hover:text-gray-600 transition-colors"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                     <select
                       value={overtimeData.employeeId}
                       onChange={(e) => setOvertimeData({...overtimeData, employeeId: parseInt(e.target.value)})}
                       className="select-field w-full"
                     >
                       <option value={0}>Select Employee</option>
                       {employees.map(emp => (
                         <option key={emp.id} value={emp.id}>{emp.name}</option>
                       ))}
                     </select>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                     <input
                       type="date"
                       value={overtimeData.date}
                       onChange={(e) => setOvertimeData({...overtimeData, date: e.target.value})}
                       className="input-field w-full"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Hours</label>
                     <input
                       type="number"
                       value={overtimeData.hours}
                       onChange={(e) => setOvertimeData({...overtimeData, hours: e.target.value})}
                       className="input-field w-full"
                       placeholder="Enter overtime hours"
                       min="0"
                       step="0.5"
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                     <textarea
                       value={overtimeData.reason}
                       onChange={(e) => setOvertimeData({...overtimeData, reason: e.target.value})}
                       className="input-field w-full"
                       rows={3}
                       placeholder="Reason for overtime..."
                     />
                   </div>
                   
                   <div>
                     <label className="flex items-center">
                       <input
                         type="checkbox"
                         checked={overtimeData.approved}
                         onChange={(e) => setOvertimeData({...overtimeData, approved: e.target.checked})}
                         className="mr-2"
                       />
                       <span className="text-sm font-medium text-gray-700">Pre-approved</span>
                     </label>
                   </div>
                 </div>
                 
                 <div className="flex gap-3 mt-6">
                   <button
                     onClick={() => setShowOvertimeModal(false)}
                     className="btn-secondary flex-1"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={() => {
                       if (!overtimeData.employeeId || !overtimeData.hours || !overtimeData.reason) {
                         alert('Please fill in all required fields');
                         return;
                       }
                       alert('Overtime recorded successfully!');
                       setShowOvertimeModal(false);
                     }}
                     className="btn-primary flex-1"
                   >
                     Record Overtime
                   </button>
                 </div>
               </div>
             </div>
           </div>
                   )}

          {/* Leave Request Modal */}
          {showLeaveRequestModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Leave Request</h2>
                    <button
                      onClick={() => setShowLeaveRequestModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                      <select
                        value={leaveRequestData.employeeId}
                        onChange={(e) => setLeaveRequestData({...leaveRequestData, employeeId: parseInt(e.target.value)})}
                        className="select-field w-full"
                      >
                        <option value={0}>Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                      <select
                        value={leaveRequestData.leaveType}
                        onChange={(e) => setLeaveRequestData({...leaveRequestData, leaveType: e.target.value as any})}
                        className="select-field w-full"
                      >
                        <option value="vacation">Vacation</option>
                        <option value="sick">Sick Leave</option>
                        <option value="personal">Personal</option>
                        <option value="maternity">Maternity</option>
                        <option value="paternity">Paternity</option>
                        <option value="bereavement">Bereavement</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={leaveRequestData.startDate}
                          onChange={(e) => setLeaveRequestData({...leaveRequestData, startDate: e.target.value})}
                          className="input-field w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={leaveRequestData.endDate}
                          onChange={(e) => setLeaveRequestData({...leaveRequestData, endDate: e.target.value})}
                          className="input-field w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                      <textarea
                        value={leaveRequestData.reason}
                        onChange={(e) => setLeaveRequestData({...leaveRequestData, reason: e.target.value})}
                        className="input-field w-full"
                        rows={3}
                        placeholder="Reason for leave request..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowLeaveRequestModal(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!leaveRequestData.employeeId || !leaveRequestData.startDate || !leaveRequestData.endDate) {
                          alert('Please fill in all required fields');
                          return;
                        }
                        alert('Leave request submitted successfully!');
                        setShowLeaveRequestModal(false);
                      }}
                      className="btn-primary flex-1"
                    >
                      Submit Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Review Modal */}
          {showPerformanceReviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Performance Review</h2>
                    <button
                      onClick={() => setShowPerformanceReviewModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                      <select
                        value={performanceReviewData.employeeId}
                        onChange={(e) => setPerformanceReviewData({...performanceReviewData, employeeId: parseInt(e.target.value)})}
                        className="select-field w-full"
                      >
                        <option value={0}>Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Review Date</label>
                        <input
                          type="date"
                          value={performanceReviewData.reviewDate}
                          onChange={(e) => setPerformanceReviewData({...performanceReviewData, reviewDate: e.target.value})}
                          className="input-field w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-100)</label>
                        <input
                          type="number"
                          value={performanceReviewData.rating}
                          onChange={(e) => setPerformanceReviewData({...performanceReviewData, rating: parseInt(e.target.value)})}
                          className="input-field w-full"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Goals</label>
                      {performanceReviewData.goals.map((goal, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={goal}
                            onChange={(e) => {
                              const newGoals = [...performanceReviewData.goals];
                              newGoals[index] = e.target.value;
                              setPerformanceReviewData({...performanceReviewData, goals: newGoals});
                            }}
                            className="input-field flex-1"
                            placeholder="Enter goal..."
                          />
                          <button
                            onClick={() => {
                              const newGoals = performanceReviewData.goals.filter((_, i) => i !== index);
                              setPerformanceReviewData({...performanceReviewData, goals: newGoals});
                            }}
                            className="btn-icon btn-icon-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setPerformanceReviewData({
                          ...performanceReviewData,
                          goals: [...performanceReviewData.goals, '']
                        })}
                        className="btn-secondary text-sm"
                      >
                        + Add Goal
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                      {performanceReviewData.achievements.map((achievement, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...performanceReviewData.achievements];
                              newAchievements[index] = e.target.value;
                              setPerformanceReviewData({...performanceReviewData, achievements: newAchievements});
                            }}
                            className="input-field flex-1"
                            placeholder="Enter achievement..."
                          />
                          <button
                            onClick={() => {
                              const newAchievements = performanceReviewData.achievements.filter((_, i) => i !== index);
                              setPerformanceReviewData({...performanceReviewData, achievements: newAchievements});
                            }}
                            className="btn-icon btn-icon-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setPerformanceReviewData({
                          ...performanceReviewData,
                          achievements: [...performanceReviewData.achievements, '']
                        })}
                        className="btn-secondary text-sm"
                      >
                        + Add Achievement
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Areas for Improvement</label>
                      {performanceReviewData.areasForImprovement.map((area, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={area}
                            onChange={(e) => {
                              const newAreas = [...performanceReviewData.areasForImprovement];
                              newAreas[index] = e.target.value;
                              setPerformanceReviewData({...performanceReviewData, areasForImprovement: newAreas});
                            }}
                            className="input-field flex-1"
                            placeholder="Enter improvement area..."
                          />
                          <button
                            onClick={() => {
                              const newAreas = performanceReviewData.areasForImprovement.filter((_, i) => i !== index);
                              setPerformanceReviewData({...performanceReviewData, areasForImprovement: newAreas});
                            }}
                            className="btn-icon btn-icon-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setPerformanceReviewData({
                          ...performanceReviewData,
                          areasForImprovement: [...performanceReviewData.areasForImprovement, '']
                        })}
                        className="btn-secondary text-sm"
                      >
                        + Add Improvement Area
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Next Review Date</label>
                      <input
                        type="date"
                        value={performanceReviewData.nextReviewDate}
                        onChange={(e) => setPerformanceReviewData({...performanceReviewData, nextReviewDate: e.target.value})}
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowPerformanceReviewModal(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!performanceReviewData.employeeId) {
                          alert('Please select an employee');
                          return;
                        }
                        alert('Performance review saved successfully!');
                        setShowPerformanceReviewModal(false);
                      }}
                      className="btn-primary flex-1"
                    >
                      Save Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job Posting Modal */}
          {showJobPostingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Create Job Posting</h2>
                    <button
                      onClick={() => setShowJobPostingModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                      <input
                        type="text"
                        value={jobPostingData.title}
                        onChange={(e) => setJobPostingData({...jobPostingData, title: e.target.value})}
                        className="input-field w-full"
                        placeholder="e.g., Senior English Teacher"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                          value={jobPostingData.department}
                          onChange={(e) => setJobPostingData({...jobPostingData, department: e.target.value})}
                          className="select-field w-full"
                        >
                          <option value="Academics">Academics</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Technology">Technology</option>
                          <option value="Administration">Administration</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                        <select
                          value={jobPostingData.type}
                          onChange={(e) => setJobPostingData({...jobPostingData, type: e.target.value as any})}
                          className="select-field w-full"
                        >
                          <option value="full_time">Full Time</option>
                          <option value="part_time">Part Time</option>
                          <option value="contract">Contract</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                      <textarea
                        value={jobPostingData.description}
                        onChange={(e) => setJobPostingData({...jobPostingData, description: e.target.value})}
                        className="input-field w-full"
                        rows={4}
                        placeholder="Detailed job description..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                      {jobPostingData.requirements.map((req, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={req}
                            onChange={(e) => {
                              const newReqs = [...jobPostingData.requirements];
                              newReqs[index] = e.target.value;
                              setJobPostingData({...jobPostingData, requirements: newReqs});
                            }}
                            className="input-field flex-1"
                            placeholder="Enter requirement..."
                          />
                          <button
                            onClick={() => {
                              const newReqs = jobPostingData.requirements.filter((_, i) => i !== index);
                              setJobPostingData({...jobPostingData, requirements: newReqs});
                            }}
                            className="btn-icon btn-icon-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setJobPostingData({
                          ...jobPostingData,
                          requirements: [...jobPostingData.requirements, '']
                        })}
                        className="btn-secondary text-sm"
                      >
                        + Add Requirement
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                        <input
                          type="text"
                          value={jobPostingData.salary}
                          onChange={(e) => setJobPostingData({...jobPostingData, salary: e.target.value})}
                          className="input-field w-full"
                          placeholder="e.g., £25,000 - £35,000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={jobPostingData.location}
                          onChange={(e) => setJobPostingData({...jobPostingData, location: e.target.value})}
                          className="input-field w-full"
                          placeholder="e.g., London"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowJobPostingModal(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!jobPostingData.title || !jobPostingData.description) {
                          alert('Please fill in all required fields');
                          return;
                        }
                        alert('Job posting created successfully!');
                        setShowJobPostingModal(false);
                      }}
                      className="btn-primary flex-1"
                    >
                      Create Posting
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Alert Modal */}
          {showDocumentAlertModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Document Expiry Alerts</h2>
                    <button
                      onClick={() => setShowDocumentAlertModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Expiring Soon */}
                    <div>
                      <h3 className="text-lg font-semibold text-orange-600 mb-4">⚠️ Expiring Soon (Next 30 Days)</h3>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        {employees.flatMap(emp => 
                          emp.documents.filter(doc => doc.status === 'expiring_soon')
                        ).length > 0 ? (
                          <div className="space-y-3">
                            {employees.flatMap(emp => 
                              emp.documents.filter(doc => doc.status === 'expiring_soon').map(doc => ({
                                ...doc,
                                employeeName: emp.name
                              }))
                            ).map((doc, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-white rounded border">
                                <div>
                                  <p className="font-medium">{doc.employeeName}</p>
                                  <p className="text-sm text-gray-600">{doc.name} - {doc.type.replace('_', ' ')}</p>
                                  <p className="text-sm text-orange-600">Expires: {new Date(doc.expiryDate).toLocaleDateString()}</p>
                                </div>
                                <button className="btn-primary text-sm">Renew</button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">No documents expiring soon</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Expired */}
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-4">🚨 Expired Documents</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        {employees.flatMap(emp => 
                          emp.documents.filter(doc => doc.status === 'expired')
                        ).length > 0 ? (
                          <div className="space-y-3">
                            {employees.flatMap(emp => 
                              emp.documents.filter(doc => doc.status === 'expired').map(doc => ({
                                ...doc,
                                employeeName: emp.name
                              }))
                            ).map((doc, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-white rounded border">
                                <div>
                                  <p className="font-medium">{doc.employeeName}</p>
                                  <p className="text-sm text-gray-600">{doc.name} - {doc.type.replace('_', ' ')}</p>
                                  <p className="text-sm text-red-600">Expired: {new Date(doc.expiryDate).toLocaleDateString()}</p>
                                </div>
                                <button className="btn-primary text-sm">Urgent Renewal</button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">No expired documents</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Training Reminders */}
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-4">📚 Training Reminders</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        {employees.flatMap(emp => 
                          emp.training.filter(training => training.status === 'pending')
                        ).length > 0 ? (
                          <div className="space-y-3">
                            {employees.flatMap(emp => 
                              emp.training.filter(training => training.status === 'pending').map(training => ({
                                ...training,
                                employeeName: emp.name
                              }))
                            ).map((training, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-white rounded border">
                                <div>
                                  <p className="font-medium">{training.employeeName}</p>
                                  <p className="text-sm text-gray-600">{training.name} - {training.type.replace('_', ' ')}</p>
                                  <p className="text-sm text-blue-600">Due: {new Date(training.date).toLocaleDateString()}</p>
                                </div>
                                <button className="btn-primary text-sm">Schedule</button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">No pending training</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setShowDocumentAlertModal(false)}
                      className="btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employee Portal Modal */}
          {showEmployeePortalModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Employee Self-Service Portal</h2>
                    <button
                      onClick={() => setShowEmployeePortalModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Employee Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
                      <select
                        onChange={(e) => {
                          const emp = employees.find(e => e.id === parseInt(e.target.value));
                          setSelectedPortalEmployee(emp || null);
                        }}
                        className="select-field w-full"
                      >
                        <option value="">Choose an employee to view their portal</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                        ))}
                      </select>
                    </div>
                    
                    {selectedPortalEmployee && (
                      <div className="space-y-6">
                        {/* Personal Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Name</p>
                              <p className="font-medium">{selectedPortalEmployee.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Position</p>
                              <p className="font-medium">{selectedPortalEmployee.position}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Department</p>
                              <p className="font-medium">{selectedPortalEmployee.department}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Leave Balance</p>
                              <p className="font-medium">{selectedPortalEmployee.leaveBalance} days</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Payslip Section */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-4">Payslip & Payroll</h3>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Salary</p>
                              <p className="font-medium">£{selectedPortalEmployee.salary.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Performance Rating</p>
                              <p className="font-medium">{selectedPortalEmployee.performance}%</p>
                            </div>
                          </div>
                          <button className="btn-primary text-sm">View Latest Payslip</button>
                        </div>
                        
                        {/* Schedule Section */}
                        <div className="bg-green-50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-4">Schedule & Timetable</h3>
                          {selectedPortalEmployee.schedule.length > 0 ? (
                            <div className="space-y-2">
                              {selectedPortalEmployee.schedule.map((sched, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                                  <span className="font-medium">{sched.day}</span>
                                  <span className="text-sm text-gray-600">{sched.startTime} - {sched.endTime}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600">No schedule assigned</p>
                          )}
                          <button className="btn-primary text-sm mt-3">View Full Timetable</button>
                        </div>
                        
                        {/* Documents Section */}
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-4">Documents & Training</h3>
                          <div className="space-y-2">
                            {selectedPortalEmployee.documents.map((doc, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                                <span className="font-medium">{doc.name}</span>
                                <span className={`text-sm px-2 py-1 rounded ${
                                  doc.status === 'valid' ? 'bg-green-100 text-green-800' :
                                  doc.status === 'expired' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {doc.status.replace('_', ' ')}
                                </span>
                              </div>
                            ))}
                          </div>
                          <button className="btn-primary text-sm mt-3">Upload New Document</button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setShowEmployeePortalModal(false)}
                      className="btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HR Analytics Modal */}
          {showReportingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">HR Analytics & Reports</h2>
                    <button
                      onClick={() => setShowReportingModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Staff Overview */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Staff Overview</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Employees:</span>
                          <span className="font-bold">{employees.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Employees:</span>
                          <span className="font-bold text-green-600">{employees.filter(e => e.status === 'active').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>On Leave:</span>
                          <span className="font-bold text-yellow-600">{employees.filter(e => e.status === 'on_leave').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Performance:</span>
                          <span className="font-bold text-blue-600">
                            {employees.length > 0 ? Math.round(employees.reduce((acc, e) => acc + e.performance, 0) / employees.length) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Compliance Status */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Valid DBS Checks:</span>
                          <span className="font-bold text-green-600">
                            {employees.flatMap(e => e.documents.filter(d => d.type === 'dbs_check' && d.status === 'valid')).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expiring Documents:</span>
                          <span className="font-bold text-orange-600">
                            {employees.flatMap(e => e.documents.filter(d => d.status === 'expiring_soon')).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completed Training:</span>
                          <span className="font-bold text-green-600">
                            {employees.flatMap(e => e.training.filter(t => t.status === 'completed')).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending Training:</span>
                          <span className="font-bold text-red-600">
                            {employees.flatMap(e => e.training.filter(t => t.status === 'pending')).length}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Leave Management */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Leave Management</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Pending Requests:</span>
                          <span className="font-bold text-orange-600">{leaveRequests.filter(r => r.status === 'pending').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Approved Requests:</span>
                          <span className="font-bold text-green-600">{leaveRequests.filter(r => r.status === 'approved').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Leave Days:</span>
                          <span className="font-bold">{leaveRequests.reduce((acc, r) => acc + r.days, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Leave Balance:</span>
                          <span className="font-bold">
                            {employees.length > 0 ? Math.round(employees.reduce((acc, e) => acc + e.leaveBalance, 0) / employees.length) : 0} days
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payroll Summary */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">Payroll Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Salary Budget:</span>
                          <span className="font-bold">£{employees.reduce((acc, e) => acc + e.salary, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Salary:</span>
                          <span className="font-bold">
                            £{employees.length > 0 ? Math.round(employees.reduce((acc, e) => acc + e.salary, 0) / employees.length).toLocaleString() : 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fixed Salary Staff:</span>
                          <span className="font-bold">{employees.filter(e => e.salaryType === 'fixed').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hourly Rate Staff:</span>
                          <span className="font-bold">{employees.filter(e => e.salaryType === 'hourly').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Export Options */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Export Reports</h3>
                    <div className="flex gap-3">
                      <button className="btn-primary text-sm">Export Staff Report</button>
                      <button className="btn-primary text-sm">Export Compliance Report</button>
                      <button className="btn-primary text-sm">Export Payroll Report</button>
                      <button className="btn-primary text-sm">Export Leave Report</button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setShowReportingModal(false)}
                      className="btn-secondary"
                    >
                      Close
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
