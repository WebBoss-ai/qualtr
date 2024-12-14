import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmailSent = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Email Sent!</h2>
                <p className="mb-6">
                    We’ve sent a verification email to your registered email address. Please check your inbox (or spam folder) and click the link to verify your account.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    );
};

export default EmailSent;
