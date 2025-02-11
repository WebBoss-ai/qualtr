import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if the user is already logged in via Google on component mount
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const res = await axios.get(`${MARKETER_API_END_POINT}/auth/session`, { withCredentials: true });
        if (res.data.user) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userId', res.data.user._id);
          navigate(res.data.redirectPath || '/dashboard'); // Redirect to dashboard or stored path
        }
      } catch (error) {
        console.log('No active session:', error);
      }
    };

    fetchUserSession();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${MARKETER_API_END_POINT}/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user._id);
      alert('Login successful');
      navigate(res.data.redirectPath || '/dashboard');
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Clear any stored session before redirecting
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = `${MARKETER_API_END_POINT}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-t-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-600 focus:border-gray-600 sm:text-sm pl-10"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-600 focus:border-gray-600 sm:text-sm pl-10"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-all duration-300 ease-in-out ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              disabled={isLoading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-800 group-hover:text-gray-600" aria-hidden="true" />
              </span>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 ease-in-out"
          >
            Sign in with Google
          </button>
        </div>

        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800 transition-all duration-300">
            Forgot your password?
          </a>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/founder/register" className="text-gray-600 hover:text-gray-800 transition-all duration-300">
              Register here
            </a>
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .max-w-md {
          animation: fadeIn 0.5s ease-out;
        }
        input:focus {
          transition: all 0.3s ease;
        }
        button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default MarketerLogin;
