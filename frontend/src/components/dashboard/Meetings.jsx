// Updated Meetings.jsx
import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { MESSAGE_API_END_POINT } from '@/utils/constant';

const Meetings = ({ token }) => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 5; // Show 5 messages per page

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(`${MESSAGE_API_END_POINT}/my-messages`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setMessages(data.messages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [token]);

    // Filter messages based on the search term
    const filteredMessages = messages.filter(message =>
        (message.agency && message.agency.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.message && message.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

    // Pagination controls
    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredMessages.length / messagesPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>Your Messages | Connect with Brands & Agencies</title>
                <meta name="description" content="Access your messages and communicate seamlessly with brands and agencies. Build strong connections today." />
                <meta name="keywords" content="messages, connect with agencies, brand communication, agency communication, direct messages, networking, professional connections, Qualtr platform chat" />
            </Helmet>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3 bg-white rounded-lg border border-gray-300 p-6">
                            <div className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search messages..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17B169]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                                </div>
                            </div>

                            {/* Display the current 5 messages with pagination */}
                            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                                {currentMessages.map((message) => (
                                    <motion.div
                                        key={message._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`p-4 rounded-lg cursor-pointer transition duration-150 ease-in-out border ${
                                            selectedMessage?._id === message._id ? 'bg-[#17B169] bg-opacity-10' : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => setSelectedMessage(message)}
                                    >
                                        <h3 className="font-semibold text-gray-900 truncate">{message.agency}</h3>
                                        <p className="text-sm text-gray-600 truncate">{message.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Requested by: {message.userEmail} | Phone: {message.userPhone}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination controls */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    className={`p-2 bg-[#17B169] text-white rounded-full ${
                                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    className={`p-2 bg-[#17B169] text-white rounded-full ${
                                        currentPage === Math.ceil(filteredMessages.length / messagesPerPage)
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    onClick={handleNextPage}
                                    disabled={currentPage === Math.ceil(filteredMessages.length / messagesPerPage)}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Display selected message */}
                        <div className="w-full md:w-2/3 bg-white rounded-lg border border-gray-200 p-6">
  {selectedMessage ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Meeting Request:{" "}
          <span className="text-[#17B169] font-semibold">{selectedMessage.agency}</span>
        </h2>
        <button
          className="text-gray-500 hover:text-red-600 transition duration-200 ease-in-out"
          aria-label="Delete Message"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg text-gray-800 leading-relaxed">
          {selectedMessage.message}
        </p>
      </div>

      <div className="mb-4">
  <p className="text-sm text-gray-700">
  <span className="font-medium text-[#17B169]">Preferred Slots:</span>
  <div className="mt-2 space-y-2">
      {selectedMessage.schedule.map((slot, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
        >
          <span className="text-sm font-medium text-green-900">
            {slot.day}:
          </span>
          <span className="text-sm text-green-600">
            {slot.slots.join(", ")}
          </span>
        </div>
      ))}
    </div>
  </p>
</div>


      
      
      <div className="mb-4 flex items-center">
  <span className="inline-block px-5 py-3  text-sm font-medium rounded-lg bg-green-50 text-gray-600">
    {selectedMessage.response || (
      <>
        We've received your request! Thank you for scheduling a meeting with{" "}
        <span className="text-[#17B169]">{selectedMessage.agency}</span>. Our team will contact you soon. In the meantime, feel free to{" "}
        <a href="/agencies" className="text-[#17B169] hover:underline">
          explore other agencies.
        </a>{" "}
        At Qualtr, booking a meeting takes just 10 seconds!
      </>
    )}
  </span>
</div>
<div className="mb-4 flex items-center">
        <span className="inline-block px-5 py-3 text-sm font-medium rounded-lg bg-green-50 text-gray-600">
          <span className="font-semibold text-gray-900">Status:</span>{" "}
          {selectedMessage.status || "Pending"}
        </span>
      </div>
    </motion.div>
  ) : (
    <div className="flex items-center justify-center h-full text-gray-500">
      <p className="text-center text-lg">Select a message to view its contents</p>
    </div>
  )}
</div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Meetings;
