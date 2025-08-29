'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Upload, 
  Download, 
  FileText, 
  File, 
  Image, 
  Video, 
  Folder, 
  Plus, 
  Search, 
  Filter, 
  X, 
  Eye, 
  Trash2,
  Calendar,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Resource {
  id: number;
  name: string;
  type: 'pdf' | 'document' | 'image' | 'video' | 'other';
  size: string;
  uploadDate: string;
  uploadedBy: number;
  subject: string;
  description: string;
  downloads: number;
  url?: string;
}

export default function TeacherResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'pdf' as const,
    subject: '',
    description: '',
    file: null as File | null
  });

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
    // Load resources from localStorage
    const loadResources = () => {
      try {
        const savedResources = localStorage.getItem('teacher_resources');
        if (savedResources) {
          const allResources = JSON.parse(savedResources);
          // Filter to show only current teacher's resources
          const teacherResources = allResources.filter((r: Resource) => r.uploadedBy === (user?.teacher_id || 1));
          setResources(teacherResources);
          setFilteredResources(teacherResources);
        } else {
          // Mock resources for current teacher
          const mockResources: Resource[] = [
            {
              id: 1,
              name: 'Algebra Basics Worksheet.pdf',
              type: 'pdf',
              size: '2.4 MB',
              uploadDate: '2024-01-10',
              uploadedBy: user?.teacher_id || 1,
              subject: user?.subject || 'Mathematics',
              description: 'Basic algebra problems for grade 9 students',
              downloads: 45,
              url: '/resources/algebra-basics.pdf'
            },
            {
              id: 2,
              name: 'Geometry Formulas Reference.pdf',
              type: 'pdf',
              size: '1.8 MB',
              uploadDate: '2024-01-08',
              uploadedBy: user?.teacher_id || 1,
              subject: user?.subject || 'Mathematics',
              description: 'Comprehensive geometry formulas reference sheet',
              downloads: 32,
              url: '/resources/geometry-formulas.pdf'
            },
            {
              id: 3,
              name: 'Calculus Video Lesson 1.mp4',
              type: 'video',
              size: '156 MB',
              uploadDate: '2024-01-05',
              uploadedBy: user?.teacher_id || 1,
              subject: user?.subject || 'Mathematics',
              description: 'Introduction to differential calculus',
              downloads: 28,
              url: '/resources/calculus-lesson-1.mp4'
            }
          ];
          setResources(mockResources);
          setFilteredResources(mockResources);
          localStorage.setItem('teacher_resources', JSON.stringify(mockResources));
        }
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [user]);

  useEffect(() => {
    // Filter resources based on search and type
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(resource => resource.type === typeFilter);
    }

    setFilteredResources(filtered);
  }, [searchTerm, typeFilter, resources]);

  const handleUploadResource = () => {
    if (!newResource.name || !newResource.subject || !newResource.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const resource: Resource = {
      id: Date.now(),
      name: newResource.name,
      type: newResource.type,
      size: newResource.file ? formatFileSize(newResource.file.size) : '0 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: user?.teacher_id || 1,
      subject: newResource.subject,
      description: newResource.description,
      downloads: 0,
      url: `/resources/${newResource.name.toLowerCase().replace(/\s+/g, '-')}`
    };

    const updatedResources = [...resources, resource];
    setResources(updatedResources);
    setFilteredResources(updatedResources);
    localStorage.setItem('teacher_resources', JSON.stringify(updatedResources));

    setNewResource({
      name: '',
      type: 'pdf',
      subject: '',
      description: '',
      file: null
    });
    setShowUploadModal(false);
    toast.success('Resource uploaded successfully!');
  };

  const handleDeleteResource = (resourceId: number) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      const updatedResources = resources.filter(r => r.id !== resourceId);
      setResources(updatedResources);
      setFilteredResources(updatedResources);
      localStorage.setItem('teacher_resources', JSON.stringify(updatedResources));
      toast.success('Resource deleted successfully!');
    }
  };

  const handleDownloadResource = (resource: Resource) => {
    // In a real app, this would trigger the actual file download
    const updatedResources = resources.map(r => 
      r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
    );
    setResources(updatedResources);
    setFilteredResources(updatedResources);
    localStorage.setItem('teacher_resources', JSON.stringify(updatedResources));
    toast.success(`Downloading ${resource.name}`);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'image':
        return <Image className="w-6 h-6 text-blue-500" />;
      case 'video':
        return <Video className="w-6 h-6 text-purple-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewResource({ ...newResource, file, name: file.name });
      
      // Auto-detect file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      let type: 'pdf' | 'document' | 'image' | 'video' | 'other' = 'other';
      
      if (extension === 'pdf') type = 'pdf';
      else if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) type = 'document';
      else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) type = 'image';
      else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) type = 'video';
      
      setNewResource(prev => ({ ...prev, type }));
    }
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
            <h1 className="text-2xl font-bold text-gray-900">My Resources</h1>
            <p className="text-gray-600">Upload and manage teaching resources and materials</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Resource
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-semibold text-gray-900">{resources.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {resources.reduce((sum, r) => sum + r.downloads, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">PDF Documents</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {resources.filter(r => r.type === 'pdf').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Video className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Video Resources</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {resources.filter(r => r.type === 'video').length}
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
                  placeholder="Search resources..."
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
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF Documents</option>
                  <option value="document">Documents</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getFileIcon(resource.type)}
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{resource.name}</h3>
                    <p className="text-xs text-gray-500">{resource.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDownloadResource(resource)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(resource.uploadDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Download className="w-3 h-3 mr-1" />
                  {resource.downloads} downloads
                </div>
              </div>
              
              <div className="mt-2">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {resource.subject}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No resources found</p>
            <p className="text-sm text-gray-500">Upload your first resource to get started</p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Upload Resource</h3>
                <button onClick={() => setShowUploadModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resource Name</label>
                  <input
                    type="text"
                    value={newResource.name}
                    onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter resource name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="document">Document</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newResource.subject}
                    onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subject"
                    defaultValue={user?.subject}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newResource.description}
                    onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Describe this resource"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadResource}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
