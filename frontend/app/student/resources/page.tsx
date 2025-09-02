'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  BookOpen, 
  Video, 
  Image, 
  File, 
  Folder,
  Star,
  Clock,
  User,
  Calendar,
  ExternalLink,
  Play,
  Bookmark,
  Tag,
  Grid,
  List,
  ArrowUpDown
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'pdf' | 'document' | 'image' | 'video' | 'link' | 'slides';
  subject: string;
  teacher: string;
  uploadDate: string;
  fileSize?: string;
  url?: string;
  fileName?: string;
  category: 'lesson_notes' | 'past_papers' | 'worksheets' | 'videos' | 'reference' | 'extra_reading';
  tags: string[];
  isBookmarked: boolean;
  downloadCount: number;
  lastAccessed?: string;
}

interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  count: number;
}

export default function StudentResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type' | 'downloads'>('date');
  const [loading, setLoading] = useState(true);

  // Check if user is student
  if (user?.role !== 'student') {
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
    loadResourcesData();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, selectedCategory, selectedSubject, searchTerm, sortBy]);

  const loadResourcesData = () => {
    try {
      // Load resources from localStorage or use mock data
      const savedResources = localStorage.getItem('student_resources');
      if (savedResources) {
        setResources(JSON.parse(savedResources));
      } else {
        // Mock resources data
        const mockResources: Resource[] = [
          {
            id: 1,
            title: 'Quadratic Equations Study Guide',
            description: 'Comprehensive guide covering all methods for solving quadratic equations including factoring, completing the square, and quadratic formula.',
            type: 'pdf',
            subject: 'Mathematics',
            teacher: 'Mr. John Smith',
            uploadDate: '2024-01-10T09:00:00',
            fileSize: '2.3 MB',
            fileName: 'quadratic-equations-guide.pdf',
            category: 'lesson_notes',
            tags: ['algebra', 'equations', 'factoring'],
            isBookmarked: true,
            downloadCount: 145,
            lastAccessed: '2024-01-14T15:30:00'
          },
          {
            id: 2,
            title: 'Shakespeare Video Lecture Series',
            description: 'Complete video series covering the major works of William Shakespeare, including Hamlet, Romeo and Juliet, and Macbeth.',
            type: 'video',
            subject: 'English Literature',
            teacher: 'Ms. Sarah Johnson',
            uploadDate: '2024-01-08T11:30:00',
            url: 'https://video-platform.com/shakespeare-series',
            category: 'videos',
            tags: ['shakespeare', 'literature', 'drama'],
            isBookmarked: false,
            downloadCount: 89,
            lastAccessed: '2024-01-12T10:15:00'
          },
          {
            id: 3,
            title: 'Chemistry Lab Safety Guidelines',
            description: 'Essential safety protocols and procedures for all chemistry laboratory experiments.',
            type: 'pdf',
            subject: 'Science',
            teacher: 'Dr. Michael Brown',
            uploadDate: '2024-01-05T14:00:00',
            fileSize: '1.8 MB',
            fileName: 'lab-safety-guidelines.pdf',
            category: 'reference',
            tags: ['safety', 'laboratory', 'procedures'],
            isBookmarked: true,
            downloadCount: 203,
            lastAccessed: '2024-01-13T09:45:00'
          },
          {
            id: 4,
            title: 'World War II Timeline Interactive',
            description: 'Interactive timeline covering major events of World War II with detailed explanations and historical context.',
            type: 'link',
            subject: 'History',
            teacher: 'Ms. Rachel White',
            uploadDate: '2024-01-03T16:20:00',
            url: 'https://history-interactive.com/wwii-timeline',
            category: 'extra_reading',
            tags: ['world war 2', 'timeline', 'interactive'],
            isBookmarked: false,
            downloadCount: 67,
            lastAccessed: '2024-01-11T14:20:00'
          },
          {
            id: 5,
            title: 'Algebra Practice Worksheets',
            description: 'Collection of practice problems for algebra topics including linear equations, inequalities, and systems.',
            type: 'pdf',
            subject: 'Mathematics',
            teacher: 'Mr. John Smith',
            uploadDate: '2024-01-01T10:00:00',
            fileSize: '3.1 MB',
            fileName: 'algebra-practice-worksheets.pdf',
            category: 'worksheets',
            tags: ['algebra', 'practice', 'equations'],
            isBookmarked: true,
            downloadCount: 178,
            lastAccessed: '2024-01-15T11:00:00'
          },
          {
            id: 6,
            title: 'Cell Biology Presentation Slides',
            description: 'Detailed presentation slides covering cell structure, organelles, and cellular processes.',
            type: 'slides',
            subject: 'Science',
            teacher: 'Dr. Michael Brown',
            uploadDate: '2023-12-28T13:15:00',
            fileSize: '4.7 MB',
            fileName: 'cell-biology-slides.pptx',
            category: 'lesson_notes',
            tags: ['biology', 'cells', 'organelles'],
            isBookmarked: false,
            downloadCount: 134,
            lastAccessed: '2024-01-09T16:30:00'
          },
          {
            id: 7,
            title: 'English Literature Past Papers',
            description: 'Collection of past examination papers with marking schemes for English Literature.',
            type: 'pdf',
            subject: 'English Literature',
            teacher: 'Ms. Sarah Johnson',
            uploadDate: '2023-12-20T15:45:00',
            fileSize: '5.2 MB',
            fileName: 'english-lit-past-papers.pdf',
            category: 'past_papers',
            tags: ['exam', 'past papers', 'literature'],
            isBookmarked: true,
            downloadCount: 256,
            lastAccessed: '2024-01-08T13:20:00'
          },
          {
            id: 8,
            title: 'French Pronunciation Guide Video',
            description: 'Video guide for proper French pronunciation with native speaker examples.',
            type: 'video',
            subject: 'French',
            teacher: 'Mme. Claire Dubois',
            uploadDate: '2023-12-15T09:30:00',
            url: 'https://language-learning.com/french-pronunciation',
            category: 'videos',
            tags: ['french', 'pronunciation', 'speaking'],
            isBookmarked: false,
            downloadCount: 92,
            lastAccessed: '2024-01-07T12:10:00'
          }
        ];
        setResources(mockResources);
        localStorage.setItem('student_resources', JSON.stringify(mockResources));
      }

      // Set up categories
      const resourceCategories: ResourceCategory[] = [
        { id: 'lesson_notes', name: 'Lesson Notes & Slides', description: 'Class notes and presentation materials', icon: BookOpen, count: 0 },
        { id: 'past_papers', name: 'Past Papers', description: 'Previous examination papers', icon: FileText, count: 0 },
        { id: 'worksheets', name: 'Worksheets', description: 'Practice exercises and problems', icon: File, count: 0 },
        { id: 'videos', name: 'Video Resources', description: 'Educational videos and tutorials', icon: Video, count: 0 },
        { id: 'reference', name: 'Reference Materials', description: 'Guides, manuals, and reference documents', icon: Bookmark, count: 0 },
        { id: 'extra_reading', name: 'Extra Reading', description: 'Additional learning materials', icon: Star, count: 0 }
      ];
      setCategories(resourceCategories);

    } catch (error) {
      console.error('Error loading resources data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        resource.subject.toLowerCase().includes(searchLower) ||
        resource.teacher.toLowerCase().includes(searchLower)
      );
    }

    // Sort resources
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        case 'date':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

    setFilteredResources(filtered);

    // Update category counts
    const updatedCategories = categories.map(category => ({
      ...category,
      count: resources.filter(resource => resource.category === category.id).length
    }));
    setCategories(updatedCategories);
  };

  const toggleBookmark = (resourceId: number) => {
    const updatedResources = resources.map(resource =>
      resource.id === resourceId ? { ...resource, isBookmarked: !resource.isBookmarked } : resource
    );
    setResources(updatedResources);
    localStorage.setItem('student_resources', JSON.stringify(updatedResources));
    toast.success('Bookmark updated');
  };

  const downloadResource = (resource: Resource) => {
    // Update download count and last accessed
    const updatedResources = resources.map(r =>
      r.id === resource.id 
        ? { ...r, downloadCount: r.downloadCount + 1, lastAccessed: new Date().toISOString() }
        : r
    );
    setResources(updatedResources);
    localStorage.setItem('student_resources', JSON.stringify(updatedResources));
    
    if (resource.url) {
      // Create a mock download for different resource types
      if (resource.type === 'pdf' || resource.type === 'document' || resource.type === 'slides') {
        // Simulate file download
        const blob = new Blob([`Resource: ${resource.title}\nSubject: ${resource.subject}\nTeacher: ${resource.teacher}\nUpload Date: ${resource.uploadDate}\nDescription: ${resource.description}`], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.title}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Downloading ${resource.title}`);
      } else if (resource.type === 'video') {
        // For videos, open in new tab
        window.open(resource.url, '_blank');
        toast.success(`Opening video: ${resource.title}`);
      } else if (resource.type === 'link') {
        // For links, open in new tab
        window.open(resource.url, '_blank');
        toast.success(`Opening link: ${resource.title}`);
      } else {
        // Default behavior
        window.open(resource.url, '_blank');
        toast.success(`Downloading ${resource.title}`);
      }
    } else {
      toast.error('Download link not available');
    }
  };

  const viewResource = (resource: Resource) => {
    // Update last accessed
    const updatedResources = resources.map(r =>
      r.id === resource.id ? { ...r, lastAccessed: new Date().toISOString() } : r
    );
    setResources(updatedResources);
    localStorage.setItem('student_resources', JSON.stringify(updatedResources));
    
    if (resource.url) {
      // Handle different resource types for viewing
      if (resource.type === 'pdf' || resource.type === 'document' || resource.type === 'slides') {
        // For documents, open in new tab
        window.open(resource.url, '_blank');
        toast.success(`Opening ${resource.title}`);
      } else if (resource.type === 'video') {
        // For videos, open in new tab
        window.open(resource.url, '_blank');
        toast.success(`Playing video: ${resource.title}`);
      } else if (resource.type === 'image') {
        // For images, open in new tab
        window.open(resource.url, '_blank');
        toast.success(`Viewing image: ${resource.title}`);
      } else if (resource.type === 'link') {
        // For links, open in new tab
        window.open(resource.url, '_blank');
        toast.success(`Opening link: ${resource.title}`);
      } else {
        // Default behavior
        window.open(resource.url, '_blank');
        toast.success(`Opening ${resource.title}`);
      }
    } else {
      toast.error('View link not available');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-600" />;
      case 'document': return <File className="w-5 h-5 text-blue-600" />;
      case 'image': return <Image className="w-5 h-5 text-green-600" />;
      case 'video': return <Video className="w-5 h-5 text-purple-600" />;
      case 'link': return <ExternalLink className="w-5 h-5 text-orange-600" />;
      case 'slides': return <BookOpen className="w-5 h-5 text-indigo-600" />;
      default: return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'link': return 'bg-orange-100 text-orange-800';
      case 'slides': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const subjects = Array.from(new Set(resources.map(r => r.subject)));

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
            <h1 className="text-2xl font-bold text-gray-900">Learning & Resources</h1>
            <p className="text-gray-600">Access lesson notes, past papers, worksheets, and educational videos</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
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
                <Bookmark className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bookmarked</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {resources.filter(r => r.isBookmarked).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Video Resources</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {resources.filter(r => r.type === 'video').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recently Added</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {resources.filter(r => {
                    const uploadDate = new Date(r.uploadDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return uploadDate > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories and Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Categories</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-blue-100 text-blue-900 border-blue-200'
                          : 'hover:bg-gray-50'
                      } border`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">All Resources</span>
                        <span className="text-sm text-gray-500">{resources.length}</span>
                      </div>
                    </button>
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-100 text-blue-900 border-blue-200'
                              : 'hover:bg-gray-50'
                          } border`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">{category.count}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Subjects</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="date">Upload Date</option>
                      <option value="name">Name</option>
                      <option value="type">Type</option>
                      <option value="downloads">Most Downloaded</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search resources, notes, worksheets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCategory === 'all' 
                      ? 'All Resources' 
                      : categories.find(c => c.id === selectedCategory)?.name
                    }
                  </h3>
                  <span className="text-sm text-gray-500">
                    {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {filteredResources.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No resources found</p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                      <div key={resource.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              {getTypeIcon(resource.type)}
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                                {resource.type}
                              </span>
                            </div>
                            <button
                              onClick={() => toggleBookmark(resource.id)}
                              className={`p-1 rounded-full ${
                                resource.isBookmarked 
                                  ? 'text-yellow-500 hover:text-yellow-600' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{resource.description}</p>
                          
                          <div className="space-y-2 text-xs text-gray-500 mb-4">
                            <div className="flex items-center">
                              <BookOpen className="w-3 h-3 mr-1" />
                              <span>{resource.subject}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              <span>{resource.teacher}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{new Date(resource.uploadDate).toLocaleDateString()}</span>
                            </div>
                            {resource.fileSize && (
                              <div className="flex items-center">
                                <File className="w-3 h-3 mr-1" />
                                <span>{resource.fileSize}</span>
                              </div>
                            )}
                          </div>

                          {resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {resource.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                              {resource.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{resource.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <button
                              onClick={() => viewResource(resource)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => downloadResource(resource)}
                              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded text-sm font-medium flex items-center justify-center"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredResources.map((resource) => (
                      <div key={resource.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center mr-4">
                          {getTypeIcon(resource.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">{resource.title}</h4>
                            <div className="flex items-center space-x-2 ml-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                                {resource.type}
                              </span>
                              <button
                                onClick={() => toggleBookmark(resource.id)}
                                className={`p-1 ${resource.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
                              >
                                <Star className={`w-4 h-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>{resource.subject}</span>
                            <span>{resource.teacher}</span>
                            <span>{new Date(resource.uploadDate).toLocaleDateString()}</span>
                            {resource.fileSize && <span>{resource.fileSize}</span>}
                            <span>{resource.downloadCount} downloads</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => viewResource(resource)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => downloadResource(resource)}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded text-sm font-medium flex items-center"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
