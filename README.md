# 🎓 Knowledge and Skills Hub MVP

A comprehensive educational management system with role-based access control for educational institutions.

## 🚀 Features

- **Role-Based Access Control**: Admin, Teacher, Student, Parent, HR Manager, and Branch Manager roles
- **User Management**: Complete user lifecycle management
- **HR Management**: Employee records, leave requests, and HR analytics
- **Branch Management**: Multiple branch locations with individual management
- **Waiting List**: Student application and enrollment management
- **Google Sheets Integration**: Data synchronization with Google Sheets
- **Assignment Management**: Create, submit, and grade assignments
- **Online Classes**: Schedule and join virtual classes
- **Progress Tracking**: Monitor student performance and progress
- **Reports & Analytics**: Comprehensive reporting system
- **Modern UI/UX**: Beautiful, responsive design with TailwindCSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Storage**: Local storage (AWS S3 ready)
- **UI Components**: Custom components with modern design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (optional - can run with hardcoded users)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd knowledge-and-skills-hub
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**
```bash
# Backend environment
cd backend
cp env.example .env
# Edit .env with your configuration
```

4. **Start the application**
```bash
# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👤 Default Credentials

For testing without database setup, use these simple credentials:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin |
| Teacher | teacher | teacher |
| Student | student | student |
| Parent | parent | parent |
| HR Manager | hr | hr |
| Branch Manager | branch | branch |

## 📁 Project Structure

```
knowledge-and-skills-hub/
├── backend/                 # Backend API
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── database/           # Database setup and schema
│   └── server.js           # Main server file
├── frontend/               # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   └── lib/               # Utility functions
└── README.md              # This file
```

## 🎯 Features by Role

### Admin
- User management (create, edit, delete users)
- HR management and employee records
- Branch management and location oversight
- Waiting list management
- Google Sheets integration
- System reports and analytics
- Platform configuration

### HR Manager
- Employee records and performance tracking
- Leave request management
- HR analytics and reporting
- Waiting list management

### Branch Manager
- Branch-specific operations
- Student management within branch
- Waiting list management
- Branch reports and analytics

### Teacher
- Create and manage assignments
- Schedule online classes
- Grade student submissions
- View student progress

### Student
- View and submit assignments
- Join online classes
- Track personal progress
- View grades and feedback

### Parent
- Monitor child's progress
- View assignments and grades
- Access class schedules
- Communication with teachers

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run db:setup     # Setup database (requires PostgreSQL)
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
```

## 📝 API Documentation

The API includes the following endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/users` - Get all users (Admin only)
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment (Teacher only)
- `GET /api/classes` - Get classes
- `POST /api/classes` - Schedule class (Teacher only)
- `GET /api/reports` - Get reports (Admin only)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on all device sizes
- **Dark/Light Mode**: Theme support (coming soon)
- **Smooth Animations**: Enhanced user experience
- **Accessibility**: WCAG compliant components

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Helmet security headers

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm start
```

## 📞 Support

For support and questions, please contact the development team.

---

**Knowledge and Skills Hub** - Empowering Education Through Technology 🎓
