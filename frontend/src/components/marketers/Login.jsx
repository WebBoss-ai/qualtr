import React, { useState } from 'react';
import axios from 'axios';
import { MARKETER_API_END_POINT } from '@/utils/constant';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // Replace useHistory with useNavigate

const MarketerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate for redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${MARKETER_API_END_POINT}/login`, formData);
      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      
      // Redirect to the profile update page after successful login
      navigate('/marketer-profile/update');  // Use navigate to redirect
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#17B169] focus:border-[#17B169] sm:text-sm pl-10"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#17B169] focus:border-[#17B169] sm:text-sm pl-10"
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#17B169] hover:bg-[#149655] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17B169] transition-all duration-300 ease-in-out ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-[#149655] group-hover:text-[#17B169]" aria-hidden="true" />
              </span>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        {/* Additional Links */}
        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-[#17B169] hover:text-[#149655] transition-all duration-300"
          >
            Forgot your password?
          </a>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/marketer/register"
              className="text-[#17B169] hover:text-[#149655] transition-all duration-300"
            >
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
