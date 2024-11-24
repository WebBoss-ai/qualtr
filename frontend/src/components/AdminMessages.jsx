import React, { useState, useEffect } from "react";
import axios from "axios";
import { MESSAGE_API_END_POINT } from '@/utils/constant';
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, MessageCircle, Calendar, Mail, Phone, User } from "lucide-react";

const EnhancedAdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${MESSAGE_API_END_POINT}/all-messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(response.data.messages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch messages.");
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`${MESSAGE_API_END_POINT}/all-messages/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const response = await axios.get(`${MESSAGE_API_END_POINT}/all-messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessages(response.data.messages);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update the message.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">No messages available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
          Admin Dashboard - Scheduled Meetings
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {messages.map((message) => (
            <motion.div
              key={message._id}
              className="bg-white overflow-hidden  rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Meeting with {message.agency}</h3>
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-600">
                    {message.sender?.fullname || "N/A"} ({message.sender?.email || "N/A"})
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Schedule:</h4>
                  <ul className="text-sm text-gray-600">
                    {message.schedule?.length > 0 ? (
                      message.schedule.map((slot, index) => (
                        <li key={index} className="flex items-center mb-1">
                          <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                          <span>{slot.day}: {slot.slots.join(", ")}</span>
                        </li>
                      ))
                    ) : (
                      <li>No schedule available</li>
                    )}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="truncate">{message.agencyEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="truncate">{message.userEmail}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <span>{message.userPhone}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    message.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    message.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {message.status || "Pending"}
                  </span>
                </div>
                <textarea
                  placeholder="Update response"
                  defaultValue={message.response}
                  onBlur={(e) => handleUpdate(message._id, { response: e.target.value })}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                ></textarea>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-between">
                <button
                  onClick={() => handleUpdate(message._id, { status: "Approved" })}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleUpdate(message._id, { status: "Rejected" })}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAdminMessages;