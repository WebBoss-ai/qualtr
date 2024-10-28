// models/Message.js
import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    // receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // New field for receiver
    isSent: { type: Boolean, default: false }, // If the message has been sent
    createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
export default Message;