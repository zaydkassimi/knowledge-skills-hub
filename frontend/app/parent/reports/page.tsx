'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart3, 
  Download, 
  Eye, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  FileText,
  User,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Child {
  id: number;
  name: string;
  grade: string;
  overallGrade: number;
  attendance: number;
  subjects: Subject[];
}

interface Subject {
  name: string;
  currentGrade: number;
  targetGrade: number;
  assignments: number;
  completed: number;
  trend: 'up' | 'down' | 'stable';
}

interface AcademicReport {
  id: number;
  title: string;
  period: string;
  childName: string;
  overallGrade: number;
  subjects: Subject[];
  teacherComments: string;
  recommendations: string[];
  generatedDate: string;
  type: 'progress' | 'term' | 'annual';
}

export default function ParentReportsPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [reports, setReports] = useState<AcademicReport[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load parent reports data
    const loadData = () => {
      try {
        // Mock children data
        const mockChildren: Child[] = [
          {
            id: 1,
            name: 'Emily Smith',
            grade: '10th Grade',
            overallGrade: 87.9,
            attendance: 94,
            subjects: [
              {
                name: 'Mathematics',
                currentGrade: 88.5,
                targetGrade: 90,
                assignments: 8,
                completed: 6,
                trend: 'up'
              },
              {
                name: 'English Literature',
                currentGrade: 82.3,
                targetGrade: 85,
                assignments: 6,
                completed: 4,
                trend: 'stable'
              },
              {
                name: 'Science',
                currentGrade: 91.2,
                targetGrade: 88,
                assignments: 7,
                completed: 5,
                trend: 'up'
              },
              {
                name: 'History',
                currentGrade: 89.7,
                targetGrade: 87,
                assignments: 5,
                completed: 3,
                trend: 'up'
              }
            ]
          },
          {
            id: 2,
            name: 'Michael Smith',
            grade: '8th Grade',
            overallGrade: 85.2,
            attendance: 91,
            subjects: [
              {
                name: 'Mathematics',
                currentGrade: 86.0,
                targetGrade: 85,
                assignments: 6,
                completed: 5,
                trend: 'up'
              },
              {
                name: 'English',
                currentGrade: 83.5,
                targetGrade: 80,
                assignments: 5,
                completed: 4,
                trend: 'up'
              },
              {
                name: 'Science',
                currentGrade: 88.7,
                targetGrade: 85,
                assignments: 6,
                completed: 5,
                trend: 'up'
              }
            ]
          }
        ];
        setChildren(mockChildren);
        setSelectedChild(mockChildren[0]);

        // Mock academic reports
        const mockReports: AcademicReport[] = [
          {
            id: 1,
            title: 'Mid-Term Progress Report',
            period: 'Fall 2024',
            childName: 'Emily Smith',
            overallGrade: 87.9,
            subjects: mockChildren[0].subjects,
            teacherComments: 'Emily has shown excellent progress this semester! She has demonstrated strong analytical skills in Mathematics and maintained consistent performance across all subjects. Her participation in class discussions has improved significantly.',
            recommendations: [
              'Continue practicing complex word problems in Mathematics',
              'Work on strengthening thesis statements in English essays',
              'Maintain excellent work in Science and History'
            ],
            generatedDate: '2024-01-15T10:00:00Z',
            type: 'progress'
          },
          {
            id: 2,
            title: 'Quarter 1 Report',
            period: 'Fall 2024',
            childName: 'Emily Smith',
            overallGrade: 85.2,
            subjects: mockChildren[0].subjects.map(s => ({ ...s, currentGrade: s.currentGrade - 2 })),
            teacherComments: 'Good start to the academic year. Emily has demonstrated solid understanding of core concepts across all subjects.',
            recommendations: [
              'Focus on time management for assignments',
              'Seek help early when struggling with concepts',
              'Participate more actively in class discussions'
            ],
            generatedDate: '2024-10-15T10:00:00Z',
            type: 'term'
          },
          {
            id: 3,
            title: 'Mid-Term Progress Report',
            period: 'Fall 2024',
            childName: 'Michael Smith',
            overallGrade: 85.2,
            subjects: mockChildren[1].subjects,
            teacherComments: 'Michael has made steady progress this semester. He shows particular strength in Science and has improved his mathematical reasoning skills.',
            recommendations: [
              'Continue building confidence in Mathematics',
              'Practice reading comprehension exercises',
              'Maintain strong performance in Science'
            ],
            generatedDate: '2024-01-15T10:00:00Z',
            type: 'progress'
          }
        ];
        setReports(mockReports);

      } catch (error) {
        console.error('Error loading parent reports data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const downloadReport = (report: AcademicReport) => {
    const content = `
Academic Report: ${report.title}
Student: ${report.childName}
Period: ${report.period}
Overall Grade: ${report.overallGrade}%

Subject Performance:
${report.subjects.map(s => `- ${s.name}: ${s.currentGrade}% (Target: ${s.targetGrade}%)`).join('\n')}

Teacher Comments:
${report.teacherComments}

Recommendations:
${report.recommendations.map(r => `- ${r}`).join('\n')}

Generated: ${new Date(report.generatedDate).toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.childName.replace(/\s+/g, '_')}_${report.title.replace(/\s+/g, '_')}_${report.period}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100';
    if (grade >= 80) return 'bg-blue-100';
    if (grade >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesChild = !selectedChild || report.childName === selectedChild.name;
    const matchesPeriod = selectedPeriod === 'all' || report.period === selectedPeriod;
    return matchesChild && matchesPeriod;
  });

  if (!user || user.role !== 'parent') {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Academic Reports</h1>
            <p className="text-gray-600">View detailed academic reports for your children</p>
          </div>
        </div>

        {/* Children Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div 
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`bg-white p-6 rounded-lg border cursor-pointer transition-all ${
                selectedChild?.id === child.id 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{child.name}</h3>
                    <p className="text-sm text-gray-600">{child.grade}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-2xl font-bold", getGradeColor(child.overallGrade))}>
                    {child.overallGrade}%
                  </p>
                  <p className="text-sm text-gray-600">Overall Grade</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-medium text-gray-900">{child.attendance}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subjects:</span>
                  <span className="font-medium text-gray-900">{child.subjects.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedChild && (
          <>
            {/* Child Performance */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{selectedChild.name}'s Performance</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedChild.subjects.map((subject) => (
                    <div key={subject.name} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{subject.name}</h3>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Grade:</span>
                          <span className={cn("font-medium", getGradeColor(subject.currentGrade))}>
                            {subject.currentGrade}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Target Grade:</span>
                          <span className="font-medium text-gray-900">{subject.targetGrade}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={cn("h-2 rounded-full", getGradeBgColor(subject.currentGrade))}
                            style={{ width: `${(subject.currentGrade / subject.targetGrade) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {subject.completed}/{subject.assignments} assignments completed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reports */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Academic Reports</h2>
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Periods</option>
                      <option value="Fall 2024">Fall 2024</option>
                      <option value="Spring 2024">Spring 2024</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                          <p className="text-sm text-gray-600">{report.period}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Overall Grade</p>
                            <p className={cn("text-lg font-bold", getGradeColor(report.overallGrade))}>
                              {report.overallGrade}%
                            </p>
                          </div>
                          <button
                            onClick={() => downloadReport(report)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-sm">Download</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Teacher Comments</h4>
                          <p className="text-gray-600 text-sm">{report.teacherComments}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {report.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-xs text-gray-500">
                          Generated: {new Date(report.generatedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
