const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../database/config');
const { isTeacher } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT c.id, c.subject, c.start_time, c.end_time, c.meeting_link, c.created_at,
             u.name as teacher_name, t.subject as teacher_subject
      FROM classes c
      JOIN teachers t ON c.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      ORDER BY c.start_time ASC
    `;
    
    const result = await pool.query(query);
    res.json({ classes: result.rows });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get class by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT c.id, c.subject, c.start_time, c.end_time, c.meeting_link, c.created_at,
             u.name as teacher_name, t.subject as teacher_subject
      FROM classes c
      JOIN teachers t ON c.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      WHERE c.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    res.json({ class: result.rows[0] });
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

// Schedule new class (Teacher only)
router.post('/', [
  isTeacher,
  body('subject').trim().isLength({ min: 2 }),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('meetingLink').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, startTime, endTime, meetingLink } = req.body;
    const teacherId = req.user.teacher_id;

    if (!teacherId) {
      return res.status(403).json({ error: 'Teacher access required' });
    }

    // Validate time logic
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const query = `
      INSERT INTO classes (teacher_id, subject, start_time, end_time, meeting_link)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, subject, start_time, end_time, meeting_link, created_at
    `;
    
    const result = await pool.query(query, [
      teacherId, subject, startTime, endTime, meetingLink
    ]);
    
    res.status(201).json({ 
      message: 'Class scheduled successfully',
      class: result.rows[0]
    });
  } catch (error) {
    console.error('Error scheduling class:', error);
    res.status(500).json({ error: 'Failed to schedule class' });
  }
});

// Update class (Teacher only)
router.put('/:id', [
  isTeacher,
  body('subject').optional().trim().isLength({ min: 2 }),
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601(),
  body('meetingLink').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { subject, startTime, endTime, meetingLink } = req.body;
    const teacherId = req.user.teacher_id;

    // Check if class exists and belongs to teacher
    const checkQuery = `
      SELECT id FROM classes 
      WHERE id = $1 AND teacher_id = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [id, teacherId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found or access denied' });
    }

    // Validate time logic if both times are provided
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Update class
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (subject) {
      updateFields.push(`subject = $${paramCount++}`);
      values.push(subject);
    }
    if (startTime) {
      updateFields.push(`start_time = $${paramCount++}`);
      values.push(startTime);
    }
    if (endTime) {
      updateFields.push(`end_time = $${paramCount++}`);
      values.push(endTime);
    }
    if (meetingLink !== undefined) {
      updateFields.push(`meeting_link = $${paramCount++}`);
      values.push(meetingLink);
    }

    values.push(id);
    const updateQuery = `
      UPDATE classes 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
    `;
    
    await pool.query(updateQuery, values);
    
    res.json({ message: 'Class updated successfully' });
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Delete class (Teacher only)
router.delete('/:id', isTeacher, async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.teacher_id;

    // Check if class exists and belongs to teacher
    const checkQuery = `
      SELECT id FROM classes 
      WHERE id = $1 AND teacher_id = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [id, teacherId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found or access denied' });
    }

    // Delete class
    await pool.query('DELETE FROM classes WHERE id = $1', [id]);
    
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

module.exports = router;
