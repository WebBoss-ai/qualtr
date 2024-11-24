import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import connectDB from "./utils/db.js";

// Import routes
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import jobSeekerRoute from "./routes/jobSeeker.route.js";
import profileRoute from "./routes/profile.route.js";
import analyticsRoute from "./routes/analytics.route.js";
import jobAnalyticsRoute from "./routes/jobAnalytics.route.js";
import portfolioRoute from "./routes/portfolio.route.js";
import messageRoute from "./routes/message.route.js";
// import meetingRoute from "./routes/meeting.route.js";

dotenv.config();

const app = express();
const server = createServer(app);

// Environment toggle
const IS_PRODUCTION = true; // Set to `true` for production, `false` for development

const corsOptions = {
  origin: IS_PRODUCTION
    ? "https://qualtr.com"
    : "http://localhost:5173", // Adjust frontend dev server port if different
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

// Serve static files only in production
if (IS_PRODUCTION) {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
} else {
  // Proxy API requests in development to the backend
  app.get("/", (req, res) => {
    res.send("Backend server running. Frontend is served on a separate port.");
  });
}

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/job-seekers", jobSeekerRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/analytics", analyticsRoute);
app.use("/api/v1/job-analytics", jobAnalyticsRoute);
app.use("/api/v1/portfolio", portfolioRoute);
app.use("/api/v1/message", messageRoute);
// app.use("/api/v1/meeting", meetingRoute);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: IS_PRODUCTION
      ? "https://qualtr.com"
      : "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });
  socket.on("sendMessage", (data) => {
    io.to(data.room).emit("receiveMessage", data);
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
  if (!IS_PRODUCTION) {
    console.log("Frontend running on http://localhost:5173");
  }
});
