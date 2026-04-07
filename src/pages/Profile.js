import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [name, setName] = useState(user.name || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { id: user.id };
      if (name) payload.name = name;
      if (password) payload.password = password;

      const res = await axios.put(`http://localhost:8080/api/users/${user.id}`, payload);
      
      // Update local storage user data
      const updatedUser = { ...user, name: res.data.name };
      if (res.data.password) {
        updatedUser.password = res.data.password;
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully!');
      setPassword(''); // clear password field
    } catch (error) {
      console.error(error);
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={user.role} userName={name || user.name} />
      <div className="main-content">
        <Header title="My Profile" />

        <div className="content">
          <div className="form-container">
            <h2>Edit Profile</h2>
            {message && <div style={{ marginBottom: "15px", color: message.includes('failed') ? 'red' : 'green' }}>{message}</div>}

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label>Email (Read-only)</label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>New Password (Optional)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a new password"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
