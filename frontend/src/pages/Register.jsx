import React, { useState } from "react";
import "@/styles/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      console.log('Sending registration request to:', `${import.meta.env.VITE_API_URL}/api/auth/register`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "/login"; // Automatically redirect to login page
      } else {
        console.error("Registration failed:", data.message);
        alert(data.message || "Registration failed!");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <h1>Dealzy 2.0</h1>
      </div>
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="register-btn">
              Submit
            </button>
          </div>
        </form>
        <p>
          Already have an account?{" "}
          <a href="/login" className="login-link">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;