import React from "react";
import "../styles/Login.css";

function Login() {
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
            <input type="password" placeholder="Enter your password" />
          </div>
          <div className="form-actions">
            <button type="submit" className="login-btn">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;