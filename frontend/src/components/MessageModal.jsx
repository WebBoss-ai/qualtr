import React, { useState } from 'react';
import axios from 'axios';
import { MESSAGE_API_END_POINT } from '@/utils/constant';

const MessageModal = ({ recruiterId, onClose, setMailIconDisabled, token }) => {
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // State to manage success message

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = {
            title,
            message,
            senderId: recruiterId,
        };
    
        setIsSending(true);
    
        try {
            const response = await axios.post(
                `${MESSAGE_API_END_POINT}/send`,
                data, // Pass the correct data
                {
                    headers: { 'Content-Type': 'application/json' }, // Use JSON format
                    withCredentials: true,
                }
            );
    
            if (response.data.success) {
                setMailIconDisabled(true); // Disable the mail icon after sending
                setSuccessMessage("Your message has been sent! Our team will reach out to you shortly."); // Set success message
            } else {
                setError("Message could not be sent.");
            }
        } catch (err) {
            setError("An error occurred while sending the message.");
        } finally {
            setIsSending(false);
        }
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                {successMessage ? (
                    // Show success message if message is successfully sent
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-green-600 mb-4">
                            Thank you!
                        </h2>
                        <p>{successMessage}</p>
                        <button
                            className="mt-4 bg-[#17B169] text-white py-2 px-4 rounded"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    // Display form if no success message is set
                    <>
                        <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="w-full p-2 mb-2 border border-gray-300 rounded"
                                placeholder="Enter a title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded"
                                rows="4"
                                placeholder="Enter your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`bg-[#17B169] text-white py-2 px-4 rounded ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isSending}
                                >
                                    {isSending ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default MessageModal;
