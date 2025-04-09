import React, { useEffect, useRef, useState } from "react";
import { Bell, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import socket from "../socket";
import { toast } from "sonner";

const NotificationBell = ({ userId, role = "User" }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userId || !role) return;

    const eventKey = `notify:${role.toLowerCase()}:${userId}`;
    socket.emit("join", userId);

    axios
      .get("/api/v1/notification", { withCredentials: true })
      .then((res) => {
        if (res.data.notifications) {
          setNotifications(res.data.notifications);
        } else {
          console.warn("⚠️ No notifications array in response.");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch notifications:", err);
      });

    socket.on(eventKey, (data) => {
      setNotifications((prev) => [data, ...prev]);
      const audio = new Audio("/sounds/ping.mp3");
      audio.play();

      toast(data.message || "You have a new notification", {
        description: "🔔 New Notification",
        duration: 4000,
      });
    });

    return () => {
      socket.off(eventKey);
    };
  }, [userId, role]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    axios
      .put("/api/v1/notification/read", {}, { withCredentials: true })
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success("All notifications marked as read.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to mark notifications as read.");
      });
  };

  const handleClearAll = () => {
    axios
      .delete("/api/v1/notification/clear", { withCredentials: true })
      .then(() => {
        setNotifications([]);
        toast.success("All notifications cleared.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to clear notifications.");
      });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setShowDropdown((prev) => !prev)}
        className="cursor-pointer"
        role="button"
        aria-label="Toggle notifications"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setShowDropdown((prev) => !prev)}
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.some((n) => !n.read) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg p-3 z-50"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Notifications</span>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-600 hover:text-gray-900 font-bold text-xl"
              >
                ×
              </button>
            </div>

            <div className="flex justify-end gap-2 mb-2">
              <Check
                onClick={handleMarkAllRead}
                className="w-4 h-4 text-green-500 cursor-pointer hover:text-green-700"
                title="Mark all as read"
                role="button"
                aria-label="Mark all as read"
              />
              <Trash2
                onClick={handleClearAll}
                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                title="Clear all"
                role="button"
                aria-label="Clear all notifications"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications</p>
              ) : (
                notifications.map((n, i) => (
                  <div
                    key={n._id || i}
                    className={`p-2 rounded-lg text-sm transition-all border-l-4 ${
                      n.read
                        ? "bg-gray-100 text-gray-600 border-gray-200"
                        : "bg-blue-100 text-black border-blue-500"
                    }`}
                  >
                    {n.message || "🔔 Notification"}
                    <div className="text-xs text-gray-500 mt-1">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString()
                        : "Unknown time"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
