import express from "express";
import {
  login,
  logout,
  register,
  saveJob,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isauthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import { isJobSaved } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/save-job/:jobId").post(isAuthenticated, saveJob);

router.route("/is-saved/:jobId").get(isAuthenticated, isJobSaved);

export default router;
