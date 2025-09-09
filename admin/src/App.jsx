import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pageView, setPageView] = useState("main"); // main, adminLogin, adminRegister, dashboard
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("adminToken"));

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [ShowMaterials, setShowMaterials] = useState(false);
  const [AddMaterials, setAddMaterials] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null); // student being edited
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ std_id: "", std_name: "", std_email: "", std_ph_no: "", std_sem: "" });
  const [AllMaterials, setAllMaterials] = useState([]);
  const [selectedSem, setSelectedSem] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);



  const BASE_URL = "http://localhost:3001"; 
  // ✅ Restore login state on refresh
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAdmin(true);
      setPageView("dashboard"); // stay logged in
    }
  }, []);
  // ---------------- Admin Handlers ----------------
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (data.success) {
      localStorage.setItem("adminToken", data.token);
      setIsAdmin(true);
      setPageView("dashboard");
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }
    const res = await fetch(`${BASE_URL}/api/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (data.success) setPageView("adminLogin");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    setPageView("main");
  };

  // ---------------- Student CRUD ----------------
  const fetchStudents = async () => {
    const res = await fetch(`${BASE_URL}/api/admin/students`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    const data = await res.json();
    setStudents(data);

  };



  const addStudent = async (newStudent) => {
    await fetch(`${BASE_URL}/api/admin/add-student`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      body: JSON.stringify(newStudent),
    });
    fetchStudents();
  };

  const updateStudent = async (id, editingStudent) => {
    await fetch(`${BASE_URL}/api/admin/update-student/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      body: JSON.stringify(editingStudent),
    });
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    await fetch(`${BASE_URL}/api/admin/delete-student/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    });
    fetchStudents();
  };

  // ---------------- Materials CRUD ----------------
  const getAllMaterials = async (sem_no) => {
    const res = await fetch(`${BASE_URL}/api/admin/materials/${sem_no}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    const data = await res.json();
    setAllMaterials(data, sem_no);
  };

  const addMaterial = async (AddMaterials) => {
    await fetch(`${BASE_URL}/api/admin/add-material`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      body: JSON.stringify(AddMaterials),

    });
    getAllMaterials(AddMaterials.sem_no);
  };

  const fetchMaterials = async () => {
    const res = await fetch(`${BASE_URL}/api/materials`);
    const data = await res.json();
    setMaterials(data);
  };


  const updateMaterial = async (id, editingMaterial) => {
    await fetch(`${BASE_URL}/api/admin/update-material/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      body: JSON.stringify(editingMaterial),
    });
    getAllMaterials(editingMaterial.sem_no);
  };

  const deleteMaterial = async (selectedSem, id) => {

    await fetch(`${BASE_URL}/api/admin/delete-material/${selectedSem}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    });
    getAllMaterials(selectedSem);
  };


  // Fetch on dashboard load
  useEffect(() => {
    if (pageView === "dashboard") {
      fetchStudents();
      fetchMaterials();
    }
  }, [pageView]);

  // ---------------- UI Rendering ----------------
  switch (pageView) {
    case "main":
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
          {/* Card */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-96 text-center border border-gray-200">
            <h1 className="text-4xl font-extrabold mb-2 text-gray-800 tracking-wide">
              Welcome
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              Smart Materials Platform – Manage and Access with Ease
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setPageView("adminLogin")}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
              >
                Admin Login
              </button>
              <button
                onClick={() => setPageView("adminRegister")}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
              >
                Admin Register
              </button>
            </div>
          </div>
        </div>

      );

    case "adminLogin":
      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
          <form
            onSubmit={handleAdminLogin}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 space-y-5 border border-gray-200"
          >
            {/* Header */}
            <div className="flex flex-col items-center">
              <div className="bg-indigo-600 text-white p-3 rounded-full shadow-md mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.866-3.134 7-7 7H5a2 2 0 002 2h10a2 2 0 002-2h0c-3.866 0-7-3.134-7-7zM12 11V7m0 4a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">Admin Login</h2>
              <p className="text-sm text-gray-500 mt-1">
                Access your Smart Materials Dashboard
              </p>
            </div>

            {/* Inputs */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none transition"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none transition"
              required
            />

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
            >
              Login
            </button>

            {/* Message */}
            <p className="text-sm text-center text-red-500 font-medium">{message}</p>
          </form>
        </div>

      );

    case "adminRegister":
      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
          <form
            onSubmit={handleAdminRegister}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 space-y-5 border border-gray-200"
          >
            {/* Header */}
            <div className="flex flex-col items-center">
              <div className="bg-green-600 text-white p-3 rounded-full shadow-md mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V6m0 6v6" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">Admin Register</h2>
              <p className="text-sm text-gray-500 mt-1">
                Create your account to access Smart Materials
              </p>
            </div>

            {/* Inputs */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none transition"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none transition"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none transition"
              required
            />

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
            >
              Register
            </button>

            {/* Error Message */}
            <p className="text-sm text-center text-red-500 font-medium">{message}</p>
          </form>
        </div>

      );

    case "dashboard":
      return (

        <div className="min-h-screen bg-gray-100 p-8">
          {/* Header and Navigation */}
          <header className="w-full rounded-xl p-5 mb-8 bg-white/70 backdrop-blur-lg shadow-xl flex justify-between items-center z-20 border border-gray-200">
            {/* Logo + Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-2.5 rounded-full shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open h-6 w-6">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide hidden sm:block">
                Smart Materials
              </h1>
            </div>

            {/* Navigation */}
            <nav>
              <ul className="flex items-center space-x-5 sm:space-x-8 font-medium">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Admin Dashboard
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleAdminLogout}
                    className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </header>

          {/* Header and Navigation --------------------------*/}
          {/* Students Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
                  👨‍🎓
                </span>
                Students
              </h3>
              <button
                onClick={() => setShowAddStudent(true)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
              >
                + Add Student
              </button>

              {showAddStudent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                  <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 transform animate-popup">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="text-2xl font-bold text-indigo-700">Add New Student</h3>
                      <button
                        onClick={() => setShowAddStudent(false)}
                        className="text-gray-500 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await addStudent(newStudent);
                        setNewStudent({
                          std_id: "",
                          std_name: "",
                          std_email: "",
                          std_ph_no: "",
                          std_sem: "",
                        });
                        setShowAddStudent(false);
                      }}
                      className="space-y-3"
                    >
                      <input
                        type="text"
                        value={newStudent.std_id}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, std_id: e.target.value })
                        }
                        placeholder="Student Code"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />

                      <input
                        type="text"
                        value={newStudent.std_name}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, std_name: e.target.value })
                        }
                        placeholder="Name"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />

                      <input
                        type="email"
                        value={newStudent.std_email}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, std_email: e.target.value })
                        }
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />

                      <input
                        type="text"
                        value={newStudent.std_ph_no}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, std_ph_no: e.target.value })
                        }
                        placeholder="Phone Number"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />

                      <input
                        type="text"
                        value={newStudent.std_sem}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, std_sem: e.target.value })
                        }
                        placeholder="Semester"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />

                      {/* Buttons */}
                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowAddStudent(false)}
                          className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}



            </div>
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold">Student Code</th>
                    <th className="p-3 text-left text-sm font-semibold">Name</th>
                    <th className="p-3 text-left text-sm font-semibold">Email</th>
                    <th className="p-3 text-left text-sm font-semibold">Phone No.</th>
                    <th className="p-3 text-left text-sm font-semibold">Semester</th>
                    <th className="p-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {
                    students.map((s) => (
                      <tr key={s.id} className="hover:bg-indigo-50 transition duration-200 odd:bg-white even:bg-gray-50">
                        <td className="p-3 text-sm text-gray-700">{s.std_id}</td>
                        <td className="p-3 text-sm font-medium text-gray-800">{s.std_name}</td>
                        <td className="p-3 text-sm text-gray-700">{s.std_email}</td>
                        <td className="p-3 text-sm text-gray-700">{s.std_ph_no}</td>
                        <td className="p-3 text-sm text-gray-700">{s.std_sem}</td>
                        <td className="p-3 flex justify-center space-x-2">
                          <button
                            onClick={() => setEditingStudent(s)}
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600 transition"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteStudent(s.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {editingStudent && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 transform animate-popup">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="text-2xl font-bold text-indigo-700">Update Student</h3>
                  <button
                    onClick={() => setEditingStudent(null)}
                    className="text-gray-500 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await updateStudent(editingStudent.id, editingStudent);
                    setEditingStudent(null); // close modal

                  }}
                  className="space-y-3"
                >
                  {/* Hidden Student Code */}
                  <input
                    type="text"
                    value={editingStudent.studentCode || ""}
                    disabled
                    hidden
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />

                  <input
                    type="text"
                    value={editingStudent.std_name || ""}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, std_name: e.target.value })
                    }
                    placeholder="Name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />

                  <input
                    type="email"
                    value={editingStudent.std_email || ""}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, std_email: e.target.value })
                    }
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />

                  <input
                    type="text"
                    value={editingStudent.std_ph_no || ""}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, std_ph_no: e.target.value })
                    }
                    placeholder="Phone Number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />

                  <input
                    type="text"
                    value={editingStudent.std_sem || ""}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, std_sem: e.target.value })
                    }
                    placeholder="Semester"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}



          {/* Semesters Section */}
          <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 mt-8 border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
                  📚
                </span>
                Semesters
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"].map((sem, v) => (
                <button
                  key={sem}
                  value={v + 1}
                  onClick={(e) => {
                    getAllMaterials(e.target.value);
                    setSelectedSem(v + 1);
                  }}
                  className={`px-6 py-3 font-semibold rounded-xl shadow-md transition-all duration-200 
          ${selectedSem === v + 1
                      ? "bg-indigo-800 text-white scale-105 shadow-lg"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105"
                    }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>
          {AllMaterials && (
            <div className="bg-white shadow-md rounded-lg p-6 mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
                    📚
                  </span>
                  Materials of Semester
                </h3>
                <button
                  onClick={() => setShowMaterials(true)}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
                >
                  + Add Material
                </button>
              </div>
              {ShowMaterials && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                  <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 transform animate-popup">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="text-2xl font-bold text-indigo-700">Add New Material</h3>
                      <button
                        onClick={() => setShowMaterials(false)}
                        className="text-gray-500 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await addMaterial(AddMaterials);
                        setAddMaterials({
                          sem_no: "",
                          sub_name: "",
                          description: "",
                          type: "",
                          url: "",
                          dept_id: ""
                        });
                        setShowMaterials(false);
                      }}
                      className="space-y-3"
                    >
                      <input
                        type="text"
                        value={AddMaterials.sem_no}
                        onChange={(e) =>
                          setAddMaterials({ ...AddMaterials, sem_no: e.target.value })
                        }
                        placeholder="Semester Number"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                      <input
                        type="text"
                        value={AddMaterials.sub_name}
                        onChange={(e) =>
                          setAddMaterials({ ...AddMaterials, sub_name: e.target.value })
                        }
                        placeholder="Subject Name"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                      <textarea
                        value={AddMaterials.description}
                        onChange={(e) =>
                          setAddMaterials({ ...AddMaterials, description: e.target.value })
                        }
                        placeholder="Description"
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                      <input
                        type="text"
                        value={AddMaterials.type}
                        onChange={(e) =>
                          setAddMaterials({ ...AddMaterials, type: e.target.value })
                        }
                        placeholder="Type"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                      <input
                        type="text"
                        value={AddMaterials.url}
                        onChange={(e) =>
                          setAddMaterials({ ...AddMaterials, url: e.target.value })
                        }
                        placeholder="URL"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                      <input
                        type="text"
                        value={AddMaterials.dept_id}
                        onChange={(e) =>
                          setAddMaterials({ ...AddMaterials, dept_id: e.target.value })
                        }
                        placeholder="Department ID"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                        required
                      />

                      {/* Buttons */}
                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowMaterials(false)}
                          className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold">Id</th>
                      <th className="p-3 text-left text-sm font-semibold">Subject Name</th>
                      <th className="p-3 text-left text-sm font-semibold">Type</th>
                      <th className="p-3 text-left text-sm font-semibold">URL</th>
                      <th className="p-3 text-left text-sm font-semibold">Department</th>
                      <th className="p-3 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {AllMaterials.map((m, index) => (
                      <tr
                        key={m.id}
                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-indigo-50 transition`}
                      >
                        <td className="p-3 text-sm text-gray-700">{m.id}</td>
                        <td className="p-3 text-sm font-medium text-gray-800">{m.sub_name}</td>
                        <td className="p-3 text-sm text-gray-700">{m.type}</td>
                        <td className="p-3 text-sm">
                          <a
                            href={m.url}
                            className="text-indigo-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {m.url}
                          </a>
                        </td>
                        <td className="p-3 text-sm text-gray-700">{m.dept_name}</td>
                        <td className="p-3 flex justify-center space-x-2">
                          <button
                            onClick={() => setEditingMaterial(m)}
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600 transition"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => deleteMaterial(selectedSem, m.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {editingMaterial && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 transform animate-popup">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="text-2xl font-bold text-indigo-700">Update Material</h3>
                  <button
                    onClick={() => setEditingMaterial(null)}
                    className="text-gray-500 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await updateMaterial(editingMaterial.id, editingMaterial); // call your API
                    setEditingMaterial(null); // close modal
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={editingMaterial.sem_no || ""}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, sem_no: e.target.value })
                    }
                    placeholder="Semester Number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                  <input
                    type="text"
                    value={editingMaterial.sub_name || ""}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, sub_name: e.target.value })
                    }
                    placeholder="Subject Name"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                  <textarea
                    value={editingMaterial.description || ""}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, description: e.target.value })
                    }
                    placeholder="Description"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                  <input
                    type="text"
                    value={editingMaterial.type || ""}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, type: e.target.value })
                    }
                    placeholder="Type"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                  <input
                    type="text"
                    value={editingMaterial.url || ""}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, url: e.target.value })
                    }
                    placeholder="URL"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                  <input
                    type="text"
                    value={editingMaterial.dept_id || ""}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, dept_id: e.target.value })
                    }
                    placeholder="Department ID"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingMaterial(null)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="w-full max-auto p-4 mt-8 bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl text-center">
            <p className="text-gray-500 text-sm font-medium">© 2025 Smart Materials. All rights reserved.</p>
          </footer>

        </div>
      );

    default:
      return null;
  }
}

export default App;