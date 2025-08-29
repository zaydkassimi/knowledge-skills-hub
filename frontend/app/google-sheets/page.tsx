'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  Settings
} from 'lucide-react';

interface GoogleSheet {
  id: number;
  sheetName: string;
  sheetId: string;
  sheetUrl: string;
  dataType: 'students' | 'teachers' | 'assignments' | 'grades' | 'attendance' | 'financial';
  syncFrequency: 'hourly' | 'daily' | 'weekly' | 'manual';
  lastSync: string | null;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  rowCount: number;
  lastModified: string;
  syncStatus: 'success' | 'error' | 'pending' | 'never';
}

export default function GoogleSheetsPage() {
  const { user } = useAuth();
  const [sheets, setSheets] = useState<GoogleSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataTypeFilter, setDataTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSheet, setEditingSheet] = useState<GoogleSheet | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSheet, setNewSheet] = useState({
    sheetName: '',
    sheetId: '',
    sheetUrl: '',
    dataType: 'students' as 'students' | 'teachers' | 'assignments' | 'grades' | 'attendance' | 'financial',
    syncFrequency: 'daily' as 'hourly' | 'daily' | 'weekly' | 'manual'
  });

  // Load data from localStorage or use mock data for first time
  useEffect(() => {
    const savedSheets = localStorage.getItem('google_sheets');

    if (savedSheets) {
      // Load saved data
      setSheets(JSON.parse(savedSheets));
      setLoading(false);
    } else {
      // Use mock data for first time
      const mockSheets: GoogleSheet[] = [
        {
          id: 1,
          sheetName: 'Student Enrollment Form Responses',
          sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          sheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          dataType: 'students',
          syncFrequency: 'hourly',
          lastSync: '2024-01-15T10:30:00Z',
          isActive: true,
          createdBy: 'admin@knowledgehub.com',
          createdAt: '2024-01-01',
          rowCount: 47,
          lastModified: '2024-01-15T10:15:00Z',
          syncStatus: 'success'
        },
        {
          id: 2,
          sheetName: 'Teacher Records',
          sheetId: '2CxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          sheetUrl: 'https://docs.google.com/spreadsheets/d/2CxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          dataType: 'teachers',
          syncFrequency: 'weekly',
          lastSync: '2024-01-10T14:20:00Z',
          isActive: true,
          createdBy: 'hr@knowledgehub.com',
          createdAt: '2024-01-05',
          rowCount: 18,
          lastModified: '2024-01-10T13:15:00Z',
          syncStatus: 'success'
        },
        {
          id: 3,
          sheetName: 'Assignment Grades',
          sheetId: '3DxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          sheetUrl: 'https://docs.google.com/spreadsheets/d/3DxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          dataType: 'grades',
          syncFrequency: 'hourly',
          lastSync: '2024-01-15T11:00:00Z',
          isActive: true,
          createdBy: 'teacher@knowledgehub.com',
          createdAt: '2024-01-08',
          rowCount: 156,
          lastModified: '2024-01-15T10:55:00Z',
          syncStatus: 'success'
        },
        {
          id: 4,
          sheetName: 'Attendance Log',
          sheetId: '4ExiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          sheetUrl: 'https://docs.google.com/spreadsheets/d/4ExiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          dataType: 'attendance',
          syncFrequency: 'daily',
          lastSync: null,
          isActive: false,
          createdBy: 'admin@knowledgehub.com',
          createdAt: '2024-01-12',
          rowCount: 89,
          lastModified: '2024-01-14T16:30:00Z',
          syncStatus: 'never'
        },
        {
          id: 5,
          sheetName: 'Financial Records',
          sheetId: '5FxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          sheetUrl: 'https://docs.google.com/spreadsheets/d/5FxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          dataType: 'financial',
          syncFrequency: 'weekly',
          lastSync: '2024-01-13T08:15:00Z',
          isActive: true,
          createdBy: 'admin@knowledgehub.com',
          createdAt: '2024-01-03',
          rowCount: 67,
          lastModified: '2024-01-13T07:45:00Z',
          syncStatus: 'error'
        }
      ];

      setTimeout(() => {
        setSheets(mockSheets);
        // Save to localStorage
        localStorage.setItem('google_sheets', JSON.stringify(mockSheets));
        setLoading(false);
      }, 1000);
    }
  }, []);

  const filteredSheets = sheets.filter(sheet => {
    const matchesSearch = sheet.sheetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.dataType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDataType = dataTypeFilter === 'all' || sheet.dataType === dataTypeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && sheet.isActive) ||
                         (statusFilter === 'inactive' && !sheet.isActive);
    return matchesSearch && matchesDataType && matchesStatus;
  });

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case 'students': return 'bg-blue-100 text-blue-800';
      case 'teachers': return 'bg-green-100 text-green-800';
      case 'assignments': return 'bg-purple-100 text-purple-800';
      case 'grades': return 'bg-orange-100 text-orange-800';
      case 'attendance': return 'bg-yellow-100 text-yellow-800';
      case 'financial': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'never': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'never': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleAddSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...sheets.map(sheet => sheet.id)) + 1;
    const sheet: GoogleSheet = {
      id: newId,
      ...newSheet,
      lastSync: null,
      isActive: true,
      createdBy: user?.email || 'admin@knowledgehub.com',
      createdAt: new Date().toISOString().split('T')[0],
      rowCount: 0,
      lastModified: new Date().toISOString(),
      syncStatus: 'never'
    };
    const updatedSheets = [sheet, ...sheets];
    setSheets(updatedSheets);
    
    // Save to localStorage
    localStorage.setItem('google_sheets', JSON.stringify(updatedSheets));
    
    setShowAddModal(false);
    setNewSheet({
      sheetName: '',
      sheetId: '',
      sheetUrl: '',
      dataType: 'students',
      syncFrequency: 'daily'
    });
  };

  const toggleSheetStatus = (id: number) => {
    const updatedSheets = sheets.map(sheet => 
      sheet.id === id ? { ...sheet, isActive: !sheet.isActive } : sheet
    );
    setSheets(updatedSheets);
    
    // Save to localStorage
    localStorage.setItem('google_sheets', JSON.stringify(updatedSheets));
  };

  const handleEditSheet = (sheet: GoogleSheet) => {
    setEditingSheet(sheet);
    setNewSheet({
      sheetName: sheet.sheetName,
      sheetId: sheet.sheetId,
      sheetUrl: sheet.sheetUrl,
      dataType: sheet.dataType,
      syncFrequency: sheet.syncFrequency
    });
    setShowEditModal(true);
  };

  const handleUpdateSheet = async () => {
    if (!editingSheet || !newSheet.sheetName || !newSheet.sheetId || !newSheet.sheetUrl) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedSheet: GoogleSheet = {
      ...editingSheet,
      sheetName: newSheet.sheetName,
      sheetId: newSheet.sheetId,
      sheetUrl: newSheet.sheetUrl,
      dataType: newSheet.dataType,
      syncFrequency: newSheet.syncFrequency
    };

    const updatedSheets = sheets.map(sheet => sheet.id === editingSheet.id ? updatedSheet : sheet);
    setSheets(updatedSheets);
    
    // Save to localStorage
    localStorage.setItem('google_sheets', JSON.stringify(updatedSheets));
    
    // Reset form
    setNewSheet({
      sheetName: '',
      sheetId: '',
      sheetUrl: '',
      dataType: 'students',
      syncFrequency: 'daily'
    });
    
    setShowEditModal(false);
    setEditingSheet(null);
  };

  const handleDeleteSheet = async (sheetId: number) => {
    if (!confirm('Are you sure you want to delete this sheet?')) {
      return;
    }

    const updatedSheets = sheets.filter(sheet => sheet.id !== sheetId);
    setSheets(updatedSheets);
    
    // Save to localStorage
    localStorage.setItem('google_sheets', JSON.stringify(updatedSheets));
  };

  const syncSheet = (id: number) => {
    const updatedSheets = sheets.map(sheet => 
      sheet.id === id ? { 
        ...sheet, 
        lastSync: new Date().toISOString(),
        syncStatus: 'success' as const
      } : sheet
    );
    setSheets(updatedSheets);
    
    // Save to localStorage
    localStorage.setItem('google_sheets', JSON.stringify(updatedSheets));
  };

  if (user?.role !== 'admin') {
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
          <h1 className="text-3xl font-bold text-gray-900">Google Sheets Integration</h1>
          <p className="text-gray-600 mt-1">Manage data synchronization with Google Sheets</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Sheet
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sheets</p>
              <p className="text-2xl font-bold text-gray-900">{sheets.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sheets</p>
              <p className="text-2xl font-bold text-gray-900">
                {sheets.filter(s => s.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last 24h Syncs</p>
              <p className="text-2xl font-bold text-gray-900">
                {sheets.filter(s => s.lastSync && new Date(s.lastSync) > new Date(Date.now() - 24*60*60*1000)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sync Errors</p>
              <p className="text-2xl font-bold text-gray-900">
                {sheets.filter(s => s.syncStatus === 'error').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google Forms Integration Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Google Forms Integration</h2>
            <p className="text-gray-600">Automatically import student enrollment applications from Google Forms</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              Connected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Status */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Student Enrollment Form</h3>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>New responses today:</span>
                <span className="font-medium text-gray-900">12</span>
              </div>
              <div className="flex justify-between">
                <span>Total responses:</span>
                <span className="font-medium text-gray-900">47</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-sync:</span>
                <span className="font-medium text-green-600">Every hour</span>
              </div>
            </div>
            <button className="w-full mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Form →
            </button>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Applications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Emma Thompson</p>
                  <p className="text-xs text-gray-500">Mathematics, Year 10</p>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">James Wilson</p>
                  <p className="text-xs text-gray-500">Science, Year 11</p>
                </div>
                <span className="text-xs text-gray-500">15 min ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Sarah Davis</p>
                  <p className="text-xs text-gray-500">English, Year 9</p>
                </div>
                <span className="text-xs text-gray-500">1 hr ago</span>
              </div>
            </div>
            <button className="w-full mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Applications →
            </button>
          </div>

          {/* Sync Settings */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Sync Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto-import enabled</span>
                <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-5"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email notifications</span>
                <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-5"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Add to waiting list</span>
                <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-blue-600 transition-colors">
                  <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-5"></span>
                </button>
              </div>
            </div>
            <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
              Configure
            </button>
          </div>
        </div>

        {/* Integration Steps */}
        <div className="mt-6 pt-6 border-t border-blue-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">How Google Forms Integration Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Student Submits</p>
              <p className="text-xs text-gray-600">Student fills out Google Form with enrollment details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Auto-Sync</p>
              <p className="text-xs text-gray-600">Form responses automatically sync to Google Sheets</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Import to System</p>
              <p className="text-xs text-gray-600">Our system imports new applications hourly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">Ready for Review</p>
              <p className="text-xs text-gray-600">Applications appear in waiting list for admin review</p>
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
            placeholder="Search sheets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={dataTypeFilter}
            onChange={(e) => setDataTypeFilter(e.target.value)}
            className="select-field"
          >
            <option value="all">All Data Types</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="assignments">Assignments</option>
            <option value="grades">Grades</option>
            <option value="attendance">Attendance</option>
            <option value="financial">Financial</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-field"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Sheets Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Sheet Name</th>
                <th className="table-header">Data Type</th>
                <th className="table-header">Sync Frequency</th>
                <th className="table-header">Last Sync</th>
                <th className="table-header">Status</th>
                <th className="table-header">Rows</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSheets.map((sheet) => (
                <tr key={sheet.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-gray-900">{sheet.sheetName}</div>
                      <div className="text-sm text-gray-500">
                        <a href={sheet.sheetUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                          View Sheet
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDataTypeColor(sheet.dataType)}`}>
                      {sheet.dataType}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900 capitalize">{sheet.syncFrequency}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      {sheet.lastSync ? (
                        <>
                          {getSyncStatusIcon(sheet.syncStatus)}
                          <span className="ml-2 text-sm text-gray-600">
                            {new Date(sheet.lastSync).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Never</span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSyncStatusColor(sheet.syncStatus)}`}>
                        {sheet.syncStatus}
                      </span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sheet.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {sheet.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900">{sheet.rowCount.toLocaleString()}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => syncSheet(sheet.id)}
                        className="btn-icon btn-icon-primary"
                        title="Sync Now"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleSheetStatus(sheet.id)}
                        className={`btn-icon ${sheet.isActive ? 'btn-icon-warning' : 'btn-icon-success'}`}
                        title={sheet.isActive ? 'Pause Sync' : 'Resume Sync'}
                      >
                        {sheet.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                                             <button 
                         onClick={() => handleEditSheet(sheet)}
                         className="btn-icon btn-icon-secondary"
                         title="Edit Sheet"
                       >
                         <Settings className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDeleteSheet(sheet.id)}
                         className="btn-icon btn-icon-danger"
                         title="Delete Sheet"
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

      {/* Add Sheet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Google Sheet</h3>
            <form onSubmit={handleAddSheet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sheet Name</label>
                <input
                  type="text"
                  required
                  value={newSheet.sheetName}
                  onChange={(e) => setNewSheet({...newSheet, sheetName: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sheet ID</label>
                <input
                  type="text"
                  required
                  value={newSheet.sheetId}
                  onChange={(e) => setNewSheet({...newSheet, sheetId: e.target.value})}
                  className="input-field"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sheet URL</label>
                <input
                  type="url"
                  required
                  value={newSheet.sheetUrl}
                  onChange={(e) => setNewSheet({...newSheet, sheetUrl: e.target.value})}
                  className="input-field"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                <select
                  required
                  value={newSheet.dataType}
                  onChange={(e) => setNewSheet({...newSheet, dataType: e.target.value as any})}
                  className="select-field"
                >
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                  <option value="assignments">Assignments</option>
                  <option value="grades">Grades</option>
                  <option value="attendance">Attendance</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sync Frequency</label>
                <select
                  required
                  value={newSheet.syncFrequency}
                  onChange={(e) => setNewSheet({...newSheet, syncFrequency: e.target.value as any})}
                  className="select-field"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="manual">Manual Only</option>
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
                  Add Sheet
                </button>
              </div>
            </form>
                     </div>
         </div>
       )}

       {/* Edit Sheet Modal */}
       {showEditModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Google Sheet</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Sheet Name</label>
                 <input
                   type="text"
                   required
                   value={newSheet.sheetName}
                   onChange={(e) => setNewSheet({...newSheet, sheetName: e.target.value})}
                   className="input-field"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Sheet ID</label>
                 <input
                   type="text"
                   required
                   value={newSheet.sheetId}
                   onChange={(e) => setNewSheet({...newSheet, sheetId: e.target.value})}
                   className="input-field"
                   placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Sheet URL</label>
                 <input
                   type="url"
                   required
                   value={newSheet.sheetUrl}
                   onChange={(e) => setNewSheet({...newSheet, sheetUrl: e.target.value})}
                   className="input-field"
                   placeholder="https://docs.google.com/spreadsheets/d/..."
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
                 <select
                   required
                   value={newSheet.dataType}
                   onChange={(e) => setNewSheet({...newSheet, dataType: e.target.value as any})}
                   className="select-field"
                 >
                   <option value="students">Students</option>
                   <option value="teachers">Teachers</option>
                   <option value="assignments">Assignments</option>
                   <option value="grades">Grades</option>
                   <option value="attendance">Attendance</option>
                   <option value="financial">Financial</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Sync Frequency</label>
                 <select
                   required
                   value={newSheet.syncFrequency}
                   onChange={(e) => setNewSheet({...newSheet, syncFrequency: e.target.value as any})}
                   className="select-field"
                 >
                   <option value="hourly">Hourly</option>
                   <option value="daily">Daily</option>
                   <option value="weekly">Weekly</option>
                   <option value="manual">Manual Only</option>
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
                   onClick={handleUpdateSheet}
                   className="btn-primary flex-1"
                 >
                   Update Sheet
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
