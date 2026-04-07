import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from '../config/apiConfig';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const SubmitAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const submission = location.state?.submission;
  const assignment = location.state?.assignment;

  const [file, setFile] = useState(submission ? { name: submission.fileUrl } : null);
  const [comments, setComments] = useState(submission ? submission.feedback || '' : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (submission) {
        await axios.put(`${API_BASE_URL}/api/submissions/${submission.id}`, {
          fileUrl: file ? file.name : "no-file",
          feedback: comments,
          status: "Pending"
        });
        alert("Assignment updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/submissions`, {
          assignmentId: assignment?.id,
          studentId: user.id,
          fileUrl: file ? file.name : "no-file",
          feedback: comments,
          status: "Pending"
        });
        alert("Assignment submitted successfully!");
      }
      navigate('/student/dashboard');
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "Error submitting assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="student" userName={user.name} />
      <div className="main-content">
        <Header title="Submit Assignment" />
        <div className="content">
          <div className="form-container">
            <h2>{assignment?.title || 'Submit Assignment'}</h2>
            {error && <div className="error-message">{error}</div>}
            {assignment && (
              <div className="mb-20">
                <p><strong>Description:</strong> {assignment.description}</p>
                <p><strong>Due Date:</strong> {assignment.deadline}</p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Upload File</label>
                <div className="file-upload" onClick={() => document.getElementById('file-input').click()}>
                  <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    required
                  />
                  <label htmlFor="file-input" className="file-upload-label">
                    {file ? file.name : 'Click to upload file'}
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Comments (Optional)</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add any comments for your teacher"
                  rows="4"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : submission ? 'Update Submission' : 'Submit Assignment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitAssignment;
