import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "src/styles/Login.css";
import { useAuth } from "../context/AuthContext";
console.log("API:", import.meta.env.VITE_API_URL);


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending login request to /api/auth/login with:", {
        email: trimmedEmail,
      });
    
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login failed:", response.status, errorText);
        
        try {
          // Try to parse as JSON if possible
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Login failed");
        } catch (jsonError) {
          // If parsing fails, use status text
          throw new Error(`Login failed: ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        login(data.user, data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <h1>Dealzy 2.0</h1>
      </div>

      <div className="login-container">
        <h2>Welcome To the Website</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <div className="form-actions">
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="signup-link">
            Don't have an Account? <Link to="/register">Register</Link>
          </div>

          <div className="social-login">
            <button className="google-login" type="button">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw3LcV3idrkKVHSEdUcJCxHawvIUzufH5AmA&s"
                alt="Google Icon"
                className="google-icon"
              />
              Login with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;