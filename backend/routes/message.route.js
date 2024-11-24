// routes/messageRoutes.js
import express from "express";
import { sendMessage, getUserMessages, getAllMessages, updateMessageById } from "../controllers/messageController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Modify the /send route to include receiverId in the URL
router.route("/send").post(isAuthenticated, sendMessage);

// Fetch the authenticated user's messages
router.route("/my-messages").get(isAuthenticated, getUserMessages);

// Fetch all messages (admin or superuser feature maybe?)
router.route("/all-messages").get( getAllMessages);

// Update a message by ID (admin feature)
router.route("/all-messages/:id").put( updateMessageById);

export default router;
