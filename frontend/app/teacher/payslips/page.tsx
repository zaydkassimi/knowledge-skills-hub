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
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Payslip {
  id: number;
  teacherId: number;
  month: string;
  year: number;
  baseSalary: number;
  allowances: number;
  overtime: number;
  deductions: number;
  tax: number;
  netPay: number;
  payDate: string;
  status: 'paid' | 'pending' | 'processing';
}

export default function TeacherPayslipsPage() {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());

  // Check if user is a teacher
  if (user?.role !== 'teacher') {
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
    // Load teacher's payslips from localStorage
    const loadPayslips = () => {
      try {
        const savedPayslips = localStorage.getItem('teacher_payslips');
        if (savedPayslips) {
          const allPayslips = JSON.parse(savedPayslips);
          // Filter payslips for current teacher only
          const teacherPayslips = allPayslips.filter((p: Payslip) => p.teacherId === (user?.teacher_id || 1));
          setPayslips(teacherPayslips);
        } else {
          // Generate mock payslips for current teacher
          const currentTeacherId = user?.teacher_id || 1;
          const mockPayslips: Payslip[] = [];
          
          // Generate payslips for the last 12 months
          for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            
            const baseSalary = 4200;
            const allowances = 300;
            const overtime = Math.floor(Math.random() * 500);
            const grossPay = baseSalary + allowances + overtime;
            const tax = Math.floor(grossPay * 0.15);
            const deductions = 150; // National Insurance, pension etc.
            const netPay = grossPay - tax - deductions;
            
            mockPayslips.push({
              id: Date.now() + i,
              teacherId: currentTeacherId,
              month: date.toLocaleString('en-US', { month: 'long' }),
              year: date.getFullYear(),
              baseSalary,
              allowances,
              overtime,
              deductions,
              tax,
              netPay,
              payDate: new Date(date.getFullYear(), date.getMonth(), 28).toISOString(),
              status: i === 0 ? 'pending' : 'paid'
            });
          }
          
          setPayslips(mockPayslips);
          localStorage.setItem('teacher_payslips', JSON.stringify(mockPayslips));
        }
      } catch (error) {
        console.error('Error loading payslips:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPayslips();
  }, [user]);

  const handleDownloadPayslip = (payslip: Payslip) => {
    // In a real app, this would generate and download a PDF
    toast.success(`Downloading payslip for ${payslip.month} ${payslip.year}`);
  };

  const handleViewDetails = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    setShowDetailModal(true);
  };

  const filteredPayslips = payslips.filter(p => p.year === yearFilter);
  const availableYears = Array.from(new Set(payslips.map(p => p.year))).sort((a, b) => b - a);

  const totalEarnedThisYear = filteredPayslips.reduce((sum, p) => sum + p.netPay, 0);
  const averageMonthlyPay = filteredPayslips.length > 0 ? totalEarnedThisYear / filteredPayslips.length : 0;

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
            <h1 className="text-2xl font-bold text-gray-900">My Payslips</h1>
            <p className="text-gray-600">View and download your salary information</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earned ({yearFilter})</p>
                <p className="text-2xl font-semibold text-gray-900">£{totalEarnedThisYear.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Monthly</p>
                <p className="text-2xl font-semibold text-gray-900">£{Math.round(averageMonthlyPay).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Payslips</p>
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
                  {filteredPayslips.filter(p => p.status !== 'paid').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payslips List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payslip History - {yearFilter}</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                {filteredPayslips.map((payslip) => {
                  const grossPay = payslip.baseSalary + payslip.allowances + payslip.overtime;
                  const totalDeductions = payslip.deductions + payslip.tax;
                  
                  return (
                    <tr key={payslip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payslip.month} {payslip.year}
                            </div>
                            <div className="text-sm text-gray-500">
                              Paid: {new Date(payslip.payDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">£{grossPay.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          Base: £{payslip.baseSalary.toLocaleString()}
                          {payslip.overtime > 0 && ` + OT: £${payslip.overtime}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">£{totalDeductions.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          Tax: £{payslip.tax} • Other: £{payslip.deductions}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">£{payslip.netPay.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payslip.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : payslip.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {payslip.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(payslip)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {payslip.status === 'paid' && (
                            <button
                              onClick={() => handleDownloadPayslip(payslip)}
                              className="text-green-600 hover:text-green-900"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payslip Detail Modal */}
        {showDetailModal && selectedPayslip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Payslip - {selectedPayslip.month} {selectedPayslip.year}
                </h3>
                <button onClick={() => setShowDetailModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Employee Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{user?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Employee ID:</span>
                      <span className="ml-2 font-medium">{user?.teacher_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <span className="ml-2 font-medium">{user?.subject}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Pay Date:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedPayslip.payDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Earnings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Salary</span>
                      <span>£{selectedPayslip.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allowances</span>
                      <span>£{selectedPayslip.allowances.toLocaleString()}</span>
                    </div>
                    {selectedPayslip.overtime > 0 && (
                      <div className="flex justify-between">
                        <span>Overtime</span>
                        <span>£{selectedPayslip.overtime.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Gross Pay</span>
                      <span>£{(selectedPayslip.baseSalary + selectedPayslip.allowances + selectedPayslip.overtime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Deductions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Income Tax</span>
                      <span>£{selectedPayslip.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>National Insurance & Pension</span>
                      <span>£{selectedPayslip.deductions.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total Deductions</span>
                      <span>£{(selectedPayslip.tax + selectedPayslip.deductions).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Net Pay</span>
                    <span className="text-2xl font-bold text-green-600">£{selectedPayslip.netPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                {selectedPayslip.status === 'paid' && (
                  <button
                    onClick={() => handleDownloadPayslip(selectedPayslip)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
