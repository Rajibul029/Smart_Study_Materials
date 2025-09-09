// seed.js - Script to populate the MongoDB database with CSE demo data

// Import necessary packages
const mongoose = require('mongoose');

// --- Database Connection ---
const mongoDBUrl = 'mongodb://localhost:27017/smart_materials';
// IMPORTANT: Ensure this URL matches the one in your server.js file.
// If you're using MongoDB Atlas, replace this URL with your connection string.

// Define the schema for a single material item
const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String, // e.g., 'PDF', 'Video', 'Quiz'
  url: String,
});

// Define the main schema for a student document, which now includes a materials array
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
    user_email: {
        type: String,
        required: true,
        unique: true
  },
    user_no: {
      type: String,
      required: true
  },
  materials: [materialSchema], // An array of material documents
});

// Create the Mongoose model from the schema
const Student = mongoose.model('Student', studentSchema);

// Define the demo data to be inserted
const students = [
  {
    studentId: 'CSE101',
    user_email: 'legend.rj029@gmail.com',
    user_no: '+916296369214',
    materials: [
      {
        title: 'Introduction to Algorithms',
        description: 'Lecture notes covering basic sorting algorithms like bubble sort and merge sort.',
        type: 'PDF',
        url: 'https://example.com/materials/algorithms-notes.pdf',
      },
      {
        title: 'Data Structures Practice Problems',
        description: 'A set of practice problems on linked lists and trees.',
        type: 'Quiz',
        url: 'https://example.com/materials/ds-problems.html',
      },
      {
        title: 'CSE101 Final Exam Review',
        description: 'Video walkthrough of common topics for the final exam.',
        type: 'Video',
        url: 'https://example.com/materials/final-review.mp4',
      },
    ],
  },
  {
    studentId: 'CSE202',
    user_email: 'student.two@gmail.com',
    user_no: '+1234567890',
    materials: [
      {
        title: 'Operating Systems Concepts',
        description: 'Lecture slides on process management and memory allocation.',
        type: 'PDF',
        url: 'https://example.com/materials/os-concepts.pdf',
      },
      {
        title: 'Network Security Fundamentals',
        description: 'An introductory guide to cryptography and firewalls.',
        type: 'PDF',
        url: 'https://example.com/materials/network-security-intro.pdf',
      },
    ],
  },
  {
    studentId: 'CSE303',
    user_email: 'student.three@gmail.com',
    user_no: '+1234567890',
    materials: [
      {
        title: 'Machine Learning Basics',
        description: 'Notes and code examples for linear regression.',
        type: 'PDF',
        url: 'https://example.com/materials/ml-basics.pdf',
      },
      {
        title: 'Advanced Database Systems',
        description: 'A comprehensive overview of NoSQL databases and their applications.',
        type: 'PDF',
        url: 'https://example.com/materials/advanced-db.pdf',
      },
    ],
  },
];

// --- Main function to connect and seed the database ---
async function seedDatabase() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(mongoDBUrl);
    console.log('Successfully connected to MongoDB.');

    // Clear existing data to avoid duplicates
    await Student.deleteMany({});
    console.log('Existing student data cleared.');

    // Insert the new demo data
    await Student.insertMany(students);
    console.log('Demo data successfully inserted!');
    console.log('Inserted student IDs:', students.map(s => s.studentId).join(', '));

  } catch (err) {
    console.error('An error occurred while seeding the database:', err);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

// Run the seeding function
seedDatabase();

module.exports = { students };