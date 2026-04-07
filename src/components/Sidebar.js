import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ role, userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const studentLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/student/submit', label: 'Submit Assignment', icon: '📤' },
    { path: '/student/grades', label: 'View Grades', icon: '📈' },
    { path: '/student/calendar', label: 'Academic Calendar', icon: '📅' }
  ];

  const teacherLinks = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/teacher/create', label: 'Create Assignment', icon: '➕' },
    { path: '/teacher/grade', label: 'Grade Submissions', icon: '✅' },
    { path: '/teacher/calendar', label: 'Academic Calendar', icon: '📅' }
  ];

  const links = role === 'student' ? studentLinks : teacherLinks;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>{role === 'student' ? '🧑🎓 Student Portal' : '👨🏫 Teacher Portal'}</h2>
        <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <p>👤 {userName}</p>
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={() => navigate('/profile')}>📋 Profile</div>
              <div className="dropdown-item" onClick={handleLogout}>🚪 Logout</div>
            </div>
          )}
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
