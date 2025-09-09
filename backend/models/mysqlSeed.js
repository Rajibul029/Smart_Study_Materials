// mysqlSeed.js
const pool = require('./db');
const { students } = require('../seed'); // reuse your seed.js data

async function seedDatabase() {
  try {
    // Clear tables
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE materials');
    await pool.query('TRUNCATE TABLE students');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    for (const student of students) {
      // Insert student
      const [result] = await pool.query(
        'INSERT INTO students (studentId, user_email, user_no) VALUES (?, ?, ?)',
        [student.studentId, student.user_email, student.user_no]
      );

      const studentId = result.insertId;

      // Insert materials
      for (const mat of student.materials) {
        await pool.query(
          'INSERT INTO materials (student_id, title, description, type, url) VALUES (?, ?, ?, ?, ?)',
          [studentId, mat.title, mat.description, mat.type, mat.url]
        );
      }
    }

    console.log('✅ MySQL database seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding MySQL:', err);
  } finally {
    pool.end();
  }
}

seedDatabase();
