// auth.js - Handles user registration and login

const pool = require('../models/db');       // MySQL connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // ⚠️ change to env variable in production

/**
 * Register a new user
 */
async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Check if user already exists
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);
    
    res.json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Find user
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });

    res.json({ success: true, message: "Login successful!", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}
// Middleware for admin auth
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
    req.user = decoded; // attach decoded payload to request
    next();
  });
}


module.exports = { register, login, verifyAdmin };
