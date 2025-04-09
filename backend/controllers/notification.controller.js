import { Notification } from "../models/notification.model.js";
import { io } from "../index.js"; // Socket.IO instance

// CREATE a new notification and emit real-time event
export const createNotification = async (req, res) => {
  try {
    const { senderId, receiverId, type, message, userType, link } = req.body;

    if (!senderId || !receiverId || !type || !message || !userType) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newNotification = await Notification.create({
      sender: senderId,
      userId: receiverId,
      userType,
      type,
      message,
      link: link || null,
      createdAt: new Date(),
    });

    // Emit to a specific receiver based on their userType and ID
    io.emit(`notify:${userType}:${receiverId}`, newNotification);

    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      notification: newNotification,
    });
  } catch (err) {
    console.error("Create Notification Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET all notifications for the logged-in user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.id; // Set via middleware

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("Get Notifications Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// MARK all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.id }, { $set: { read: true } });
    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark as Read Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// CLEAR all notifications
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.id });
    res
      .status(200)
      .json({ success: true, message: "All notifications cleared" });
  } catch (err) {
    console.error("Clear Notifications Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
