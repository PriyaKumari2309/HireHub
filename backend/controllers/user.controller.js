import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import nodemailer from "nodemailer";

// ================== Register ==================
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);

    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto: cloudResponse.secure_url },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ================== Login ==================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ================== Logout ==================
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ================== Update Profile ==================
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;
    // cloudinary ayega idhar
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    // updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // resume comes later here...
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; // save the cloudinary url
      user.profile.resumeOriginalName = file.originalname; // Save the original file name
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// ================== Forgot Password ==================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ message: "Email is required", success: false });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found", success: false });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  user.profile.otp = otp;
  user.profile.otpExpiry = otpExpiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL,
    subject: "Password Reset OTP",
    html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "OTP sent to email", success: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to send email", success: false });
  }
};

// ================== Reset Password ==================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    // Check OTP validity and expiry
    if (
      !user.profile.otp ||
      user.profile.otp !== otp ||
      user.profile.otpExpiry < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP", success: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP after use
    user.profile.otp = undefined;
    user.profile.otpExpiry = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password reset successful", success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Route: GET /api/v1/user/is-saved/:jobId
export const isJobSaved = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.jobId;

    const user = await User.findById(userId);
    const isSaved = user.savedJobs.includes(jobId);

    return res.status(200).json({ isSaved });
  } catch (error) {
    console.error("Error checking saved job:", error);
    return res.status(500).json({ error: "Failed to check saved job." });
  }
};
// ================== Save Job ==================
export const saveJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.jobId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Job saved successfully", success: true });
  } catch (error) {
    console.error("Error saving job:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
