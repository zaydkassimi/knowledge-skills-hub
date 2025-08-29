'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  GraduationCap, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Save, 
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentAdmission {
  // Student Information
  fullName: string;
  age: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  email: string;
  contactNumber: string;
  emergencyContactNumber: string;
  schoolYear: string;
  schoolName: string;
  
  // Academic Information
  subjectsEnrollingFor: string[];
  currentGrade: string;
  
  // Parent Information
  parentName: string;
  parentContactDetail: string;
  parentEmail: string;
}

export default function AdmissionsPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<StudentAdmission>({
    fullName: '',
    age: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    email: '',
    contactNumber: '',
    emergencyContactNumber: '',
    schoolYear: '',
    schoolName: '',
    subjectsEnrollingFor: [],
    currentGrade: '',
    parentName: '',
    parentContactDetail: '',
    parentEmail: ''
  });

  const availableSubjects = [
    'Mathematics',
    'English',
    'Science',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Art',
    'Music',
    'PE',
    'Computer Science',
    'French',
    'Spanish',
    'Religious Studies'
  ];

  const grades = [
    'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11',
    'Year 12', 'Year 13', 'Foundation', 'Access Course'
  ];

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        subjectsEnrollingFor: [...formData.subjectsEnrollingFor, subject]
      });
    } else {
      setFormData({
        ...formData,
        subjectsEnrollingFor: formData.subjectsEnrollingFor.filter(s => s !== subject)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.dateOfBirth || !formData.email || 
        !formData.contactNumber || !formData.parentName || !formData.parentEmail ||
        formData.subjectsEnrollingFor.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to localStorage (in real app, this would be sent to API)
      const admissions = JSON.parse(localStorage.getItem('student_admissions') || '[]');
      const newAdmission = {
        id: Date.now(),
        ...formData,
        submissionDate: new Date().toISOString(),
        status: 'pending'
      };
      
      admissions.push(newAdmission);
      localStorage.setItem('student_admissions', JSON.stringify(admissions));

      // Also add to waiting list for admin review
      const waitingList = JSON.parse(localStorage.getItem('waitingList') || '[]');
      const waitingEntry = {
        id: Date.now() + 1,
        studentName: formData.fullName,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentContactDetail,
        desiredGrade: formData.currentGrade,
        desiredSubjects: formData.subjectsEnrollingFor.join(', '),
        branchName: 'Main Campus',
        status: 'pending',
        applicationDate: new Date().toISOString().split('T')[0],
        priority: 'normal',
        notes: `Online admission form - Age: ${formData.age}, School: ${formData.schoolName}`
      };
      
      waitingList.push(waitingEntry);
      localStorage.setItem('waitingList', JSON.stringify(waitingList));

      setShowConfirmation(true);
      toast.success('Application submitted successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        age: '',
        dateOfBirth: '',
        gender: 'Male',
        address: '',
        email: '',
        contactNumber: '',
        emergencyContactNumber: '',
        schoolYear: '',
        schoolName: '',
        subjectsEnrollingFor: [],
        currentGrade: '',
        parentName: '',
        parentContactDetail: '',
        parentEmail: ''
      });
    } catch (error) {
      toast.error('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your application. We have received your admission request and it is now being reviewed by our admissions team.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              You will receive an email confirmation shortly, and we will contact you within 2-3 business days regarding the next steps.
            </p>
            <button
              onClick={() => setShowConfirmation(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Admission Application</h1>
            <p className="text-gray-600">Please fill in all required information to complete your application</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="space-y-8">
              {/* Student Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Student Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter age"
                      min="5"
                      max="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Enter full address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.emergencyContactNumber}
                      onChange={(e) => setFormData({...formData, emergencyContactNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter emergency contact"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Year
                    </label>
                    <input
                      type="text"
                      value={formData.schoolYear}
                      onChange={(e) => setFormData({...formData, schoolYear: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2024/2025"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current/previous school name"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Academic Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Grade *
                    </label>
                    <select
                      required
                      value={formData.currentGrade}
                      onChange={(e) => setFormData({...formData, currentGrade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select grade</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Subjects Enrolling For * (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSubjects.map(subject => (
                        <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.subjectsEnrollingFor.includes(subject)}
                            onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{subject}</span>
                        </label>
                      ))}
                    </div>
                    {formData.subjectsEnrollingFor.length === 0 && (
                      <p className="text-sm text-red-600 mt-2">Please select at least one subject</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Parent Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Parent/Guardian Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter parent/guardian name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Detail *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.parentContactDetail}
                      onChange={(e) => setFormData({...formData, parentContactDetail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter parent contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter parent email address"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Information Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-1">Application Process</h3>
                <p className="text-sm text-blue-700">
                  After submitting your application, our admissions team will review it within 2-3 business days. 
                  You will receive an email confirmation and further instructions about the next steps in the admission process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
