import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "src/styles/Login.css";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Get API URL with fallback
  const getApiUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.warn("VITE_API_URL not found, using localhost");
      return "http://localhost:5000";
    }
    return apiUrl.trim(); // Remove any extra spaces
  };

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
    const apiUrl = getApiUrl();

    try {
      console.log("Sending login request to:", `${apiUrl}/api/auth/login`);
      console.log("Email:", trimmedEmail);
    
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      // Check if the response is ok
      if (!response.ok) {
        let errorMessage = "Login failed";
        
        try {
          const errorText = await response.text();
          console.error("Login failed:", response.status, errorText);
          
          // Try to parse as JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If not JSON, use status text
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
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
      
      // Handle different types of errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else if (err.message.includes('NetworkError') || err.message.includes('CORS')) {
        setError("Network error. Please try again later.");
      } else {
        setError(err.message || "An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = getApiUrl();
    console.log("Redirecting to Google OAuth:", `${apiUrl}/api/auth/google`);
    window.location.href = `${apiUrl}/api/auth/google`;
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
            <button
              className="google-login"
              type="button"
              onClick={handleGoogleLogin}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw3LcV3idrkKVHSEdUcJCxHawvIUzufH5AmA&s"
                alt="Google Icon"
                className="google-icon"
              />
              Login with Google
            </button>
          </div>
        </form>

        {/* Debug info (remove in production) */}
        {import.meta.env.DEV && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
            <strong>Debug Info:</strong><br />
            API URL: {getApiUrl()}<br />
            Environment: {import.meta.env.MODE}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
