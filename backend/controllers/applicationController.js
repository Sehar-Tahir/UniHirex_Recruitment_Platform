const Application = require("../models/Application");
const Job = require("../models/Job");
const { createNotification } = require("./notificationController");
const { getPaginationParams, buildPaginatedResponse } = require("../utils/paginate");
const getMatchScore = require("../utils/matchScore");

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

// @route  GET /api/applications/:id/candidate-match   (recruiter — must own the related job — AI fit score for this applicant)
const getCandidateMatchScore = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("student", "skills")
      .populate("job", "requirements postedBy");

    if (!application) return res.status(404).json({ message: "Application not found" });

    const isOwner = application.job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only view match scores for your own listings" });
    }

    const result = await getMatchScore(application.student.skills, application.job.requirements);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to compute match score", error: err.message });
  }
};

// @route  POST /api/applications/:id/invite-interview   (recruiter — must own the related job, applicant must be Shortlisted)
const sendInterviewInvite = async (req, res) => {
  try {
    const { dateTime, location, message } = req.body;

    if (!dateTime || !location) {
      return res.status(400).json({ message: "Date/time and location are required" });
    }

    const application = await Application.findById(req.params.id).populate("job").populate("student", "name");
    if (!application) return res.status(404).json({ message: "Application not found" });

    const isOwner = application.job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only manage applicants for your own listings" });
    }

    if (application.status !== "Shortlisted") {
      return res.status(400).json({ message: "Only shortlisted applicants can be invited to interview" });
    }

    application.interviewInvite = {
      dateTime,
      location,
      message: message || "",
      sentAt: new Date(),
    };
    await application.save();

    const formattedDate = new Date(dateTime).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    await createNotification(
      application.student._id,
      `Interview invitation for ${application.job.title}: ${formattedDate} at ${location}`
    );

    res.json({ message: "Interview invitation sent", application });
  } catch (err) {
    res.status(500).json({ message: "Failed to send interview invitation", error: err.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getCandidateMatchScore,
  sendInterviewInvite,
};