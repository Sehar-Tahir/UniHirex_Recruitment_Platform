const Job = require("../models/Job");
const Application = require("../models/Application");

// @route  POST /api/jobs   (recruiter only)
const createJob = async (req, res) => {
  try {
    const { title, category, type, location, salary, experienceLevel, description, requirements } = req.body;

    if (!title || !category || !type || !location || !experienceLevel || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const job = await Job.create({
      title,
      category,
      type,
      location,
      salary,
      experienceLevel,
      description,
      requirements: requirements || [],
      postedBy: req.user._id,
      company: req.user.companyName || req.user.name,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to create job", error: err.message });
  }
};

// @route  GET /api/jobs   (public/student browse — with filters)
const getJobs = async (req, res) => {
  try {
    const { search, category, type, experienceLevel, location } = req.query;
    const filter = { status: "Active" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (location) filter.location = { $regex: location, $options: "i" };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// @route  GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job", error: err.message });
  }
};

// @route  GET /api/jobs/recruiter/mine   (recruiter only — their own listings)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your listings", error: err.message });
  }
};

// @route  PATCH /api/jobs/:id/status   (recruiter — own listing only, or admin — any listing)
const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Flagged", "Closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const isOwner = job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only manage your own listings" });
    }

    job.status = status;
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to update job status", error: err.message });
  }
};

// @route  GET /api/jobs/recommended   (student dashboard — latest active listings)
const getRecommendedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Active" }).sort({ createdAt: -1 }).limit(6);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recommended jobs", error: err.message });
  }
};

// @route  GET /api/jobs/recruiter/stats   (recruiter dashboard)
const getRecruiterStats = async (req, res) => {
  try {
    const Application = require("../models/Application");
    const recruiterId = req.user._id;

    const myJobs = await Job.find({ postedBy: recruiterId }).select("_id status");
    const myJobIds = myJobs.map((j) => j._id);

    const activeListings = myJobs.filter((j) => j.status === "Active").length;

    const [totalApplicants, shortlisted, newThisWeek, recentApplicants] = await Promise.all([
      Application.countDocuments({ job: { $in: myJobIds } }),
      Application.countDocuments({ job: { $in: myJobIds }, status: "Shortlisted" }),
      Application.countDocuments({
        job: { $in: myJobIds },
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Application.find({ job: { $in: myJobIds } })
        .populate("student", "name")
        .populate("job", "title")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      activeListings,
      totalApplicants,
      shortlisted,
      newThisWeek,
      recentApplicants,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recruiter stats", error: err.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJobStatus,
  getRecommendedJobs,
  getRecruiterStats,
};