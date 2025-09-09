// models/studentModel.js
const pool = require('./db');

//get all students
async function getAllStudents() {
  const [rows] = await pool.query('SELECT * FROM students');
  return [rows];
}
// Create Student
async function createStudent(std_id, std_name, std_email, std_ph_no, std_sem) {
  const [result] = await pool.query(
    'INSERT INTO students (std_id, std_name, std_email, std_ph_no, std_sem) VALUES (?, ?, ?, ?, ?)',
    [std_id, std_name, std_email, std_ph_no, std_sem]
  );
  return result.insertId;
}

module.exports.getStudentByStdId = function (std_id) {
  return db('students').where({ std_id }).first();
};

// Get Student by ID
async function getStudentById(std_id) {
  const [rows] = await pool.query(
    'SELECT * FROM students WHERE std_id = ?',
    [std_id]
  );
  return rows[0];
}

// Get Materials by Student
async function getMaterialsByStudent(std_sem, dept) {
  const [rows] = await pool.query(
    `select S.sub_name,S.description,S.type,S.url,D.dept_name from ${std_sem} S join department D on S.dept_id=D.dept_id
where D.dept_name= ?;`,
    [dept]
  );
  return rows;
}

//----------------------------------To do---------------------------
//get all materials
async function getAllMaterials(sem_no) {
  const table = `sem_${sem_no}`;
  const [rows] = await pool.query(`SELECT M.*, D.dept_name FROM ${table} M JOIN department D ON M.dept_id = D.dept_id order by id`);
  return [rows,table];
  
}
// Add Material
async function addMaterial( sem_no, sub_name, description, type, url, dept_id) {
  const table = `sem_${sem_no}`;
    await pool.query(
      `INSERT INTO ${table} (sub_name, description, type, url, dept_id) VALUES (?, ?, ?, ?, ?)`,
      [sub_name, description, type, url, dept_id]
    );
}
// update material
async function updateMaterial(id, sem_no, sub_name, description, type, url, dept_id) {
  const table = `sem_${sem_no}`;
  await pool.query(
    `UPDATE ${table} SET sub_name = ?, description = ?, type = ?, url = ?, dept_id = ? WHERE id = ?`,
    [sub_name, description, type, url, dept_id, id]
  );
}
// delete material
async function deleteMaterial(id, sem_no) {
  const table = `sem_${sem_no}`;
  await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
}

// Update Student
async function updateStudent(id,std_name, std_email, std_ph_no, std_sem) {
  await pool.query(
    'UPDATE students SET std_name = ?, std_email = ?, std_ph_no = ?, std_sem = ? WHERE id = ?',
    [std_name, std_email, std_ph_no, std_sem, id]
  );
}

// Delete Student
async function deleteStudent(id) {
  await pool.query('DELETE FROM students WHERE id = ?', [id]);
}

module.exports = {
  createStudent,
  getStudentById,
  getMaterialsByStudent,
  addMaterial,
  updateStudent,
  deleteStudent,
  getAllStudents,
  getAllMaterials,
  updateMaterial,
  deleteMaterial
};
