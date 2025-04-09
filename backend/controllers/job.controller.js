import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
// POST a new job
import { Notification } from "../models/notification.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    console.log("Received location:", location); // Log location here to check if it's coming from frontend

    const userId = req.id;

    // Check required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    // 🔔 Emit real-time notification to all clients
    req.io.emit("notify:all", {
      message: `📢 New job posted: ${job.title} at ${job.location}`,
      jobId: job._id,
    });
    // 🔔 Send notification to all users (stored in DB)
    const allUsers = await User.find({}, "_id");
    const notificationPromises = allUsers.map((user) => {
      const notification = new Notification({
        sender: userId,
        userId: user._id,
        userType: "user",
        message: `A new job "${job.title}" has been posted at ${job.location}.`,
        type: "job",
        link: `/jobs/${job._id}`,
        createdAt: new Date(),
      });

      // Emit to each specific user
      req.io.emit(`notify:user:${user._id}`, {
        message: notification.message,
        link: notification.link,
      });

      return notification.save();
    });

    await Promise.all(notificationPromises);

    return res.status(201).json({
      message: "New job created successfully and notifications sent.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error creating job:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

{
  /* await Notification.create({
      sender: userId,
      userId: userId, // ✅ This is the missing field

      userType: "user", // or "System"
      message: `A new job "${job.title}" has been posted at ${job.location}.`,
      type: "job",
      link: `/jobs/${job._id}`, // frontend deep link
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error creating job:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
*/
}
// GET all jobs (for students)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// GET job by ID (for students)
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("applications")
      .populate("created_by", "_id name email"); // ✅ populate created_by

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error("Error fetching job by ID:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// GET jobs created by admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching admin jobs:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
