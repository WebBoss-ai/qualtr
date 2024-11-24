import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MESSAGE_API_END_POINT } from '@/utils/constant';
import { X, Clock, Calendar, Send, Plus, Trash2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 

const EnhancedAdvancedMessageModal = ({ agency, agencyEmail, userEmail, userPhone, recruiterId, onClose, setMailIconDisabled }) => {
    const [schedule, setSchedule] = useState([]);
    const [currentDay, setCurrentDay] = useState("");
    const [currentSlot, setCurrentSlot] = useState("");
    const [message, setMessage] = useState("");
    const [selectedAgency, setSelectedAgency] = useState(""); // Renamed state variable
    const [selectedAgencyEmail, setSelectedAgencyEmail] = useState(""); // Renamed state variable
    const [selectedUserEmail, setSelectedUserEmail] = useState(""); // Renamed state variable
    const [selectedUserPhone, setSelectedUserPhone] = useState(""); // Renamed state variable
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const navigate = useNavigate();  // This initializes the navigate function

    const handleRedirect = () => {
        navigate('/my-meetings');  // Navigate to the /my-meetings page
    };

    useEffect(() => {
        if (agency) {
            setSelectedAgency(agency); // Safely set agency if provided
        } else {
            console.warn("Agency prop is undefined or null.");
            setSelectedAgency("Default Agency Name"); // Set fallback name
        }
    }, [agency]);
    useEffect(() => {
        if (agencyEmail) {
            setSelectedAgencyEmail(agencyEmail); // Safely set agency if provided
        } else {
            console.warn("Agency prop is undefined or null.");
            setSelectedAgencyEmail("Default Agency Name"); // Set fallback name
        }
    }, [agencyEmail]);
    useEffect(() => {
        if (userEmail) {
            setSelectedUserEmail(userEmail); // Safely set userEmail if provided
        } else {
            console.warn("userEmail prop is undefined or null.");
            setSelectedUserEmail("Default userEmail Name"); // Set fallback name
        }
    }, [userEmail]);
    useEffect(() => {
        if (userPhone) {
            setSelectedUserPhone(userPhone); // Safely set userPhone if provided
        } else {
            console.warn("userPhone prop is undefined or null.");
            setSelectedUserPhone("Default userPhone Name"); // Set fallback name
        }
    }, [userPhone]);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const timeSlots = [
        "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
        "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM",
        "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"
    ];

    const handleAddSlot = () => {
        if (currentDay && currentSlot) {
            setSchedule((prev) => {
                const dayExists = prev.find((item) => item.day === currentDay);
                if (dayExists) {
                    return prev.map((item) =>
                        item.day === currentDay
                            ? { ...item, slots: [...new Set([...item.slots, currentSlot])] }
                            : item
                    );
                } else {
                    return [...prev, { day: currentDay, slots: [currentSlot] }];
                }
            });
            setCurrentSlot("");
        }
    };

    const handleRemoveSlot = (day, slot) => {
        setSchedule((prev) =>
            prev.map((item) =>
                item.day === day
                    ? { ...item, slots: item.slots.filter((s) => s !== slot) }
                    : item
            ).filter((item) => item.slots.length > 0)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);

        if (!Array.isArray(schedule) || schedule.length === 0) {
            setError("Schedule is required. To add a slot, click the '+' button.");
            setIsSending(false);
            return;
        }

        try {
            const payload = { schedule, message, agency, agencyEmail, userEmail, userPhone, senderId: recruiterId };
            if (typeof setMailIconDisabled === 'function') {
                setMailIconDisabled(true); // Call only if it's a valid function
            } else {
                console.warn("setMailIconDisabled is not a function.");
            }
            const response = await axios.post(
                `${MESSAGE_API_END_POINT}/send`,
                payload,
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );

            if (response.data.success) {
                setMailIconDisabled(true);
                setSuccessMessage(
                    <>
                        Your meeting request with <span className="text-red-500">{agency}</span> has been received! Keep an eye on your mailbox, we'll get back to you shortly.
                    </>
                );
            }

            else {
                setError(response.data.message || "Message could not be sent.");
            }
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "An error occurred while sending the message.");
        } finally {
            setIsSending(false);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="bg-gradient-to-r from-black to-black p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Schedule a Meeting</h2>
                    <button onClick={onClose} className="text-white hover:text-red-600 transition-colors focus:outline-none">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 bg-gray-50">

                    {!successMessage && (
                        <p className="text-sm text-[#006241] mb-6">
                            We value your time and promise not to spam you. Kindly select your preferred time slots for the meeting!
                        </p>
                    )}
                    {successMessage ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-green-600 mb-2">Success!</h3>
                            <p className="text-gray-600">{successMessage}</p>
                            <button
                                className="mt-6 bg-[#17B169] text-white py-2 px-6 rounded-[8px] hover:bg-[#006241] transition-colors focus:outline-none focus:ring-2 focus:ring-[#17B169] focus:ring-opacity-50"
                                onClick={handleRedirect}
                            >
                                Meeting Details
                            </button>                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Select Day and Time</label>
                                <div className="flex space-x-2">
                                    <select
                                        value={currentDay}
                                        onChange={(e) => setCurrentDay(e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-[#17B169] focus:border-[#17B169] transition-all duration-200"
                                    >
                                        <option value="">Select Day</option>
                                        {days.map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={currentSlot}
                                        onChange={(e) => setCurrentSlot(e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-[#17B169] focus:border-[#17B169] transition-all duration-200"
                                    >
                                        <option value="">Select Time</option>
                                        {timeSlots.map((slot) => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        onClick={handleAddSlot}
                                        className="p-2 bg-[#17B169] text-white rounded-md hover:bg-[#006241] focus:outline-none focus:ring-2 focus:ring-[#17B169] focus:ring-offset-2 transition-colors duration-200"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-700">Selected Schedule:</h3>
                                <div className="max-h-40 overflow-y-auto pr-2">
                                    <AnimatePresence>
                                        {schedule.map(({ day, slots }) => (
                                            <motion.div
                                                key={day}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mb-2"
                                            >
                                                <div className="font-medium text-gray-700 mb-1">{day}</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {slots.map((slot) => (
                                                        <motion.span
                                                            key={slot}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-[#006241]"
                                                        >
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {slot}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveSlot(day, slot)}
                                                                className="ml-1 text-[#17B169] hover:text-[#006241] focus:outline-none"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Project Description</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#17B169] focus:border-[#17B169] transition-all duration-200"
                                    placeholder="Please specify your project needs..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <input type="hidden" value={agency} name="agency" />
                            <input type="hidden" value={agencyEmail} name="agencyEmail" />

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm"
                                >
                                    {error}
                                </motion.p>
                            )}
                            <div className="flex justify-end space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17B169] transition-colors duration-200"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className={`px-4 py-2 bg-[#17B169] text-white rounded-md hover:bg-[#006241] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17B169] transition-colors duration-200 ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isSending}
                                >
                                    {isSending ? 'Sending...' : 'Send'}
                                </motion.button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EnhancedAdvancedMessageModal;