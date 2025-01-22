import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';

const Navbar2 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check user login status on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log("Checking login status..."); // Debug: Start of login status check
      try {
        const response = await axios.get(`${MARKETER_API_END_POINT}/auth/status`, { withCredentials: true });
        console.log("Login status response:", response.data); // Debug: Log API response

        if (response.data.loggedIn) {
          console.log("User is logged in."); // Debug: User is authenticated
          setIsLoggedIn(true);
        } else {
          console.log("User is not logged in."); // Debug: User is not authenticated
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error); // Debug: Log errors
      } finally {
        console.log("Finished checking login status."); // Debug: End of login status check
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    console.log("Logging out..."); // Debug: Start of logout
    try {
      const response = await axios.post(`${MARKETER_API_END_POINT}/auth/logout`, {}, { withCredentials: true });
      console.log("Logout response:", response.data); // Debug: Log logout API response

      setIsLoggedIn(false);
      console.log("User logged out successfully."); // Debug: Logout successful
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error("Error logging out:", error); // Debug: Log logout errors
    }
  };

  if (loading) {
    console.log("Navbar is loading..."); // Debug: Loading state
    return <div>Loading...</div>;
  }

  console.log("Navbar rendered. User logged in:", isLoggedIn); // Debug: Log render and login status

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">MyApp</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;