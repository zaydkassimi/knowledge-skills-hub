'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Eye, 
  Calendar,
  BookOpen,
  Award,
  Target,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  FileText,
  PieChart,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Grade {
  id: number;
  subject: string;
  assignment: string;
  grade: number;
  maxGrade: number;
  percentage: number;
  feedback: string;
  submittedDate: string;
  gradedDate: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project';
  weight: number;
}

interface Subject {
  name: string;
  currentGrade: number;
  targetGrade: number;
  assignments: number;
  completed: number;
  averageGrade: number;
  trend: 'up' | 'down' | 'stable';
}

interface ProgressReport {
  id: number;
  title: string;
  period: string;
  overallGrade: number;
  subjects: Subject[];
  teacherComments: string;
  recommendations: string[];
  generatedDate: string;
}

export default function StudentPerformancePage() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progressReports, setProgressReports] = useState<ProgressReport[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load performance data
    const loadData = () => {
      try {
        // Mock grades
        const mockGrades: Grade[] = [
          {
            id: 1,
            subject: 'Mathematics',
            assignment: 'Algebra Quiz #1',
            grade: 85,
            maxGrade: 100,
            percentage: 85,
            feedback: 'Excellent work on quadratic equations! Your understanding of factoring is very strong. Consider practicing more complex word problems.',
            submittedDate: '2024-01-10T14:30:00Z',
            gradedDate: '2024-01-12T09:15:00Z',
            type: 'quiz',
            weight: 15
          },
          {
            id: 2,
            subject: 'Mathematics',
            assignment: 'Calculus Assignment',
            grade: 92,
            maxGrade: 100,
            percentage: 92,
            feedback: 'Outstanding work! Your derivatives are perfect. Great attention to detail in showing your work.',
            submittedDate: '2024-01-08T16:45:00Z',
            gradedDate: '2024-01-10T11:20:00Z',
            type: 'assignment',
            weight: 20
          },
          {
            id: 3,
            subject: 'English Literature',
            assignment: 'Essay: Shakespeare Analysis',
            grade: 78,
            maxGrade: 100,
            percentage: 78,
            feedback: 'Good analysis of themes, but your thesis could be stronger. Consider incorporating more textual evidence to support your arguments.',
            submittedDate: '2024-01-05T13:20:00Z',
            gradedDate: '2024-01-07T14:30:00Z',
            type: 'essay',
            weight: 25
          },
          {
            id: 4,
            subject: 'Science',
            assignment: 'Lab Report: Chemistry',
            grade: 88,
            maxGrade: 100,
            percentage: 88,
            feedback: 'Well-structured lab report with clear methodology. Your data analysis is thorough and conclusions are well-supported.',
            submittedDate: '2024-01-03T10:15:00Z',
            gradedDate: '2024-01-05T16:45:00Z',
            type: 'project',
            weight: 20
          },
          {
            id: 5,
            subject: 'History',
            assignment: 'Research Paper',
            grade: 95,
            maxGrade: 100,
            percentage: 95,
            feedback: 'Exceptional research paper! Your argument is compelling and well-researched. Excellent use of primary sources.',
            submittedDate: '2024-01-01T15:30:00Z',
            gradedDate: '2024-01-03T12:10:00Z',
            type: 'project',
            weight: 30
          }
        ];
        setGrades(mockGrades);

        // Mock subjects
        const mockSubjects: Subject[] = [
          {
            name: 'Mathematics',
            currentGrade: 88.5,
            targetGrade: 90,
            assignments: 8,
            completed: 6,
            averageGrade: 88.5,
            trend: 'up'
          },
          {
            name: 'English Literature',
            currentGrade: 82.3,
            targetGrade: 85,
            assignments: 6,
            completed: 4,
            averageGrade: 82.3,
            trend: 'stable'
          },
          {
            name: 'Science',
            currentGrade: 91.2,
            targetGrade: 88,
            assignments: 7,
            completed: 5,
            averageGrade: 91.2,
            trend: 'up'
          },
          {
            name: 'History',
            currentGrade: 89.7,
            targetGrade: 87,
            assignments: 5,
            completed: 3,
            averageGrade: 89.7,
            trend: 'up'
          }
        ];
        setSubjects(mockSubjects);

        // Mock progress reports
        const mockReports: ProgressReport[] = [
          {
            id: 1,
            title: 'Mid-Term Progress Report',
            period: 'Fall 2024',
            overallGrade: 87.9,
            subjects: mockSubjects,
            teacherComments: 'Excellent progress this semester! You have shown great improvement in Mathematics and maintained strong performance in Science. Continue to focus on developing stronger thesis statements in English essays.',
            recommendations: [
              'Practice more complex word problems in Mathematics',
              'Work on strengthening thesis statements in English essays',
              'Continue excellent work in Science and History'
            ],
            generatedDate: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            title: 'Quarter 1 Report',
            period: 'Fall 2024',
            overallGrade: 85.2,
            subjects: mockSubjects.map(s => ({ ...s, currentGrade: s.currentGrade - 2 })),
            teacherComments: 'Good start to the academic year. You have demonstrated solid understanding of core concepts across all subjects.',
            recommendations: [
              'Focus on time management for assignments',
              'Seek help early when struggling with concepts',
              'Participate more actively in class discussions'
            ],
            generatedDate: '2024-10-15T10:00:00Z'
          }
        ];
        setProgressReports(mockReports);

      } catch (error) {
        console.error('Error loading performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const downloadReport = (report: ProgressReport) => {
    // Simulate PDF download
    const content = `
Progress Report: ${report.title}
Period: ${report.period}
Overall Grade: ${report.overallGrade}%

Subjects:
${report.subjects.map(s => `- ${s.name}: ${s.currentGrade}%`).join('\n')}

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
    a.download = `${report.title.replace(/\s+/g, '_')}_${report.period}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject;
    const matchesPeriod = selectedPeriod === 'all' || 
      (selectedPeriod === 'recent' && new Date(grade.gradedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    return matchesSubject && matchesPeriod;
  });

  const overallAverage = grades.length > 0 
    ? grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length 
    : 0;

  if (!user || user.role !== 'student') {
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
            <h1 className="text-2xl font-bold text-gray-900">Performance & Reports</h1>
            <p className="text-gray-600">Track your academic progress and view detailed reports</p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Average</p>
                <p className={cn("text-2xl font-bold", getGradeColor(overallAverage))}>
                  {overallAverage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assignments Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grades.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Highest Grade</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(...grades.map(g => g.percentage))}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Target Average</p>
                <p className="text-2xl font-bold text-gray-900">87.0%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Subject Performance</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
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

        {/* Grades Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Grades</h2>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Subjects</option>
                  {Array.from(new Set(grades.map(g => g.subject))).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="recent">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{grade.assignment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {grade.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn("text-sm font-medium", getGradeColor(grade.percentage))}>
                        {grade.grade}/{grade.maxGrade} ({grade.percentage}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {grade.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(grade.gradedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => alert(`Feedback: ${grade.feedback}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progress Reports */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Progress Reports</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {progressReports.map((report) => (
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
      </div>
    </DashboardLayout>
  );
}
