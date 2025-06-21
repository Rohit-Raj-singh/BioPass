import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home"; // Adjust the path if Home.jsx is in a different folder
import StudentLogin from "./components/studentLogin/StudentLogin";
import StudentDashboard from "./components/studentDashboard/StudentDashboard";
import AdminLogin from "./components/adminLogin/AdminLogin";
import AdminDashboard from "./components/adminDashboard/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/contact-admin" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/contact-support"t={<Home />} />
        <Route path="/forgot-password" element={<Home />} />

       
      </Routes>
    </Router>
  );
}

export default App;

