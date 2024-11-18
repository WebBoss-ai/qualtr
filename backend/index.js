import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware"; // Import proxy middleware
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

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

// Serve static files from the frontend build directory
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/build")));

// // Setup proxy for API requests to FastAPI backend
// app.use('/api1', createProxyMiddleware({
//   target: 'http://localhost:8000', // Your FastAPI backend
//   changeOrigin: true,
//   pathRewrite: { '^/api1': '' }, // Rewrite /api1 to /
// }));

// API routes for other server logic
app.get("/api/v1/s3-url/:key", async (req, res) => {
  const { key } = req.params;
  try {
    const presignedUrl = await getObjectURL(key);
    res.json({ url: presignedUrl });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate presigned URL", error });
  }
});

// Register your other API routes
app.use("/api/v1/user", userRoute);//
app.use("/api/v1/company", companyRoute);//
app.use("/api/v1/job", jobRoute);//
app.use("/api/v1/application", applicationRoute);//
app.use("/api/v1/job-seekers", jobSeekerRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/analytics", analyticsRoute);
app.use("/api/v1/job-analytics", jobAnalyticsRoute);
app.use("/api/v1/portfolio", portfolioRoute);
app.use("/api/v1/message", messageRoute);
// app.use("/api/v1/meeting", meetingRoute);

// Serve React frontend for other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });
  socket.on('sendMessage', (data) => {
    io.to(data.room).emit('receiveMessage', data);
  });
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
