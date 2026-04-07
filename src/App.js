import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateAssignment from './pages/CreateAssignment';
import SubmitAssignment from './pages/SubmitAssignment';
import GradeAssignment from './pages/GradeAssignment';
import ViewGrades from './pages/ViewGrades';
import AcademicCalendarPage from './pages/AcademicCalendarPage';
import TeacherAcademicCalendarPage from './pages/TeacherAcademicCalendarPage';
import Profile from './pages/Profile';
import './style.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/submit" element={<SubmitAssignment />} />
        <Route path="/student/grades" element={<ViewGrades />} />
        <Route path="/student/calendar" element={<AcademicCalendarPage />} />
        
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/create" element={<CreateAssignment />} />
        <Route path="/teacher/grade" element={<GradeAssignment />} />
        <Route path="/teacher/calendar" element={<TeacherAcademicCalendarPage />} />

        {/* PROFILE (Common) */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
