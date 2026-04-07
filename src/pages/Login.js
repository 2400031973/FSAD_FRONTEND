import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  const navigate = useNavigate();

  // ✅ CAPTCHA GENERATION
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // ✅ CONNECTED LOGIN TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (captchaInput !== captcha) {
      setError('Invalid CAPTCHA');
      generateCaptcha();
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password
      });

      if (res.data && res.data.id) {
        localStorage.setItem("user", JSON.stringify(res.data));

        if (res.data.role === "student") {
          navigate("/student/dashboard");
        } else {
          navigate("/teacher/dashboard");
        }
      } else {
        setError("Invalid credentials");
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* CAPTCHA */}
          <div className="form-group">
            <label>CAPTCHA</label>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ background: "#ccc", padding: "10px" }}>{captcha}</div>
              <button type="button" onClick={generateCaptcha}>🔄</button>
            </div>

            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Enter CAPTCHA"
              required
            />
          </div>

          {/* ROLE */}
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>

        </form>

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;