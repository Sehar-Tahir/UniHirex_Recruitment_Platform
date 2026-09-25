const Application = require("../models/Application");
const Job = require("../models/Job");
const { createNotification } = require("./notificationController");
const { getPaginationParams, buildPaginatedResponse } = require("../utils/paginate");

// @route  POST /api/applications   (student only)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "jobId is required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "Active") {
      return res.status(400).json({ message: "This listing is no longer accepting applications" });
    }

    const application = await Application.create({ student: req.user._id, job: jobId });

    // Notify the recruiter who posted this job
    await createNotification(job.postedBy, `${req.user.name} applied to your listing: ${job.title}`);

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You've already applied to this job" });
    }
    res.status(500).json({ message: "Failed to submit application", error: err.message });
  }
};

// @route  GET /api/applications/mine   (student — their own applications, with job details)
const getMyApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { student: req.user._id };
    if (status && status !== "All") filter.status = status;

    const { page, limit, skip } = getPaginationParams(req.query, 10);

    const [applications, total] = await Promise.all([
      Application.find(filter).populate("job", "title company type").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Application.countDocuments(filter),
    ]);

    res.json(buildPaginatedResponse(applications, total, page, limit));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// @route  GET /api/applications/job/:jobId   (recruiter — must own the job)
const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only view applicants for your own listings" });
    }

    const { page, limit, skip } = getPaginationParams(req.query, 10);

    const [applicants, total] = await Promise.all([
      Application.find({ job: req.params.jobId })
        .populate("student", "name email university cgpa photoUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments({ job: req.params.jobId }),
    ]);

    res.json(buildPaginatedResponse(applicants, total, page, limit));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants", error: err.message });
  }
};

// @route  PATCH /api/applications/:id/status   (recruiter — must own the related job — or admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Under Review", "Shortlisted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    const isOwner = application.job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only manage applicants for your own listings" });
    }

    application.status = status;
    await application.save();

    // Notify the student whose application status changed
    await createNotification(
      application.student,
      `Your application to ${application.job.title} was ${status.toLowerCase()}`
    );

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Failed to update application status", error: err.message });
  }
};

module.exports = { applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };