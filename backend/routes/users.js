const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../database/config');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.name, u.email, u.role, u.created_at,
             t.subject,
             s.grade,
             p.phone, p.address
      FROM users u
      LEFT JOIN teachers t ON u.id = t.user_id
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN parents p ON u.id = p.user_id
      ORDER BY u.created_at DESC
    `;
    
    const result = await pool.query(query);
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT u.id, u.name, u.email, u.role, u.created_at,
             t.subject,
             s.grade,
             p.phone, p.address
      FROM users u
      LEFT JOIN teachers t ON u.id = t.user_id
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN parents p ON u.id = p.user_id
      WHERE u.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('subject').optional().trim(),
  body('grade').optional().trim(),
  body('phone').optional().trim(),
  body('address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, subject, grade, phone, address } = req.body;

    // Update user table
    if (name || email) {
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      if (name) {
        updateFields.push(`name = $${paramCount++}`);
        values.push(name);
      }
      if (email) {
        updateFields.push(`email = $${paramCount++}`);
        values.push(email);
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const updateQuery = `
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramCount}
      `;
      
      await pool.query(updateQuery, values);
    }

    // Update role-specific tables
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = userResult.rows[0].role;

    if (userRole === 'teacher' && subject) {
      await pool.query(
        'UPDATE teachers SET subject = $1 WHERE user_id = $2',
        [subject, id]
      );
    } else if (userRole === 'student' && grade) {
      await pool.query(
        'UPDATE students SET grade = $1 WHERE user_id = $2',
        [grade, id]
      );
    } else if (userRole === 'parent' && (phone || address)) {
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      if (phone) {
        updateFields.push(`phone = $${paramCount++}`);
        values.push(phone);
      }
      if (address) {
        updateFields.push(`address = $${paramCount++}`);
        values.push(address);
      }

      values.push(id);
      const updateQuery = `
        UPDATE parents 
        SET ${updateFields.join(', ')} 
        WHERE user_id = $${paramCount}
      `;
      
      await pool.query(updateQuery, values);
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user (cascade will handle related records)
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
