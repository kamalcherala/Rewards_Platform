import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "src/styles/Dashboard.css";
function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    firstName: "",
    lastName: "",
    number: "",
    email: "",
    employeeId: "",
    salary: "",
    role: "",
    startDate: ""
  });
  const [blockEmployeeId, setBlockEmployeeId] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized or invalid token");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error("Fetch user error:", err);
        setError("Authentication error. Please log in again.");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(employeeData)
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
        
        
      }

      // Reset form and close modal
      setEmployeeData({
        firstName: "",
        lastName: "",
        number: "",
        email: "",
        employeeId: "",
        salary: "",
        role: "",
        startDate: ""
      });
      setShowAddModal(false);
      
      // Optionally refresh employee list here
    } catch (err) {
      console.error('Error adding employee:', err);
    }
  };

  const handleBlockEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employees/${blockEmployeeId}/block`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to block employee');
      }

      setBlockEmployeeId("");
      setShowBlockModal(false);
      
      // Optionally refresh employee list here
    } catch (err) {
      console.error('Error blocking employee:', err);
    }
  };

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="dashboard-error"
      >
        <h2>{error}</h2>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="dashboard-loading"
      >
        <div className="loader"></div>
        <p>Loading...</p>
      </motion.div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/dealzy-logo.svg" alt="dealzy 2.0" className="logo-img" />
          <h2>dealzy 2.0</h2>
        </div>
        <nav>
          <ul>
            <motion.li 
              whileHover={{ x: 10 }}
              className="active"
            >
              <span className="icon">📊</span>
              <span>Dashboard</span>
            </motion.li>
            <motion.li whileHover={{ x: 10 }}>
              <span className="icon">✅</span>
              <span>Tasks</span>
            </motion.li>
            <motion.li whileHover={{ x: 10 }}>
              <span className="icon">👥</span>
              <span>Team</span>
            </motion.li>
            <motion.li whileHover={{ x: 10 }}>
              <span className="icon">🗓️</span>
              <span>Calendar</span>
            </motion.li>
            <motion.li whileHover={{ x: 10 }}>
              <span className="icon">✉️</span>
              <span>Messages</span>
            </motion.li>
            <motion.li whileHover={{ x: 10 }}>
              <span className="icon">⚙️</span>
              <span>Settings</span>
            </motion.li>
            <motion.li whileHover={{ x: 10 }}>
              <span className="icon">❓</span>
              <span>Support</span>
            </motion.li>
            <motion.li 
              whileHover={{ x: 10 }}
              className="logout" 
              onClick={handleLogout}
            >
              <span className="icon">🚪</span>
              <span>Logout</span>
            </motion.li>
          </ul>
        </nav>
        <div className="assessment-timer">
          <p>Ready for next assessments?</p>
          <div className="timer">
            <div className="time-block">
              <span>0</span>
              <small>Days</small>
            </div>
            <div className="time-block">
              <span>8</span>
              <small>Hours</small>
            </div>
            <div className="time-block">
              <span>15</span>
              <small>Minutes</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="welcome-text">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Hello {user.name}!
            </motion.h2>
            <p>Welcome back, Have a Good day.</p>
          </div>
          
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button className="search-btn">🔍</button>
          </div>
          
          <div className="actions">
            <button className="notification-btn">
              🔔
              <span className="badge">3</span>
            </button>
            <div className="profile">
              <img src="https://via.placeholder.com/40" alt="Profile" className="avatar" />
              <div className="profile-info">
                <span>{user.name}</span>
                <small>Admin</small>
              </div>
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total employee</h3>
              <p>400</p>
            </div>
            <div className="stat-graph">
              <div className="bar-chart">
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '80%' }}></div>
                <div className="bar" style={{ height: '40%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon new-icon">➕</div>
            <div className="stat-info">
              <h3>New Joiners</h3>
              <p>45</p>
            </div>
            <div className="stat-graph">
              <div className="line-chart">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path d="M0,50 L20,35 L40,40 L60,20 L80,25 L100,10" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="stat-icon leave-icon">➖</div>
            <div className="stat-info">
              <h3>Departures</h3>
              <p>12</p>
            </div>
            <div className="stat-graph">
              <div className="donut-chart">
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="circle-bg" />
                  <circle cx="18" cy="18" r="16" fill="none" className="circle-progress" strokeDashoffset="25" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="admin-actions">
          <motion.button 
            className="add-employee-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
          >
            <span className="icon">+</span> Add Employee
          </motion.button>
          
          <motion.button 
            className="block-employee-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBlockModal(true)}
          >
            <span className="icon">⛔</span> Block Employee
          </motion.button>
        </div>

        <div className="dashboard-grid">
          <motion.section 
            className="employee-performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="section-header">
              <h3>Performance Listed</h3>
              <button className="filter-btn">Filter</button>
            </div>
            <div className="employees-table">
              <table>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Age</th>
                    <th>Department</th>
                    <th>Project</th>
                    <th>Salary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">P</div>
                        <span>Employee1</span>
                      </div>
                    </td>
                    <td>30</td>
                    <td>Tech Team</td>
                    <td>30</td>
                    <td>150,000</td>
                    <td><span className="status active">Active</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">A</div>
                        <span>Employee2</span>
                      </div>
                    </td>
                    <td>28</td>
                    <td>Finance Department</td>
                    <td>24</td>
                    <td>80,000</td>
                    <td><span className="status active">Active</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">L</div>
                        <span>Employee3</span>
                      </div>
                    </td>
                    <td>26</td>
                    <td>Sales Department</td>
                    <td>22</td>
                    <td>50,000</td>
                    <td><span className="status inactive">Blocked</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">J</div>
                        <span>Employee4</span>
                      </div>
                    </td>
                    <td>29</td>
                    <td>Finance Department</td>
                    <td>28</td>
                    <td>75,000</td>
                    <td><span className="status active">Active</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.section>

          <div className="charts-row">
            <motion.section 
              className="employee-chart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3>Employee Distribution</h3>
              <div className="pie-chart">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="pie-segment segment-1" />
                  <circle cx="50" cy="50" r="40" className="pie-segment segment-2" />
                  <circle cx="50" cy="50" r="40" className="pie-segment segment-3" />
                </svg>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="color-box full-time"></span>
                    <span>Full-Time (400)</span>
                  </div>
                  <div className="legend-item">
                    <span className="color-box part-time"></span>
                    <span>Part-Time (200)</span>
                  </div>
                  <div className="legend-item">
                    <span className="color-box internship"></span>
                    <span>Internship (100)</span>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section 
              className="trend-chart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3>Growth Trend</h3>
              <div className="line-graph">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path className="line-1" d="M0,40 L10,38 L20,35 L30,30 L40,32 L50,25 L60,20 L70,15 L80,18 L90,10 L100,5" />
                  <path className="line-2" d="M0,45 L10,42 L20,44 L30,38 L40,36 L50,40 L60,35 L70,30 L80,32 L90,25 L100,20" />
                </svg>
                <div className="axis-labels x-axis">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                </div>
                <div className="axis-labels y-axis">
                  <span>100,000</span>
                  <span>50,000</span>
                  <span>0</span>
                </div>
              </div>
            </motion.section>
          </div>

          <motion.section 
            className="activity-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="section-header">
              <h3>Recent Activity</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="activity-list">
              {["Team meeting scheduled", "Project deadline updated", "New employee orientation", "Performance review completed", "Budget approval pending"].map((activity, i) => (
                <motion.div 
                  key={i} 
                  className="activity-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div className="activity-dot"></div>
                  <p>{activity}</p>
                  <span className="activity-time">{i + 1}h ago</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      {/* Add Employee Modal */}
      {/* Add Employee Modal */}
 {/* Add Employee Modal */}
 <AnimatePresence>
        {showAddModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content big-modal" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <div className="modal-header">
                <h3>Add New Employee</h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <form className="modal-form" onSubmit={handleAddEmployee}>
                <div className="modal-body">
                  <div className="modal-photo">
                    <label className="photo-upload">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="photo-preview" />
                      ) : (
                        <div className="photo-placeholder">Upload Photo</div>
                      )}
                      <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                      <button type="button" className="upload-btn">Upload Photo</button>
                    </label>
                  </div>
                  <div className="modal-fields">
                    <div className="field-group">
                      <input type="text" name="firstName" placeholder="First Name" value={employeeData.firstName} onChange={handleInputChange} required />
                      <input type="text" name="lastName" placeholder="Last Name" value={employeeData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="field-group">
                      <input type="email" name="email" placeholder="Email" value={employeeData.email} onChange={handleInputChange} required />
                      <input type="text" name="employeeId" placeholder="Employee ID" value={employeeData.employeeId} onChange={handleInputChange} required />
                    </div>
                    <div className="field-group">
                      <input type="text" name="number" placeholder="Phone Number" value={employeeData.number} onChange={handleInputChange} required />
                      <input type="text" name="salary" placeholder="Salary" value={employeeData.salary} onChange={handleInputChange} required />
                    </div>
                    <div className="field-group">
                      <input type="text" name="role" placeholder="Role" value={employeeData.role} onChange={handleInputChange} required />
                      <input type="date" name="startDate" value={employeeData.startDate} onChange={handleInputChange} required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">Create Employee</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block Employee Modal */}
      <AnimatePresence>
        {showBlockModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content small-modal" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <div className="modal-header">
                <h3>Block Employee</h3>
                <button className="close-btn" onClick={() => setShowBlockModal(false)}>×</button>
              </div>
              <form onSubmit={handleBlockEmployee}>
                <input type="text" placeholder="Employee ID" value={blockEmployeeId} onChange={e => setBlockEmployeeId(e.target.value)} required />
                <textarea placeholder="Reason for Blocking" required></textarea>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowBlockModal(false)}>Cancel</button>
                  <button type="submit" className="block-btn">Block</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Dashboard;
