import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Loader, LogIn, UserPlus } from 'lucide-react'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')

      if (!token) {
        toast.error('Invalid verification link.')
        return
      }

      setLoading(true)
      try {
        const res = await axios.get(`${USER_API_END_POINT}/verify-email`, {
          params: { token },
        })
        
        if (res.data.success) {
          setSuccess(true)
          toast.success('Your email has been successfully verified!')
        } else {
          toast.error(res.data.message || 'Verification failed.')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Invalid or expired verification link.')
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="/path-to-your-logo.png" alt="Qualtr" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md">
          {loading ? (
            <div className="text-center">
              <Loader className="animate-spin h-10 w-10 text-[#17B169] mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-700">Verifying your email, please wait...</p>
            </div>
          ) : success ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-[#17B169] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h3>
              <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now log in.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#17B169] hover:bg-[#149655] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17B169] transition duration-150 ease-in-out"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Log In
              </button>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-6">The verification link is invalid or has expired.</p>
              <button
                onClick={() => navigate('/signup')}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail