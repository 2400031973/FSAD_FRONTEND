import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ViewGrades = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrades = async () => {
      if (!user || !user.id) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/submissions/student/${user.id}`);
        setGrades(res.data || []);
        setError('');
      } catch (err) {
        console.error("Error fetching grades", err);
        setError('Error fetching grades or no submissions found');
        setGrades([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [user.id]);

  const gradedCount = grades.filter(g => g.status === 'Graded').length;
  const avgScore = grades.length > 0 ? Math.round(grades.reduce((acc, g) => acc + (g.marks || 0), 0) / grades.length) : 0;
  const maxScore = grades.length > 0 ? Math.max(...grades.map(g => g.marks || 0)) : 0;

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" userName={user.name} />
      <div className="main-content">
        <Header title="My Grades" />
        <div className="content">
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Graded</h3>
              <div className="number">{gradedCount}</div>
            </div>
            <div className="summary-card">
              <h3>Average Score</h3>
              <div className="number">{avgScore}%</div>
            </div>
            <div className="summary-card">
              <h3>Highest Score</h3>
              <div className="number">{maxScore}%</div>
            </div>
          </div>

          <h2 className="mb-20">Grade Details</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="table-container">
            {loading ? (
              <p>Loading grades...</p>
            ) : grades.length === 0 ? (
              <p>No submissions yet. Submit assignments to see grades here.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Assignment ID</th>
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id}>
                      <td>{grade.assignmentId}</td>
                      <td>{grade.status}</td>
                      <td>{grade.marks !== null ? grade.marks : '-'}</td>
                      <td>{grade.teacherFeedback || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGrades;
