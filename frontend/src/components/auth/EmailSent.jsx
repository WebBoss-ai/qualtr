import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Home, RefreshCw } from 'lucide-react'
import img1 from '../../images/logo.png'

export default function EmailSent() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img src={img1} alt="Qualtr Logo" className="h-8 w-auto mr-2" />
              <span className="text-xl font-semibold text-gray-800">Qualtr</span>
            </div>
            <CheckCircle className="text-[#17B169] w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Email Sent!</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            We've sent a verification email to your registered email address. Please check your inbox (or spam folder) and click the link to verify your account.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-[#17B169] text-white px-4 py-2 rounded hover:bg-[#149655] transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Resend Email</span>
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .max-w-md {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}