# 📘 SMART STUDY MATERIAL ACCESS PLATFORM

[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)  
[![Express](https://img.shields.io/badge/Backend-Express-green)](https://expressjs.com/)  
[![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-38B2AC)](https://tailwindcss.com/)  
[![Node.js](https://img.shields.io/badge/Runtime-Node.js-43853D)](https://nodejs.org/)  

A **full-stack web application** that enables students to instantly access their **study materials** using their **Student Code**.  
Students can receive materials directly via **Email (Gmail)** or **WhatsApp**.  

---

## 🚀 Features
- 🎓 Validate **Student Code** and fetch study materials.  
- 📧 **Send materials via Gmail** using Nodemailer.  
- 💬 **Send materials via WhatsApp** using `wa.me` API.  
- 🔐 User **authentication** (Register/Login with JWT).  
- 🌐 Responsive and modern UI with **React + TailwindCSS**.  
- ⚡ Backend powered by **Node.js + Express**.  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)  
- Tailwind CSS  

### Backend
- Node.js  
- Express  
- Nodemailer (for sending Gmail)  
- WhatsApp API (`wa.me`)   

### Database
- MySql
- MySql WorkBench
---

## 📂 Project Structure
```bash
smart-materials/
├── admin/
│   ├── App.jsx         # React app with login, register, and dashboard page
│   ├── main.jsx        # Entry point
│   ├── index.css       # Tailwind + custom styles
│   ├── App.css         # Component styling
│   └── assets/         # Static assets (logos, icons, bg images)
│
├── frontend/
│   ├── App.jsx         # React app with main page
│   ├── main.jsx        # Entry point
│   ├── index.css       # Tailwind + custom styles
│   ├── App.css         # Component styling
│   └── assets/         # Static assets (logos, icons, bg images)
│
├── backend/
│   ├── server.js       # Express server + APIs for email & WhatsApp
│   ├── models.js       # All the logics of database
│   ├── db.js           # Database Connection
│
└── README.md           # Documentation
```
---
## API Endpoints
### Method	Endpoint	Description

- POST	/api/check-student ➡️	Verify Student Code and fetch materials

- POST	/api/send-materials-email ➡️	Send materials to student’s Gmail

- POST	/api/send-materials-whatsapp ➡️	Send materials via WhatsApp link

- POST	/api/register ➡️	Register new user (email & password)

- POST	/api/login ➡️	Login with email & password

---
## 📸 UI Pages

Main Page → Enter Student Code, send via Gmail/WhatsApp

Login Page → Login with Email + Password

Register Page → Register new admin

Dashboard Page → Manage all the CRUD operations

Footer & Navbar → Always visible with links

---
## ⚙️ Installation & Setup

## 1️⃣ Clone the Repository
```bash
https://github.com/Rajibul029/Smart_Study_Materials.git
cd smart-materials
```

## 2️⃣ Setup Backend
```bash
cd backend
npm install
```

### ➡️ Create a .env file (or edit directly in server.js) with your Gmail App credentials:

EMAIL_USER=your-email@gmail.com

EMAIL_PASS=your-app-password

## Run the backend:
```bash
node server.js
```
Server runs on: http://localhost:3001

## 3️⃣ Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## 4️⃣ Setup Admin
```bash
cd admin
npm install
npm run dev
```
Frontend runs on: http://localhost:5174

---
## ⚠️ Important Notes

Use Gmail App Passwords (not your actual password). Learn more: Google Docs.

WhatsApp numbers must be in international format (e.g., +919876543210).

Seed student data must exist in seed.js for testing.

---
<p align="center">
  <img src="https://img.shields.io/badge/Hackathon-NEXATHON%201.0-blueviolet?style=for-the-badge&logo=hackthebox&logoColor=white" />
</p>

## This is a Hackathon project

### 💬 Problem Statement
SMART STUDY MATERIAL ACCESS PLATFORM

**📧 PROBLEM:** STUDENTS STRUGGLE TO FIND COURSE MATERIALS EFFICIENTLY.

**⚡ GOAL:** CREATE A PLATFORM WHERE:

STUDENTS ENTER THEIR ID

SYSTEM FETCHES MATERIALS INSTANTLY

DELIVERY VIA EMAIL/WHATSAPP

**🛠️ TECH STACK:**

**WEB:** REACT/NEXT.JS

**BACKEND:** NODE.JS/FLASK

**API:** WHATSAPP BUSINESS API, EMAIL API

**DATABASE:** MYSQL/FIREBASE

---
## 👥 Team Details
### Team Name: TDM
### Member Name	Role	Responsibilities:
| **Member Name** | **Role**                            | **Responsibilities**                                                                      |
| --------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| **Rajibul**        | **Backend Developer / Team Leader** | Developed backend APIs (Node.js + Express), authentication, and managed team coordination |
| **Moumita**        | **Frontend Developer**              | Built UI with React + Tailwind, integrated APIs, and ensured responsive design            |
| **Animesh**        | **Database Manager**                | Designed & managed database schema, optimized queries, ensured data consistency           |
| **Sagorika**        | **Deployment Engineer**             | Handled deployment on hosting platforms, configured environments, and maintained uptime   |
| **Tania**        | **Tester**                          | Tested workflows, identified bugs, ensured validation, and maintained quality             |

---
## Skills & Tools Used
<p align="left"> <img src="https://img.shields.io/badge/Frontend-React-blue?logo=react" /> <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwindcss" /> <img src="https://img.shields.io/badge/Backend-Node.js-green?logo=node.js" /> <img src="https://img.shields.io/badge/Framework-Express.js-black?logo=express" /> <img src="https://img.shields.io/badge/Database-MySQL-blue?logo=mysql" /> <img src="https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens" /> <img src="https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel" /> <img src="https://img.shields.io/badge/Deployment-Render-purple?logo=render" /> <img src="https://img.shields.io/badge/VersionControl-GitHub-black?logo=github" /> <img src="https://img.shields.io/badge/Testing-Postman-orange?logo=postman" /> </p>

## 📜 License

MIT License © 2025 Smart Materials Team

<p align="center">
  <img src="https://img.shields.io/badge/Powered%20By-%20Team%20Death%20Match%20(TDM)-red?style=for-the-badge&logo=rocket" />
</p>

