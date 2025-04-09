import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import companyRoute from "./routes/company.routes.js";
import jobRoute from "./routes/job.routes.js";
import applicationRoute from "./routes/application.routes.js";
import notificationRoute from "./routes/notification.routes.js";

import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Setup __dirname (ESM fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  // "http://localhost:8000",
  "https://hirehub-b4lc.onrender.com",
];

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
export { io };

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Attach io instance to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/notification", notificationRoute);

// Serve frontend (AFTER routes)
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
});

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on("sendNotification", (data) => {
    const { userId, message } = data;
    io.to(userId).emit("getNotification", {
      userId,
      message,
      createdAt: new Date(),
      read: false,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Connect to DB and start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running at port ${PORT}`);
});
