// models/Message.js
import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
    day: { type: String, required: true }, // e.g., "Monday"
    slots: { type: [String], required: true } // e.g., ["10AM-11AM", "2PM-3PM"]
});

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schedule: { type: [timeSlotSchema], required: true }, // Array of timeSlotSchema
    message: { type: String},
    agency: { type: String, required: true },
    agencyEmail: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    status: { type: String },
    response: { type: String },
    isSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },

});

export const Message = mongoose.model('Message', messageSchema);
export default Message;
