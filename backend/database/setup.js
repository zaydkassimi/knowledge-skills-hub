const pool = require('./config');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Knowledge and Skills Hub database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schema);
    console.log('✅ Database schema created successfully');
    
    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminQuery = `
      INSERT INTO users (name, email, password_hash, role) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (email) DO NOTHING
    `;
    
    await pool.query(adminQuery, [
      'System Admin',
      'admin@school.com',
      adminPassword,
      'admin'
    ]);
    
    console.log('✅ Default admin user created');
    console.log('📧 Email: admin@school.com');
    console.log('🔑 Password: admin123');
    
    // Create sample data for testing
    await createSampleData();
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function createSampleData() {
  try {
    // Create sample teacher
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacherUser = await pool.query(`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES ($1, $2, $3, $4) RETURNING id
    `, ['John Doe', 'teacher@school.com', teacherPassword, 'teacher']);
    
    await pool.query(`
      INSERT INTO teachers (user_id, subject) VALUES ($1, $2)
    `, [teacherUser.rows[0].id, 'Mathematics']);
    
    // Create sample student
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentUser = await pool.query(`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES ($1, $2, $3, $4) RETURNING id
    `, ['Jane Smith', 'student@school.com', studentPassword, 'student']);
    
    // Create sample parent
    const parentPassword = await bcrypt.hash('parent123', 10);
    const parentUser = await pool.query(`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES ($1, $2, $3, $4) RETURNING id
    `, ['Mary Smith', 'parent@school.com', parentPassword, 'parent']);
    
    await pool.query(`
      INSERT INTO parents (user_id, phone, address) VALUES ($1, $2, $3)
    `, [parentUser.rows[0].id, '+1234567890', '123 Main St, City']);
    
    await pool.query(`
      INSERT INTO students (user_id, grade, parent_id) VALUES ($1, $2, $3)
    `, [studentUser.rows[0].id, '10th Grade', parentUser.rows[0].id]);
    
    console.log('✅ Sample data created successfully');
    
  } catch (error) {
    console.error('⚠️ Sample data creation failed:', error);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
