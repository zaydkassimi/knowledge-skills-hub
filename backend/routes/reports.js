const express = require('express');
const pool = require('../database/config');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics (Admin only)
router.get('/stats', isAdmin, async (req, res) => {
  try {
    // Get user counts by role
    const userStats = await pool.query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
    `);

    // Get assignment statistics
    const assignmentStats = await pool.query(`
      SELECT 
        COUNT(*) as total_assignments,
        COUNT(CASE WHEN due_date < CURRENT_TIMESTAMP THEN 1 END) as overdue_assignments,
        COUNT(CASE WHEN due_date >= CURRENT_TIMESTAMP THEN 1 END) as active_assignments
      FROM assignments
    `);

    // Get submission statistics
    const submissionStats = await pool.query(`
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN grade IS NOT NULL THEN 1 END) as graded_submissions,
        COUNT(CASE WHEN grade IS NULL THEN 1 END) as ungraded_submissions,
        AVG(grade) as average_grade
      FROM submissions
    `);

    // Get class statistics
    const classStats = await pool.query(`
      SELECT 
        COUNT(*) as total_classes,
        COUNT(CASE WHEN start_time > CURRENT_TIMESTAMP THEN 1 END) as upcoming_classes,
        COUNT(CASE WHEN start_time <= CURRENT_TIMESTAMP THEN 1 END) as past_classes
      FROM classes
    `);

    res.json({
      userStats: userStats.rows,
      assignmentStats: assignmentStats.rows[0],
      submissionStats: submissionStats.rows[0],
      classStats: classStats.rows[0]
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get user list report (Admin only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id, u.name, u.email, u.role, u.created_at,
        t.subject as teacher_subject,
        s.grade as student_grade,
        p.phone as parent_phone, p.address as parent_address
      FROM users u
      LEFT JOIN teachers t ON u.id = t.user_id
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN parents p ON u.id = p.user_id
      ORDER BY u.role, u.name
    `;
    
    const result = await pool.query(query);
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching user report:', error);
    res.status(500).json({ error: 'Failed to fetch user report' });
  }
});

// Get assignment report (Admin only)
router.get('/assignments', isAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id, a.title, a.description, a.due_date, a.created_at,
        t.subject as teacher_subject,
        u.name as teacher_name,
        COUNT(s.id) as submission_count
      FROM assignments a
      JOIN teachers t ON a.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      LEFT JOIN submissions s ON a.id = s.assignment_id
      GROUP BY a.id, t.subject, u.name
      ORDER BY a.due_date DESC
    `;
    
    const result = await pool.query(query);
    res.json({ assignments: result.rows });
  } catch (error) {
    console.error('Error fetching assignment report:', error);
    res.status(500).json({ error: 'Failed to fetch assignment report' });
  }
});

// Get submission report (Admin only)
router.get('/submissions', isAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id, s.submitted_at, s.grade, s.feedback,
        a.title as assignment_title, a.due_date,
        u.name as student_name, u.email as student_email,
        t.subject as teacher_subject,
        teacher.name as teacher_name
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN students st ON s.student_id = st.id
      JOIN users u ON st.user_id = u.id
      JOIN teachers t ON a.teacher_id = t.id
      JOIN users teacher ON t.user_id = teacher.id
      ORDER BY s.submitted_at DESC
    `;
    
    const result = await pool.query(query);
    res.json({ submissions: result.rows });
  } catch (error) {
    console.error('Error fetching submission report:', error);
    res.status(500).json({ error: 'Failed to fetch submission report' });
  }
});

// Get class report (Admin only)
router.get('/classes', isAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id, c.subject, c.start_time, c.end_time, c.meeting_link, c.created_at,
        u.name as teacher_name, t.subject as teacher_subject
      FROM classes c
      JOIN teachers t ON c.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      ORDER BY c.start_time DESC
    `;
    
    const result = await pool.query(query);
    res.json({ classes: result.rows });
  } catch (error) {
    console.error('Error fetching class report:', error);
    res.status(500).json({ error: 'Failed to fetch class report' });
  }
});

// Get student progress report (Admin only)
router.get('/student-progress', isAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id as student_id,
        u.name as student_name,
        u.email as student_email,
        s.grade as student_grade,
        COUNT(DISTINCT a.id) as total_assignments,
        COUNT(sub.id) as submitted_assignments,
        COUNT(CASE WHEN sub.grade IS NOT NULL THEN 1 END) as graded_assignments,
        AVG(sub.grade) as average_grade
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN assignments a ON 1=1
      LEFT JOIN submissions sub ON a.id = sub.assignment_id AND s.id = sub.student_id
      GROUP BY s.id, u.name, u.email, s.grade
      ORDER BY u.name
    `;
    
    const result = await pool.query(query);
    res.json({ studentProgress: result.rows });
  } catch (error) {
    console.error('Error fetching student progress report:', error);
    res.status(500).json({ error: 'Failed to fetch student progress report' });
  }
});

module.exports = router;
