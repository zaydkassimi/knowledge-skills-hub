const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../database/config');
const { isTeacher } = require('../middleware/auth');

const router = express.Router();

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT a.id, a.title, a.description, a.due_date, a.attachment_url, a.created_at,
             t.subject, u.name as teacher_name
      FROM assignments a
      JOIN teachers t ON a.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      ORDER BY a.due_date ASC
    `;
    
    const result = await pool.query(query);
    res.json({ assignments: result.rows });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT a.id, a.title, a.description, a.due_date, a.attachment_url, a.created_at,
             t.subject, u.name as teacher_name
      FROM assignments a
      JOIN teachers t ON a.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE a.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json({ assignment: result.rows[0] });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Create new assignment (Teacher only)
router.post('/', [
  isTeacher,
  body('title').trim().isLength({ min: 3 }),
  body('description').optional().trim(),
  body('dueDate').isISO8601(),
  body('attachmentUrl').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate, attachmentUrl } = req.body;
    const teacherId = req.user.teacher_id;

    if (!teacherId) {
      return res.status(403).json({ error: 'Teacher access required' });
    }

    const query = `
      INSERT INTO assignments (teacher_id, title, description, due_date, attachment_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, due_date, attachment_url, created_at
    `;
    
    const result = await pool.query(query, [
      teacherId, title, description, dueDate, attachmentUrl
    ]);
    
    res.status(201).json({ 
      message: 'Assignment created successfully',
      assignment: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Update assignment (Teacher only)
router.put('/:id', [
  isTeacher,
  body('title').optional().trim().isLength({ min: 3 }),
  body('description').optional().trim(),
  body('dueDate').optional().isISO8601(),
  body('attachmentUrl').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, dueDate, attachmentUrl } = req.body;
    const teacherId = req.user.teacher_id;

    // Check if assignment exists and belongs to teacher
    const checkQuery = `
      SELECT id FROM assignments 
      WHERE id = $1 AND teacher_id = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [id, teacherId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found or access denied' });
    }

    // Update assignment
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updateFields.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (dueDate) {
      updateFields.push(`due_date = $${paramCount++}`);
      values.push(dueDate);
    }
    if (attachmentUrl !== undefined) {
      updateFields.push(`attachment_url = $${paramCount++}`);
      values.push(attachmentUrl);
    }

    values.push(id);
    const updateQuery = `
      UPDATE assignments 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
    `;
    
    await pool.query(updateQuery, values);
    
    res.json({ message: 'Assignment updated successfully' });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Delete assignment (Teacher only)
router.delete('/:id', isTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.teacher_id;

    // Check if assignment exists and belongs to teacher
    const checkQuery = `
      SELECT id FROM assignments 
      WHERE id = $1 AND teacher_id = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [id, teacherId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found or access denied' });
    }

    // Delete assignment (cascade will handle submissions)
    await pool.query('DELETE FROM assignments WHERE id = $1', [id]);
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

module.exports = router;
