const User = require("../models/User");
const Job = require("../models/Job");
const { createNotification } = require("./notificationController");

// @route  GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// @route  PATCH /api/admin/users/:id/approve
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "Active";
    await user.save();

    await createNotification(user._id, "Your recruiter account has been approved! You can now post listings.");

    res.json({ message: "User approved", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve user", error: err.message });
  }
};

// @route  PATCH /api/admin/users/:id/toggle-status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "Active" ? "Suspended" : "Active";
    await user.save();

    res.json({ message: "User status updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status", error: err.message });
  }
};

// @route  POST /api/admin/create-admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const admin = await User.create({ name, email, password, role: "admin", status: "Active", isEmailVerified: true });

    res.status(201).json({ id: admin._id, name: admin.name, email: admin.email, role: admin.role });
  } catch (err) {
    res.status(500).json({ message: "Failed to create admin", error: err.message });
  }
};

// @route  GET /api/admin/jobs  (ALL jobs regardless of status — unlike the public browse endpoint which only shows Active ones)
const getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name companyName").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// @route  GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const Application = require("../models/Application");

    const [totalStudents, totalRecruiters, totalListings, totalApplications, recentUsers, recentJobs] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "recruiter" }),
        Job.countDocuments(),
        Application.countDocuments(),
        User.find({ role: { $in: ["student", "recruiter"] } })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("name role companyName createdAt"),
        Job.find().sort({ createdAt: -1 }).limit(5).select("title company createdAt"),
      ]);

    // Merge two different kinds of events into one "recent activity" feed, sorted by time
    const activity = [
      ...recentUsers.map((u) => ({
        id: u._id,
        text:
          u.role === "recruiter"
            ? `New recruiter registered: ${u.companyName || u.name}`
            : `New student registered: ${u.name}`,
        time: u.createdAt,
      })),
      ...recentJobs.map((j) => ({
        id: j._id,
        text: `${j.company} posted a new listing: ${j.title}`,
        time: j.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 6);

    res.json({ totalStudents, totalRecruiters, totalListings, totalApplications, activity });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin stats", error: err.message });
  }
};

module.exports = { getAllUsers, approveUser, toggleUserStatus, createAdmin, getAllJobsForAdmin, getAdminStats };