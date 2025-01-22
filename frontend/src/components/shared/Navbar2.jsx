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
      try {
        const response = await axios.get(`${MARKETER_API_END_POINT}/auth/status`, { withCredentials: true });
        setIsLoggedIn(response.data.loggedIn);
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${MARKETER_API_END_POINT}/auth/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav>
      <div>
        <Link to="/">MyApp</Link>

        <div>
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/posts">Posts</Link>
                </li>
                <li>
                  <Link to="/founder-profile/update">Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/founder/login">Login</Link>
                </li>
                <li>
                  <Link to="/founder/register">Signup</Link>
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