import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userType: {
    type: String,
    enum: ["user", "recruiter"], // Add support for recruiter
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
  type: {
    type: String, // ✅ REQUIRED!
    enum: ["info", "job", "application", "system"],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  link: {
    type: String,
    default: "",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId, // sender can be user or recruiter
    ref: "User",
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
