import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from '../config/apiConfig';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Card from '../components/Card';
import RecentlyAccessed from '../components/RecentlyAccessed';
import AssignmentTimeline from '../components/AssignmentTimeline';
import Calendar from '../components/Calendar';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        const [assignRes, subRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/assignments`),
          axios.get(`${API_BASE_URL}/api/submissions/student/${user.id}`).catch(() => ({ data: [] }))
        ]);
        
        const augmentedAssignments = assignRes.data.map(assignment => {
          const submission = subRes.data.find(s => s.assignmentId === assignment.id);
          let status = "Not Submitted"; 
          if (submission) {
            status = submission.status === "Pending" ? "Submitted (Pending Grade)" : "Graded";
          }
          return { ...assignment, status, submission };
        });

        setAssignments(augmentedAssignments);
        setSubmissions(subRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" userName={user.name} />
      <div className="main-content">
        <Header title="Student Dashboard" />
        <div className="content">
          <h2 className="mb-20">My Assignments</h2>
          <div className="cards-grid">
            {loading ? (
              <p>Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <p>No assignments available yet.</p>
            ) : (
              assignments.map((assignment) => {
                const submission = assignment.submission;
                return (
                  <Card
                    key={assignment.id}
                    title={assignment.title}
                    description={assignment.description}
                    dueDate={assignment.deadline}
                    status={assignment.status}
                    actions={
                      <>
                        {!submission && (
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate('/student/submit', { state: { assignment } })}
                          >
                            Submit
                          </button>
                        )}
                        {submission && submission.status === "Pending" && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/student/submit', { state: { assignment, submission } })}
                          >
                            Edit Submission
                          </button>
                        )}
                        {submission && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/student/grades')}
                          >
                            View Grade
                          </button>
                        )}
                      </>
                    }
                  />
                );
              })
            )}
          </div>
          <RecentlyAccessed assignments={assignments} />
          <AssignmentTimeline assignments={assignments} />
          <Calendar assignments={assignments} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
