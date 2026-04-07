import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";   // ✅ ADDED
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ✅ CONNECTED TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (submission) {
        // Edit mode
        await axios.put(`http://localhost:8080/api/submissions/${submission.id}`, {
          fileUrl: file ? file.name : "no-file",
          feedback: comments
        });
        alert("Assignment updated successfully!");
      } else {
        // Create mode
        await axios.post("http://localhost:8080/api/submissions", {
          assignmentId: assignment?.id,
          studentId: user.id,
          fileUrl: file ? file.name : "no-file",
          feedback: comments
        });
        alert("Assignment submitted successfully!");
      }
      navigate('/student/dashboard');

    } catch (error) {
      console.error(error);
      alert("Error submitting assignment");
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

            {assignment && (
              <div className="mb-20">
                <p><strong>Description:</strong> {assignment.description}</p>
                <p><strong>Due Date:</strong> {assignment.deadline}</p> {/* ⚠️ fixed */}
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

              <button type="submit" className="btn btn-primary">
                Submit Assignment
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitAssignment;