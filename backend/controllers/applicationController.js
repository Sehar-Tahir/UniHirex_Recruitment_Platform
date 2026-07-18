const Application = require("../models/Application");
const Job = require("../models/Job");

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
    const applications = await Application.find({ student: req.user._id })
      .populate("job", "title company type")
      .sort({ createdAt: -1 });
    res.json(applications);
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

    const applicants = await Application.find({ job: req.params.jobId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json(applicants);
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
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Failed to update application status", error: err.message });
  }
};

module.exports = { applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };