import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ViewGrades = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/submissions/student/${user.id}`);
        setGrades(res.data);
      } catch (err) {
        console.error("Error fetching grades", err);
      }
    };
    if (user.id) fetchGrades();
  }, [user.id]);

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" userName={user.name} />
      <div className="main-content">
        <Header title="My Grades" />
        <div className="content">
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Graded</h3>
              <div className="number">{grades.length}</div>
            </div>
            <div className="summary-card">
              <h3>Average Score</h3>
              <div className="number">
                {Math.round(grades.reduce((acc, g) => acc + g.marks, 0) / grades.length)}%
              </div>
            </div>
            <div className="summary-card">
              <h3>Highest Score</h3>
              <div className="number">{Math.max(...grades.map(g => g.marks))}%</div>
            </div>
          </div>

          <h2 className="mb-20">Grade Details</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Submitted</th>
                  <th>Marks</th>
                  <th>Feedback</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.id}>
                    <td>{grade.assignmentTitle}</td>
                    <td>{grade.submittedDate}</td>
                    <td>
                      <strong>{grade.marks !== null ? grade.marks : '-'}/{grade.maxMarks || 100}</strong>
                    </td>
                    <td>{grade.teacherFeedback || '-'}</td>
                    <td>
                      <span className="badge badge-graded">{grade.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGrades;
