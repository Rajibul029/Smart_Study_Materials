// This is the backend server file (e.g., server.js) that handles API requests.

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const studentModel = require('./models/studentModel');
const { register, login,verifyAdmin } = require('./controllers/auth');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Enable JSON body parsing
app.use(cors()); // Enable CORS for all routes

app.post('/api/admin/register', register);
app.post('/api/admin/login', login);

// ------------------------------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('Welcome to the Study Materials API');
});
//admin action
// fetch all students-----------done----------------
app.get('/api/admin/students', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await studentModel.getAllStudents();
    res.json(rows);
  } catch (err) {
    console.error("Fetch students error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch students." });
  }
});

// add-student-----------done----------------
app.post('/api/admin/add-student', verifyAdmin,async (req, res) => {
  // Logic to add student
  const { std_id, std_name, std_email, std_ph_no, std_sem } = req.body;
  await studentModel.createStudent(std_id, std_name, std_email, std_ph_no, std_sem)
    .then(() => {
      res.send('Student added');
    })
    .catch((error) => {
      console.error('Error adding student:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Update Student-----------done----------------
app.put('/api/admin/update-student/:studentId', verifyAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { std_name, std_email, std_ph_no, std_sem} = req.body;
    await studentModel.updateStudent(studentId, std_name, std_email, std_ph_no, std_sem);
    res.json({ success: true, message: "Student updated successfully!" });
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ success: false, message: "Failed to update student." });
  }
});

// Delete Student ----------done----------------
app.delete('/api/admin/delete-student/:studentId', verifyAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;
    await studentModel.deleteStudent(studentId);
    res.json({ success: true, message: "Student deleted successfully!" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ success: false, message: "Failed to delete student." });
  }
});

//-----------------------material---------------------------
//get all materials-----------done----------------
app.get('/api/admin/materials/:sem_no', verifyAdmin, async (req, res) => {
  try {
    const { sem_no } = req.params;
    const [rows,table] = await studentModel.getAllMaterials(sem_no);
    
    res.json(rows,table);
  } catch (err) {
    console.error("Fetch materials error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch materials." });
  }
});

// Add Material-----------done----------------
app.post('/api/admin/add-material', verifyAdmin, async (req, res) => {
  try {
    const { sem_no, sub_name, description, type, url, dept_id} = req.body;

    if (!sem_no || !dept_id) {
      return res.status(400).json({ success: false, message: "Semester and Department ID required" });
    }
    await studentModel.addMaterial( sem_no, sub_name, description, type, url, dept_id);
    res.json({ success: true, message: "Material added successfully!" });
  } catch (err) {
    console.error("Add material error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update Material
app.put('/api/admin/update-material/:materialId', verifyAdmin, async (req, res) => {
  try {
    const { materialId } = req.params;
    const { sem_no, sub_name, description, type, url, dept_id} = req.body;
    if (!sem_no || !dept_id) {
      return res.status(400).json({ success: false, message: "Semester and Department ID required" });
    }
    await studentModel.updateMaterial(materialId, sem_no, sub_name, description, type, url, dept_id);
    res.json({ success: true, message: "Material updated successfully!" });
  } catch (err) {
    console.error("Update material error:", err);
    res.status(500).json({ success: false, message: "Failed to update material." });
  }

  res.send('Update material - To be implemented');
});

// Delete Material
app.delete('/api/admin/delete-material/:sem/:materialId', verifyAdmin, async (req, res) => {
  try {
    const { sem, materialId } = req.params;
    
    if (!sem) {
      return res.status(400).json({ success: false, message: "Semester required" });
    }
    await studentModel.deleteMaterial(materialId, sem);
    res.json({ success: true, message: "Material deleted successfully!" });
  } catch (err) {
    console.error("Delete material error:", err);
    res.status(500).json({ success: false, message: "Failed to delete material." });
  }
});

// ------------------------------------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  service: process.env.M_SERVICE || 'gmail', 
  auth: {
    user: process.env.M_USER || 'rajibulislam62963@@gmail.com', 
    pass: process.env.M_PASS || 'zypioxlmslsyyndw'  
  }
});


// A simple API endpoint to check if a student ID exists and return their materials.
app.post('/api/check-student', async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await studentModel.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Invalid Student ID.' });
    }
    const stdId = student.std_id;
        const dept = stdId.split("/")[1];
        let stdSem = "sem_"
        stdSem += student.std_sem;

    const materials = await studentModel.getMaterialsByStudent(stdSem, dept);
    res.json({ success: true, materials });
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// New API endpoint to send materials via email
app.post('/api/send-materials-email', async (req, res) => {
  try {
    const { studentId } = req.body;

    // Defensive check to ensure students array is loaded
    const student = await studentModel.getStudentById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    const stdId = student.std_id;
    const dept = stdId.split("/")[1];
    let stdSem = "sem_"
    stdSem += student.std_sem;

    const materials = await studentModel.getMaterialsByStudent(stdSem, dept);
    if (!materials.length) return res.status(404).json({ success: false, message: 'No materials found.' });

    // Construct the email body from the student's materials
    const emailSubject = `Hello ${student.std_name}, your Study Materials for Student Code: ${student.std_id}`;
    const emailBody = materials.map(material =>
      `Title: ${material.sub_name}\nDescription: ${material.description}\nType: ${material.type}\nURL: ${material.url}\n\n`
    ).join('');

    const mailOptions = {
      from: process.env.M_user, 
      to: student.std_email,       
      subject: emailSubject,
      text: emailBody
    };


    // Attempt to send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.response}`);
    res.json({ success: true, message: 'Materials sent successfully to your email!' });
  } catch (error) {
    // Log the detailed error to the console for debugging
    console.error("Error sending email:", error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please check your email credentials in server.js.'
    });
  }
});

// New API endpoint to send materials via WhatsApp
app.post('/api/send-materials-whatsapp', async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await studentModel.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    const stdId = student.std_id;
    const dept = stdId.split("/")[1];
    let stdSem = "sem_"
    stdSem += student.std_sem;

    const materials = await studentModel.getMaterialsByStudent(stdSem, dept);
    if (!materials.length) return res.status(404).json({ success: false, message: 'No materials found.' });

    // Construct the message body from the student's materials
    const messageText = `Hi ${student.std_name}, here are your study materials:\n\n` +
      materials.map(material =>
        `Title: ${material.sub_name}\n Description:${material.description}\nType: ${material.type}\nURL: ${material.url}\n\n`
      ).join('');

    // Use the user's phone number and the message to construct a WhatsApp API URL.
    // The phone number should be in international format (e.g., +1234567890).
    const whatsappUrl = `https://wa.me/${student.std_ph_no}?text=${encodeURIComponent(messageText)}`;
    console.log(`WhatsApp URL generated: ${whatsappUrl}`);

    // The server sends the URL back to the frontend.
    // The frontend will then redirect the user to this URL.
    res.json({ success: true, whatsappUrl: whatsappUrl });
  } catch (err) {
    console.error('WhatsApp error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate WhatsApp link.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
