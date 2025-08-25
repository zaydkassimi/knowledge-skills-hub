# 🚀 Teacher Portal MVP - Setup Guide

This guide will help you set up and run the Teacher Portal MVP application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **PostgreSQL** (version 12 or higher)
- **npm** or **yarn** package manager

## 🗄️ Database Setup

### 1. Install PostgreSQL
- Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
- Create a new database user and database for the application

### 2. Configure Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE teacher_portal;
CREATE USER teacher_portal_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE teacher_portal TO teacher_portal_user;
\q
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the environment template
cp env.example .env

# Edit .env file with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teacher_portal
DB_USER=teacher_portal_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_super_secret_jwt_key_here
```

### 4. Setup Database Schema
```bash
# Run the database setup script
npm run db:setup
```

This will:
- Create all necessary tables
- Insert sample data
- Create default admin user

### 5. Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will be running on `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Frontend Development Server
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🔐 Default Login Credentials

After running the database setup, you can log in with these default accounts:

### Admin Account
- **Email**: admin@school.com
- **Password**: admin123

### Sample Teacher Account
- **Email**: teacher@school.com
- **Password**: teacher123

### Sample Student Account
- **Email**: student@school.com
- **Password**: student123

### Sample Parent Account
- **Email**: parent@school.com
- **Password**: parent123

## 🧪 Testing the Application

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Login** with any of the default accounts above
3. **Explore** the different dashboards based on user roles

## 📁 Project Structure

```
teacher-portal/
├── backend/                 # Node.js + Express API
│   ├── database/           # Database schemas and setup
│   ├── middleware/         # Authentication and error handling
│   ├── routes/             # API endpoints
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React + Next.js application
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utility functions
│   └── package.json        # Frontend dependencies
└── README.md               # Project overview
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env` file
   - Ensure database exists

2. **Port Already in Use**
   - Change ports in `.env` files
   - Kill processes using the ports

3. **Module Not Found Errors**
   - Run `npm install` in both backend and frontend directories
   - Clear `node_modules` and reinstall if needed

### Logs and Debugging

- **Backend logs**: Check terminal where backend is running
- **Frontend logs**: Check browser console and terminal
- **Database logs**: Check PostgreSQL logs

## 🔒 Security Notes

- **Change default passwords** in production
- **Use strong JWT secrets** in production
- **Enable HTTPS** in production
- **Configure CORS** properly for production domains

## 🚀 Production Deployment

For production deployment:

1. **Set NODE_ENV=production**
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** with proper SSL certificates
4. **Configure reverse proxy** (nginx/Apache)
5. **Set up monitoring** and logging
6. **Use PM2** or similar process manager for Node.js

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all prerequisites are met
4. Verify database connectivity

## 🎉 Success!

Once everything is running, you should see:
- Backend API running on port 5000
- Frontend application running on port 3000
- Database connected successfully
- Sample data loaded
- Login page accessible

You can now explore the Teacher Portal MVP with all its features!
