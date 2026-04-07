import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const GradeAssignment = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const routeAssignment = location.state?.assignment;

  const [assignments, setAssignments] = useState([]);
  const [assignment, setAssignment] = useState(routeAssignment || null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/assignments`);
        setAssignments(res.data || []);
        if (routeAssignment?.id) {
          setAssignment(routeAssignment);
          await fetchSubmissions(routeAssignment.id);
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [routeAssignment]);

  const fetchSubmissions = async (assignmentId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/submissions/assignment/${assignmentId}`);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Error fetching submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentChange = (e) => {
    const selected = assignments.find((a) => String(a.id) === e.target.value);
    setAssignment(selected || null);
    setSelectedSubmission(null);
    setSubmissions([]);
    if (selected?.id) {
      fetchSubmissions(selected.id);
    }
  };

  const handleGrade = (submission) => {
    setSelectedSubmission(submission);
    setMarks(submission.marks ?? '');
    setFeedback(submission.teacherFeedback ?? '');
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) {
      setError('Please select a submission to grade.');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/api/submissions/${selectedSubmission.id}/grade`, {
        marks: parseInt(marks, 10) || 0,
        teacherFeedback: feedback,
        status: 'Graded',
      });
      alert('Grade submitted successfully');
      setSelectedSubmission(null);
      setMarks('');
      setFeedback('');
      if (assignment?.id) {
        fetchSubmissions(assignment.id);
      }
    } catch (err) {
      console.error(err);
      setError('Error submitting grade');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="teacher" userName={user.name} />
      <div className="main-content">
        <Header title="Grade Submissions" />
        <div className="content">
          <h2 className="mb-20">Grade Submissions</h2>

          {error && <div className="error-message">{error}</div>}

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="assignment-select">Choose Assignment:</label>
            <select
              id="assignment-select"
              value={assignment?.id || ''}
              onChange={handleAssignmentChange}
              style={{ padding: '8px', fontSize: '16px', marginLeft: '10px' }}
            >
              <option value="">-- Select an Assignment --</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} (ID: {a.id})
                </option>
              ))}
            </select>
          </div>

          {!assignment ? (
            <p>Please select an assignment to see submissions.</p>
          ) : (
            <>
              <h3>{assignment.title}</h3>
              <div className="table-container">
                {loading ? (
                  <p>Loading submissions...</p>
                ) : submissions.length === 0 ? (
                  <p>No submissions yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Status</th>
                        <th>Marks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => (
                        <tr key={submission.id}>
                          <td>{submission.studentId}</td>
                          <td>{submission.status}</td>
                          <td>{submission.marks ?? '-'}</td>
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
                )}
              </div>

              {selectedSubmission && (
                <div className="form-container">
                  <h3>Grade Submission</h3>
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
                        placeholder="Enter feedback"
                        rows="4"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Grade
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedSubmission(null)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeAssignment;
