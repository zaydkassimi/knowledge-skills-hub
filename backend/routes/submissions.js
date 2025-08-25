const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../database/config');
const { isStudent, isTeacher } = require('../middleware/auth');

const router = express.Router();

// Get all submissions (Teacher only)
router.get('/', isTeacher, async (req, res) => {
  try {
    const query = `
      SELECT s.id, s.file_url, s.submitted_at, s.grade, s.feedback,
             a.title as assignment_title, a.due_date,
             u.name as student_name, u.email as student_email
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN students st ON s.student_id = st.id
      JOIN users u ON st.user_id = u.id
      ORDER BY s.submitted_at DESC
    `;
    
    const result = await pool.query(query);
    res.json({ submissions: result.rows });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get submission by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT s.id, s.file_url, s.submitted_at, s.grade, s.feedback,
             a.title as assignment_title, a.due_date,
             u.name as student_name, u.email as student_email
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN students st ON s.student_id = st.id
      JOIN users u ON st.user_id = u.id
      WHERE s.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    res.json({ submission: result.rows[0] });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Submit assignment (Student only)
router.post('/', [
  isStudent,
  body('assignmentId').isInt(),
  body('fileUrl').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assignmentId, fileUrl } = req.body;
    const studentId = req.user.student_id;

    if (!studentId) {
      return res.status(403).json({ error: 'Student access required' });
    }

    // Check if assignment exists
    const assignmentCheck = await pool.query(
      'SELECT id FROM assignments WHERE id = $1',
      [assignmentId]
    );
    
    if (assignmentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if submission already exists
    const existingSubmission = await pool.query(
      'SELECT id FROM submissions WHERE assignment_id = $1 AND student_id = $2',
      [assignmentId, studentId]
    );
    
    if (existingSubmission.rows.length > 0) {
      return res.status(409).json({ error: 'Submission already exists for this assignment' });
    }

    // Create submission
    const query = `
      INSERT INTO submissions (assignment_id, student_id, file_url)
      VALUES ($1, $2, $3)
      RETURNING id, assignment_id, student_id, file_url, submitted_at
    `;
    
    const result = await pool.query(query, [assignmentId, studentId, fileUrl]);
    
    res.status(201).json({ 
      message: 'Assignment submitted successfully',
      submission: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

// Grade submission (Teacher only)
router.put('/:id/grade', [
  isTeacher,
  body('grade').isFloat({ min: 0, max: 100 }),
  body('feedback').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { grade, feedback } = req.body;

    // Check if submission exists
    const submissionCheck = await pool.query(
      'SELECT id FROM submissions WHERE id = $1',
      [id]
    );
    
    if (submissionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Update submission with grade and feedback
    const query = `
      UPDATE submissions 
      SET grade = $1, feedback = $2
      WHERE id = $3
    `;
    
    await pool.query(query, [grade, feedback, id]);
    
    res.json({ message: 'Submission graded successfully' });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});

// Update submission (Student only)
router.put('/:id', [
  isStudent,
  body('fileUrl').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { fileUrl } = req.body;
    const studentId = req.user.student_id;

    // Check if submission exists and belongs to student
    const submissionCheck = await pool.query(
      'SELECT id FROM submissions WHERE id = $1 AND student_id = $2',
      [id, studentId]
    );
    
    if (submissionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found or access denied' });
    }

    // Update submission
    const query = `
      UPDATE submissions 
      SET file_url = $1, submitted_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    
    await pool.query(query, [fileUrl, id]);
    
    res.json({ message: 'Submission updated successfully' });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

// Delete submission (Student only)
router.delete('/:id', isStudent, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.student_id;

    // Check if submission exists and belongs to student
    const submissionCheck = await pool.query(
      'SELECT id FROM submissions WHERE id = $1 AND student_id = $2',
      [id, studentId]
    );
    
    if (submissionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found or access denied' });
    }

    // Delete submission
    await pool.query('DELETE FROM submissions WHERE id = $1', [id]);
    
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

module.exports = router;
