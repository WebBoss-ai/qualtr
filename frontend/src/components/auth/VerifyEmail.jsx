import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token'); // Extract the token from the URL

            if (!token) {
                toast.error('Invalid verification link.');
                return;
            }

            setLoading(true);
            try {
                const res = await axios.get(`${USER_API_END_POINT}/verify-email`, {
                    params: { token },
                });
                
                if (res.data.success) {
                    setSuccess(true);
                    toast.success('Your email has been successfully verified!');
                } else {
                    toast.error(res.data.message || 'Verification failed.');
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Invalid or expired verification link.');
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
                {loading ? (
                    <p>Verifying your email, please wait...</p>
                ) : success ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
                        <p className="mb-6">Your email has been successfully verified. You can now log in.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Log In
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-red-500">Verification Failed</h2>
                        <p className="mb-6">The verification link is invalid or has expired.</p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Sign Up Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
