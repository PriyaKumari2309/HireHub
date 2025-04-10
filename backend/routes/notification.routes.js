import express from "express";
import {
  createNotification,
  getNotifications,
  markAllAsRead,
  clearAllNotifications,
  getUnreadCount, // 👈 added
} from "../controllers/notification.controller.js";
import isAuthenticated from "../middleware/isauthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, createNotification);
router.get("/", isAuthenticated, getNotifications);
router.put("/read", isAuthenticated, markAllAsRead);
router.delete("/clear", isAuthenticated, clearAllNotifications);
router.get("/unread-count", isAuthenticated, getUnreadCount); // 👈 new route

export default router;
