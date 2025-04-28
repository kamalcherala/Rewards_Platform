import React, { useState } from "react";
import "src/styles/Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      {/* Upper part with Dealzy 2.0 */}
      <div className="login-header">
        <h1>Dealzy 2.0</h1>
      </div>

      {/* Login form */}
      <div className="login-container">
        <h2>Welcome To the Website</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <form>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter your username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>
          <div className="form-actions">
            <button type="submit" className="login-btn">Login</button>
          </div>
          <div className="signup-link">
            Don't have an Account? <a href="#">Sign up</a>
          </div>
          <div className="social-login">
            <button className="google-login">
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