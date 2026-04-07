import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from '../config/apiConfig';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const CreateAssignment = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/assignments`, {
        title: title,
        description: description,
        deadline: dueDate,
        createdBy: user.id || 1,
        maxMarks: parseInt(maxMarks) || 0
      });

      console.log(res.data);
      alert("Assignment created successfully!");
      navigate('/teacher/dashboard');
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "Error creating assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="teacher" userName={user.name} />
      <div className="main-content">
        <Header title="Create Assignment" />
        <div className="content">
          <div className="form-container">
            <h2>New Assignment</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Assignment Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter assignment title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter assignment description"
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Maximum Marks</label>
                <input
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  placeholder="Enter maximum marks"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
