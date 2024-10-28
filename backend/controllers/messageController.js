import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        // Capture the sender ID from either the token (req.id) or the request body
        const senderId = req.id || req.body.senderId;
        console.log("sendMessage - Sender ID:", senderId);

        // Validate if senderId is provided and log the details
        if (!senderId) {
            console.log("sendMessage - Error: Sender ID is missing.");
            return res.status(400).json({ success: false, message: 'Sender ID is required.' });
        }

        // Log the incoming request body for debugging
        console.log("sendMessage - Request body:", req.body);

        // Ensure title and message exist in the request body
        if (!req.body.title || !req.body.message) {
            console.log("sendMessage - Error: Title or message is missing.");
            return res.status(400).json({ success: false, message: 'Both title and message are required.' });
        }

        // Create the new message object
        const newMessage = new Message({
            title: req.body.title,
            message: req.body.message,
            sender: senderId,
            isSent: true,
        });

        // Log the message object that will be saved
        console.log("sendMessage - New message object created:", newMessage);

        // Save the message to the database
        await newMessage.save();

        // Log successful save
        console.log("sendMessage - Message successfully saved:", newMessage);

        // Return the created message in the response
        return res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        // Log the error stack trace for debugging
        console.error("sendMessage - Error saving message:", error.stack || error);

        // Return an error response with the error message
        return res.status(500).json({ success: false, message: 'Failed to send message.', error });
    }
};

// Get all messages sent by the logged-in user
export const getUserMessages = async (req, res) => {
    const userId = req.id;
    console.log("getUserMessages - Request userId:", userId);

    try {
        const messages = await Message.find({ sender: userId }).populate('sender', 'fullname email');
        console.log("getUserMessages - Messages retrieved:", messages);

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error("getUserMessages - Error retrieving messages:", error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};

// Get all messages (admin only)
export const getAllMessages = async (req, res) => {
    console.log("getAllMessages - Request user email:", req.user.email);

    if (req.email !== 'admin@gmail.com') {
        console.warn("getAllMessages - Unauthorized access attempt by:", req.user.email);
        return res.status(403).json({
            success: false,
            message: "Unauthorized."
        });
    }

    try {
        const messages = await Message.find().populate('sender', 'fullname email');
        console.log("getAllMessages - All messages retrieved:", messages);

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error("getAllMessages - Error retrieving all messages:", error);
        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
};
