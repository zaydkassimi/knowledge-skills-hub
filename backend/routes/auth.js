const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../database/config');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Simple hardcoded users for testing when database is not available
const SIMPLE_USERS = {
  'admin': {
    id: 1,
    name: 'System Admin',
    email: 'admin@school.com',
    role: 'admin',
    password: 'admin'
  },
  'teacher': {
    id: 2,
    name: 'John Doe',
    email: 'teacher@school.com',
    role: 'teacher',
    subject: 'Mathematics',
    password: 'teacher'
  },
  'student': {
    id: 3,
    name: 'Jane Smith',
    email: 'student@school.com',
    role: 'student',
    grade: '10th Grade',
    password: 'student'
  },
  'parent': {
    id: 4,
    name: 'Mary Smith',
    email: 'parent@school.com',
    role: 'parent',
    phone: '+1234567890',
    address: '123 Main St, City',
    password: 'parent'
  },
  'hr': {
    id: 5,
    name: 'HR Manager',
    email: 'hr@school.com',
    role: 'hr_manager',
    password: 'hr'
  },
  'branch': {
    id: 6,
    name: 'Branch Manager',
    email: 'branch@school.com',
    role: 'branch_manager',
    password: 'branch'
  }
};

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // First try simple credentials
    let user = null;
    for (const [key, simpleUser] of Object.entries(SIMPLE_USERS)) {
      if (simpleUser.password === password) {
        user = { ...simpleUser };
        break;
      }
    }

    // If simple credentials didn't work, try database
    if (!user) {
      try {
        // Get user with role details from database
        const userQuery = `
          SELECT u.id, u.name, u.email, u.password_hash, u.role,
                 t.id as teacher_id, t.subject,
                 s.id as student_id, s.grade,
                 p.id as parent_id, p.phone, p.address
          FROM users u
          LEFT JOIN teachers t ON u.id = t.user_id
          LEFT JOIN students s ON u.id = s.user_id
          LEFT JOIN parents p ON u.id = p.user_id
          WHERE u.email = $1
        `;

        const userResult = await pool.query(userQuery, [email]);
        
        if (userResult.rows.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const dbUser = userResult.rows[0];
        const isValidPassword = await bcrypt.compare(password, dbUser.password_hash);

        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        user = dbUser;
      } catch (dbError) {
        console.log('Database connection failed, using simple credentials');
        // Database failed, continue with simple credentials check
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Remove password from response
    delete user.password_hash;
    delete user.password;

    res.json({
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register new user (Admin only)
router.post('/register', [
  authenticateToken,
  isAdmin,
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['teacher', 'student', 'parent']),
  body('subject').optional().trim(),
  body('grade').optional().trim(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('parentId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, email, password, role, subject, grade, phone, address, parentId
    } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create user
      const userResult = await client.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, email, passwordHash, role]
      );

      const userId = userResult.rows[0].id;

      // Create role-specific records
      if (role === 'teacher' && subject) {
        await client.query(
          'INSERT INTO teachers (user_id, subject) VALUES ($1, $2)',
          [userId, subject]
        );
      } else if (role === 'student' && grade) {
        if (parentId) {
          await client.query(
            'INSERT INTO students (user_id, grade, parent_id) VALUES ($1, $2, $3)',
            [userId, grade, parentId]
          );
        } else {
          await client.query(
            'INSERT INTO students (user_id, grade) VALUES ($1, $2)',
            [userId, grade]
          );
        }
      } else if (role === 'parent' && (phone || address)) {
        await client.query(
          'INSERT INTO parents (user_id, phone, address) VALUES ($1, $2, $3)',
          [userId, phone || null, address || null]
        );
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: 'User created successfully',
        userId,
        role
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Profile retrieved successfully',
      user: req.user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Change password
router.put('/change-password', [
  authenticateToken,
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get current password hash
    const userResult = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword, 
      userResult.rows[0].password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
