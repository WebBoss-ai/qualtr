import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";
import session from "express-session";
import passport from "passport";
import connectDB from "./utils/db.js";
import "./utils/passport.js"; // Import Passport configuration

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
import marketerRoute from "./routes/marketer.route.js";
import authRoute from "./routes/authRoutes.js"; // Google Auth route

dotenv.config();

const app = express();
const server = createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration for Passport.js
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);

const PORT = process.env.PORT || 8000;

// Serve static files from the frontend build directory
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Proxy configuration
// app.use('/api1', createProxyMiddleware({
//   target: 'http://localhost:8000',
//   changeOrigin: true,
//   pathRewrite: { '^/api1': '' },
// }));

// API routes
app.get("/api/v1/s3-url/:key", async (req, res) => {
  const { key } = req.params;
  try {
    const presignedUrl = await getObjectURL(key);
    res.json({ url: presignedUrl });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate presigned URL", error });
  }
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/user/individual", marketerRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/job-seekers", jobSeekerRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/analytics", analyticsRoute);
app.use("/api/v1/job-analytics", jobAnalyticsRoute);
app.use("/api/v1/portfolio", portfolioRoute);
app.use("/api/v1/message", messageRoute);

// Google Authentication routes
app.use("/api/v1/auth", authRoute);

// Serve React frontend for other routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173",
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
});
