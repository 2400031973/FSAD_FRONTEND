import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";   // ✅ ADDED
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Card from '../components/Card';
import RecentlyAccessed from '../components/RecentlyAccessed';
import AssignmentTimeline from '../components/AssignmentTimeline';
import Calendar from '../components/Calendar';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ❌ REMOVE static data
  // ✅ USE backend data
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, subRes] = await Promise.all([
          axios.get("https://backend-fsad-production.up.railway.app/api/assignments"),
          axios.get(`https://backend-fsad-production.up.railway.app/api/submissions/student/${user.id}`)
        ]);
        
        const augmentedAssignments = assignRes.data.map(assignment => {
          const submission = subRes.data.find(s => s.assignmentId === assignment.id);
          // If no submission, student needs to submit ('Pending' matches default state logic)
          let status = "Pending"; 
          if (submission) {
             status = submission.status === "Pending" ? "Submitted (Pending Grade)" : "Graded";
          }
          return { ...assignment, status, submission };
        });

        setAssignments(augmentedAssignments);
        setSubmissions(subRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    if (user.id) fetchData();
  }, [user.id]);

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" userName={user.name} />

      <div className="main-content">
        <Header title="Student Dashboard" />

        <div className="content">
          <h2 className="mb-20">My Assignments</h2>

          {/* 🔥 DISPLAY FROM BACKEND */}
          <div className="cards-grid">
            {assignments.map((assignment) => {
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

                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate('/student/grades')}
                    >
                      View Grade
                    </button>
                  </>
                }
              />
              );
            })}
          </div>

          {/* 🔥 OTHER COMPONENTS */}
          <RecentlyAccessed assignments={assignments} />
          <AssignmentTimeline assignments={assignments} />
          <Calendar assignments={assignments} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
