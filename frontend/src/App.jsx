import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import "src/styles/App.css";

function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Dealzy 2.0</div>
        <div className="nav-links">
          <a href="#">Solutions</a>
          <a href="#">Clients</a>
          <a href="#">Resources</a>
          <a href="#">Pricing</a>
          <a href="#">Company</a>
        </div>
        <div className="nav-actions">
          <button className="nav-btn">Register</button>
          <button className="nav-btn">Request a Demo</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Transform your workplace into a hub of appreciation.</h1>
        <p>
          <strong>Reward. Recognize. Retain.</strong>
        </p>
        <div className="hero-buttons">
          <button className="primary-btn">Get Started</button>
          <button className="secondary-btn">Watch Video</button>
        </div>
      </header>

      {/* Who Are You Section */}
      <section className="who-are-you">
        <h2>Who are you...</h2>
        <div className="user-cards">
          {[
            {
              title: "Consumer",
              desc: "Enhance your workplace well-being with personalized meal benefits.",
              bg: "green",
              link: "/login",
            },
            {
              title: "Client",
              desc: "Empower employees with unmatched benefits and rewards.",
              bg: "blue",
              link: "/login",
            },
            {
              title: "Merchant",
              desc: "Partner with us & grow with access to our 3.5M+ consumers.",
              bg: "brown",
              link: "/login",
            },
          ].map(({ title, desc, bg, link }) => (
            <div className={`card ${bg}`} key={title}>
              <h3>{title}</h3>
              <p>{desc}</p>
              <Link to={link}>
                <button className="card-btn black">Login</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
