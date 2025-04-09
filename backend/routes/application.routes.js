import express from "express";
import isAuthenticated from "../middleware/isauthenticated.js";
import { getApplicants, applyJob, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";

const router=express.Router();
router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;