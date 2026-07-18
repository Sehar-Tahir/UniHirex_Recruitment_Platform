const User = require("../models/User");
const Job = require("../models/Job");

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

    const admin = await User.create({ name, email, password, role: "admin", status: "Active" });

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

module.exports = { getAllUsers, approveUser, toggleUserStatus, createAdmin, getAllJobsForAdmin };