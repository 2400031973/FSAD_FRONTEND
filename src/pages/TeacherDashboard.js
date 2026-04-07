import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";   // ✅ ADDED
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Card from '../components/Card';
import Calendar from '../components/Calendar';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ❌ REMOVE static data
  // ✅ USE backend data
  const [assignments, setAssignments] = useState([]);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/assignments");
        setAssignments(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar role="teacher" userName={user.name} />

      <div className="main-content">
        <Header title="Teacher Dashboard" />

        <div className="content">

          {/* 🔥 SUMMARY (DYNAMIC OPTIONAL) */}
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Assignments</h3>
              <div className="number">{assignments.length}</div>
            </div>
            <div className="summary-card">
              <h3>Pending Reviews</h3>
              <div className="number">{assignments.length}</div>
            </div>
            <div className="summary-card">
              <h3>Total Students</h3>
              <div className="number">--</div>
            </div>
            <div className="summary-card">
              <h3>Graded This Week</h3>
              <div className="number">--</div>
            </div>
          </div>

          <h2 className="mb-20">Active Assignments</h2>

          {/* 🔥 DISPLAY FROM BACKEND */}
          <div className="cards-grid">
            {assignments.map((assignment) => (
              <Card
                key={assignment.id}
                title={assignment.title}
                description={assignment.description}
                dueDate={assignment.deadline}   // ⚠️ backend uses deadline
                actions={
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/teacher/grade', { state: { assignment } })}
                    >
                      Grade
                    </button>
                  </>
                }
              />
            ))}
          </div>

          {/* 🔥 CALENDAR */}
          <Calendar assignments={assignments} />

        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;