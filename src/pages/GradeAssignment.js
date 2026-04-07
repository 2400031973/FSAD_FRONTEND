import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const GradeAssignment = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const assignment = location.state?.assignment;

  const [submissions, setSubmissions] = useState([]);

  const fetchSubmissions = async () => {
    if (!assignment?.id) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/submissions/assignment/${assignment.id}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignment?.id]);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleGrade = (submission) => {
    setSelectedSubmission(submission);
    setMarks('');
    setFeedback('');
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/submissions/${selectedSubmission.id}/grade`, {
        marks,
        feedback
      });
      alert(`Grade submitted for ${selectedSubmission.studentName}`);
      setSelectedSubmission(null);
      setMarks('');
      setFeedback('');
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      alert('Error submitting grade');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="teacher" userName={user.name} />
      <div className="main-content">
        <Header title="Grade Submissions" />

        <div className="content">
          <h2 className="mb-20">
            {assignment?.title || 'Assignment Submissions'}
          </h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Submitted Date</th>
                  <th>File</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.studentName}</td>
                    <td>{submission.submittedDate}</td>
                    <td>{submission.fileUrl || 'N/A'}</td>
                    <td>
                      <span
                        className={`badge badge-${submission.status.toLowerCase()}`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleGrade(submission)}
                      >
                        Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedSubmission && (
            <div className="form-container mt-20">
              <h2>
                Grade Submission – {selectedSubmission.studentName}
              </h2>

              <form onSubmit={handleSubmitGrade}>
                <div className="form-group">
                  <label>Marks</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder="Enter marks"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback for student"
                    rows="4"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-secondary">
                  Submit Grade
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeAssignment;
