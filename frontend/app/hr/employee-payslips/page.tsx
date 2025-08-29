'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  DollarSign, 
  Download, 
  Calendar, 
  Eye, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  Search,
  Filter,
  Users,
  User,
  Building,
  Edit,
  Plus,
  Mail,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Employee {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
  baseSalary: number;
  status: 'active' | 'inactive';
}

interface EmployeePayslip {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeNumber: string;
  department: string;
  position: string;
  month: string;
  year: number;
  payPeriod: string;
  baseSalary: number;
  allowances: {
    transport: number;
    housing: number;
    meal: number;
    overtime: number;
    bonus: number;
  };
  deductions: {
    tax: number;
    nationalInsurance: number;
    pension: number;
    healthInsurance: number;
    other: number;
  };
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  payDate: string;
  status: 'paid' | 'pending' | 'processing' | 'cancelled';
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    sortCode: string;
  };
}

export default function EmployeePayslipsPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payslips, setPayslips] = useState<EmployeePayslip[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<EmployeePayslip | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());

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
    // Load employees and payslips
    const loadData = () => {
      try {
        // Load employees
        const savedEmployees = localStorage.getItem('employees');
        if (savedEmployees) {
          const employeeData = JSON.parse(savedEmployees);
          setEmployees(employeeData);
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
              baseSalary: 4200,
              status: 'active'
            },
            {
              id: 2,
              name: 'Sarah Johnson',
              employeeId: 'EMP002',
              department: 'Teaching',
              position: 'English Teacher',
              email: 'sarah.johnson@school.com',
              baseSalary: 4000,
              status: 'active'
            },
            {
              id: 3,
              name: 'Michael Brown',
              employeeId: 'EMP003',
              department: 'Administration',
              position: 'Admin Assistant',
              email: 'michael.brown@school.com',
              baseSalary: 3500,
              status: 'active'
            }
          ];
          setEmployees(mockEmployees);
          localStorage.setItem('employees', JSON.stringify(mockEmployees));
        }

        // Load payslips
        const savedPayslips = localStorage.getItem('employee_payslips');
        if (savedPayslips) {
          setPayslips(JSON.parse(savedPayslips));
        } else {
          // Generate mock payslips
          const mockPayslips: EmployeePayslip[] = [];
          const months = ['January', 'February', 'March', 'April', 'May', 'June'];
          
          [1, 2, 3].forEach(empId => {
            const employee = mockEmployees.find(e => e.id === empId);
            if (employee) {
              months.forEach((month, index) => {
                const baseSalary = employee.baseSalary;
                const allowances = {
                  transport: 200,
                  housing: 500,
                  meal: 150,
                  overtime: Math.floor(Math.random() * 400),
                  bonus: index === 5 ? 1000 : 0 // Bonus in June
                };
                const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + val, 0);
                const grossPay = baseSalary + totalAllowances;
                
                const deductions = {
                  tax: Math.floor(grossPay * 0.15),
                  nationalInsurance: Math.floor(grossPay * 0.08),
                  pension: Math.floor(grossPay * 0.05),
                  healthInsurance: 120,
                  other: 50
                };
                const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
                const netPay = grossPay - totalDeductions;

                mockPayslips.push({
                  id: Date.now() + empId * 100 + index,
                  employeeId: empId,
                  employeeName: employee.name,
                  employeeNumber: employee.employeeId,
                  department: employee.department,
                  position: employee.position,
                  month,
                  year: 2024,
                  payPeriod: `${month} 1-31, 2024`,
                  baseSalary,
                  allowances,
                  deductions,
                  grossPay,
                  totalDeductions,
                  netPay,
                  payDate: `2024-${String(index + 1).padStart(2, '0')}-28`,
                  status: index < 5 ? 'paid' : 'pending',
                  bankDetails: {
                    accountName: employee.name,
                    accountNumber: `****${Math.floor(Math.random() * 9999)}`,
                    bankName: 'Barclays Bank',
                    sortCode: '20-00-00'
                  }
                });
              });
            }
          });

          setPayslips(mockPayslips);
          localStorage.setItem('employee_payslips', JSON.stringify(mockPayslips));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleViewPayslip = (payslip: EmployeePayslip) => {
    setSelectedPayslip(payslip);
    setShowPayslipModal(true);
  };

  const handleDownloadPayslip = (payslip: EmployeePayslip) => {
    toast.success(`Downloading payslip for ${payslip.employeeName} - ${payslip.month} ${payslip.year}`);
  };

  const handleEmailPayslip = (payslip: EmployeePayslip) => {
    toast.success(`Payslip emailed to ${payslip.employeeName}`);
  };

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payslip.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || payslip.department === departmentFilter;
    const matchesMonth = monthFilter === 'all' || payslip.month === monthFilter;
    const matchesYear = payslip.year === yearFilter;
    
    return matchesSearch && matchesDepartment && matchesMonth && matchesYear;
  });

  const departments = Array.from(new Set(employees.map(e => e.department)));
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];

  const totalPayroll = filteredPayslips.reduce((sum, p) => sum + p.netPay, 0);
  const avgSalary = filteredPayslips.length > 0 ? totalPayroll / filteredPayslips.length : 0;

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
            <h1 className="text-2xl font-bold text-gray-900">Employee Payslips</h1>
            <p className="text-gray-600">View and manage employee payroll information</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generate Payslips
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                <p className="text-2xl font-semibold text-gray-900">£{totalPayroll.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Salary</p>
                <p className="text-2xl font-semibold text-gray-900">£{Math.round(avgSalary).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payslips</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredPayslips.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredPayslips.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Months</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payslips Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Pay
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
                {filteredPayslips.map((payslip) => (
                  <tr key={payslip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payslip.employeeName}</div>
                          <div className="text-sm text-gray-500">{payslip.employeeNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payslip.month} {payslip.year}</div>
                      <div className="text-sm text-gray-500">{payslip.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">£{payslip.grossPay.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Base: £{payslip.baseSalary.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">£{payslip.totalDeductions.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Tax: £{payslip.deductions.tax}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">£{payslip.netPay.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payslip.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : payslip.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : payslip.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payslip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPayslip(payslip)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Payslip"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadPayslip(payslip)}
                          className="text-green-600 hover:text-green-900"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEmailPayslip(payslip)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Email Payslip"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payslip Detail Modal */}
        {showPayslipModal && selectedPayslip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payslip - {selectedPayslip.employeeName}
                  </h3>
                  <button onClick={() => setShowPayslipModal(false)}>
                    <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
                
                {/* Payslip Content */}
                <div className="bg-white border border-gray-300 rounded-lg p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge and Skills Hub</h2>
                    <p className="text-gray-600">Employee Payslip</p>
                  </div>

                  {/* Employee & Pay Period Info */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Employee Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedPayslip.employeeName}</span></div>
                        <div><span className="text-gray-600">Employee ID:</span> <span className="font-medium">{selectedPayslip.employeeNumber}</span></div>
                        <div><span className="text-gray-600">Department:</span> <span className="font-medium">{selectedPayslip.department}</span></div>
                        <div><span className="text-gray-600">Position:</span> <span className="font-medium">{selectedPayslip.position}</span></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Pay Period</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">Period:</span> <span className="font-medium">{selectedPayslip.payPeriod}</span></div>
                        <div><span className="text-gray-600">Pay Date:</span> <span className="font-medium">{new Date(selectedPayslip.payDate).toLocaleDateString()}</span></div>
                        <div><span className="text-gray-600">Status:</span> 
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            selectedPayslip.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedPayslip.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Earnings</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Base Salary:</span> <span>£{selectedPayslip.baseSalary.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Transport Allowance:</span> <span>£{selectedPayslip.allowances.transport.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Housing Allowance:</span> <span>£{selectedPayslip.allowances.housing.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Meal Allowance:</span> <span>£{selectedPayslip.allowances.meal.toLocaleString()}</span></div>
                        {selectedPayslip.allowances.overtime > 0 && (
                          <div className="flex justify-between"><span>Overtime:</span> <span>£{selectedPayslip.allowances.overtime.toLocaleString()}</span></div>
                        )}
                        {selectedPayslip.allowances.bonus > 0 && (
                          <div className="flex justify-between"><span>Bonus:</span> <span>£{selectedPayslip.allowances.bonus.toLocaleString()}</span></div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Gross Pay:</span> <span>£{selectedPayslip.grossPay.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Deductions</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Income Tax:</span> <span>£{selectedPayslip.deductions.tax.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>National Insurance:</span> <span>£{selectedPayslip.deductions.nationalInsurance.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Pension Contribution:</span> <span>£{selectedPayslip.deductions.pension.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Health Insurance:</span> <span>£{selectedPayslip.deductions.healthInsurance.toLocaleString()}</span></div>
                        {selectedPayslip.deductions.other > 0 && (
                          <div className="flex justify-between"><span>Other Deductions:</span> <span>£{selectedPayslip.deductions.other.toLocaleString()}</span></div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total Deductions:</span> <span>£{selectedPayslip.totalDeductions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay */}
                  <div className="bg-green-50 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Net Pay:</span>
                      <span className="text-3xl font-bold text-green-600">£{selectedPayslip.netPay.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-600">Account Name:</span> <span className="font-medium">{selectedPayslip.bankDetails.accountName}</span></div>
                        <div><span className="text-gray-600">Account Number:</span> <span className="font-medium">{selectedPayslip.bankDetails.accountNumber}</span></div>
                        <div><span className="text-gray-600">Bank Name:</span> <span className="font-medium">{selectedPayslip.bankDetails.bankName}</span></div>
                        <div><span className="text-gray-600">Sort Code:</span> <span className="font-medium">{selectedPayslip.bankDetails.sortCode}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
                    <p>This payslip is computer generated and does not require a signature.</p>
                    <p>For any queries, please contact HR Department.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => handleDownloadPayslip(selectedPayslip)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleEmailPayslip(selectedPayslip)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Payslip
                  </button>
                  <button
                    onClick={() => toast.success('Print functionality would be available in production')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
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
