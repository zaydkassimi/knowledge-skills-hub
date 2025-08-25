const jwt = require('jsonwebtoken');
const pool = require('../database/config');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user details from database
    const userQuery = `
      SELECT u.id, u.name, u.email, u.role, 
             t.id as teacher_id, t.subject,
             s.id as student_id, s.grade,
             p.id as parent_id, p.phone, p.address
      FROM users u
      LEFT JOIN teachers t ON u.id = t.user_id
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN parents p ON u.id = p.user_id
      WHERE u.id = $1
    `;
    
    const userResult = await pool.query(userQuery, [decoded.userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = userResult.rows[0];
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (Array.isArray(roles)) {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    } else {
      if (req.user.role !== roles) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    }
    
    next();
  };
};

// Helper function to check if user is admin
const isAdmin = (req, res, next) => {
  return requireRole('admin')(req, res, next);
};

// Helper function to check if user is teacher
const isTeacher = (req, res, next) => {
  return requireRole(['admin', 'teacher'])(req, res, next);
};

// Helper function to check if user is student
const isStudent = (req, res, next) => {
  return requireRole(['admin', 'teacher', 'student'])(req, res, next);
};

// Helper function to check if user is parent
const isParent = (req, res, next) => {
  return requireRole(['admin', 'teacher', 'parent'])(req, res, next);
};

module.exports = {
  authenticateToken,
  requireRole,
  isAdmin,
  isTeacher,
  isStudent,
  isParent
};
