// routes/notification.routes.js
import express from "express";
import {
  createNotification,
  getNotifications,
  markAllAsRead,
  clearAllNotifications,
} from "../controllers/notification.controller.js";
import isAuthenticated from "../middleware/isauthenticated.js"; // Assuming you have one

const router = express.Router();

router.post("/create", isAuthenticated, createNotification);
router.get("/", isAuthenticated, getNotifications);
router.put("/read", isAuthenticated, markAllAsRead);
router.delete("/clear", isAuthenticated, clearAllNotifications);

export default router;
