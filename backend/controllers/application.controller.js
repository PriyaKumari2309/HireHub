import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { io } from "../index.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

// USER: Apply to a job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;

    const { id: jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    const recruiterId = job.postedBy?.toString() || job.created_by?.toString();

    const applicant = await User.findById(userId);
    const applicantName = applicant?.fullname || "Someone";

    if (recruiterId) {
      const recruiterNotification = await Notification.create({
        sender: userId,
        userId: recruiterId,
        userType: "recruiter",
        message: `${applicantName} applied for the job "${job.title}" at ${job.company.name}`,
        type: "application",
        link: `/applications/${job._id}`,

        createdAt: new Date(),
      });

      io.emit(`notify:recruiter:${recruiterId}`, recruiterNotification);
    }
    const userNotification = await Notification.create({
      sender: recruiterId,
      userId: userId,
      userType: "user",
      message: `You have successfully applied for the job "${job.title}" at ${job.company.name}`,
      type: "application",
      link: `/applications/${job._id}`,
      createdAt: new Date(),
    });

    io.emit(`notify:user:${userId}`, userNotification);

    return res.status(200).json({
      message: "Job applied successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// USER: Get applied jobs
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        message: "No applications found",
        success: false,
      });
    }

    return res.status(200).json({
      application: applications,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ADMIN: Get applicants of a job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// ADMIN/RECRUITER: Update application status and notify user
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const recruiterID = req.id;

    const application = await Application.findById(applicationId)
      .populate({
        path: "job", // Ensure the job field is populated
        select: "title", // Only select the title to optimize the query
      })
      .populate("applicant");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }
    const jobTitle = application.job?.title || "Unknown job title";

    application.status = status.toLowerCase();
    await application.save();

    const userId = application.applicant._id.toString();

    const newNotification = await Notification.create({
      sender: recruiterID,
      userId: userId,
      userType: "user",
      message: `Your application status for the ${jobTitle} has been updated to ${status}`,
      type: "application",
      createdAt: new Date(),
    });

    io.emit(`notify:user:${userId}`, newNotification);

    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
    });
  } catch (error) {
    console.log("❌ Error updating status:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
