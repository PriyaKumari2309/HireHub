import { Notification } from "../models/notification.model.js";

// CREATE a new notification and emit real-time event
export const createNotification = async (req, res) => {
  try {
    const { senderId, receiverId, type, message, userType, link } = req.body;

    // Better validation
    const requiredFields = { senderId, receiverId, type, message, userType };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          message: `${key} is required`,
        });
      }
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

    // Emit to a specific receiver's Socket.IO room
    req.io.to(receiverId).emit("getNotification", newNotification);

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
    const userId = req.id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .lean(); // faster, plain JS objects

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("Get Notifications Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// MARK all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error("Mark as Read Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// CLEAR all notifications
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.id });
    res.status(200).json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (err) {
    console.error("Clear Notifications Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// OPTIONAL: Get unread count for badge
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.id,
      read: false,
    });
    res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("Unread Count Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
