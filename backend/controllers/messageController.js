import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id || req.body.senderId;
        if (!senderId) {
            return res.status(400).json({ success: false, message: 'Sender ID is required.' });
        }

        const { schedule, message, agency, agencyEmail, userEmail, userPhone } = req.body;

        if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
            return res.status(400).json({ success: false, message: 'Schedule is required and should be an array.' });
        }

        const newMessage = new Message({
            sender: senderId,
            schedule, // Directly pass the schedule array
            message,
            agency,
            agencyEmail,
            userEmail,
            userPhone,
            isSent: true
        });

        await newMessage.save();

        return res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error("Error saving message:", error);
        return res.status(500).json({ success: false, message: 'Failed to send message.', error });
    }
};

// Get all messages sent by the logged-in user
export const getUserMessages = async (req, res) => {
    const userId = req.id;
    console.log("getUserMessages - Request userId:", userId);

    try {
        // Modify the query to sort by 'createdAt' in descending order
        const messages = await Message.find({ sender: userId })
            .populate('sender', 'fullname email')
            .sort({ createdAt: -1 });  // Sort in descending order (most recent first)

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
    try {
        // Fetch all messages sorted by creation date
        const messages = await Message.find()
            .populate('sender', 'fullname email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error("Error retrieving all messages for admin:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages.",
            error
        });
    }
};


export const updateMessageById = async (req, res) => {
    const { id } = req.params;
    const { status, response } = req.body;

    try {
        // Ensure only `status` and `response` fields are updated
        const updatedFields = {};
        if (status) updatedFields.status = status;
        if (response) updatedFields.response = response;

        // Update the message in the database
        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true } // Return the updated document
        );

        if (!updatedMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Message updated successfully.",
            data: updatedMessage,
        });
    } catch (error) {
        console.error("Error updating message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update the message.",
            error,
        });
    }
};