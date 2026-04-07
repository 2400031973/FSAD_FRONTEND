import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from '../config/apiConfig';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Card from '../components/Card';
import Calendar from '../components/Calendar';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/assignments`);
        setAssignments(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
          <div className="cards-grid">
            {loading ? (
              <p>Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <p>No assignments created yet.</p>
            ) : (
              assignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  title={assignment.title}
                  description={assignment.description}
                  dueDate={assignment.deadline}
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
              ))
            )}
          </div>

          <Calendar assignments={assignments} />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;