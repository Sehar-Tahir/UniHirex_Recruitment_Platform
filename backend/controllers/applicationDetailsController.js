const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const { sanitizeProfileFields, flattenForSet } = require("../utils/profileValidation");
;

const clean = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const idSet = (list) => new Set((Array.isArray(list) ? list : []).map(String));

// @route  POST /api/applications   (student only)
const submitApplication = async (req, res) => {
  try {
    const body = req.body || {};

    if (!body.jobId) return res.status(400).json({ message: "jobId is required" });
    if (body.consent !== true) {
      return res
        .status(400)
        .json({ message: "Please confirm that you agree to share this information with the company." });
    }
    if (!mongoose.isValidObjectId(body.jobId)) return res.status(404).json({ message: "Job not found" });

    const job = await Job.findById(body.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "Active") {
      return res.status(400).json({ message: "This listing is no longer accepting applications" });
    }

    if (await Application.exists({ student: req.user._id, job: job._id })) {
      return res.status(409).json({ message: "You've already applied to this job" });
    }

    const name = clean(body.name, 100);
    if (!name) return res.status(400).json({ message: "Please enter your name." });

    // Same rules as the profile: phone, education, CGPA, links and skills are checked and cleaned
    const checked = sanitizeProfileFields({
      phone: body.phone,
      university: body.university,
      department: body.department,
      semester: body.semester,
      cgpa: body.cgpa,
      portfolioUrl: body.portfolioUrl,
      socialLinks: body.socialLinks,
      skills: body.skills,
    });
    if (checked.error) return res.status(400).json({ message: checked.error });
    const v = checked.values;

    const sharePhone = body.sharePhone === true;
    if (sharePhone && !v.phone) {
      return res.status(400).json({ message: "Add a phone number, or untick sharing your phone number." });
    }

    // Projects and certifications are looked up from the student's own profile by id, so nothing can be invented
    const wantedProjects = idSet(body.projectIds);
    const projects = (req.user.projects || [])
      .filter((p) => wantedProjects.has(String(p._id)))
      .map((p) => ({ title: p.title, description: p.description, link: p.link, liveLink: p.liveLink }));

    const wantedCerts = idSet(body.certificationIds);
    const certifications = (req.user.certifications || [])
      .filter((c) => wantedCerts.has(String(c._id)))
      .map((c) => ({ name: c.name, issuer: c.issuer, year: c.year }));

    // The resume must be one of the student's own saved resumes
    let resume;
    if (body.resumeId) {
      const found = (req.user.resumes || []).find((r) => r._id.toString() === String(body.resumeId));
      if (!found) return res.status(400).json({ message: "That resume wasn't found. Please choose another one." });
      resume = { label: found.label, url: found.url, fileName: found.fileName };
    }

    const application = await Application.create({
      student: req.user._id,
      job: job._id,
      snapshot: {
        name,
        email: req.user.email,
        phone: sharePhone ? v.phone : "",
        university: v.university || "",
        department: v.department || "",
        semester: v.semester || "",
        cgpa: v.cgpa || "",
        skills: v.skills ?? req.user.skills ?? [],
        projects,
        certifications,
        portfolioUrl: v.portfolioUrl || "",
        socialLinks: {
          linkedin: v.socialLinks?.linkedin || "",
          github: v.socialLinks?.github || "",
        },
        resume,
        coverNote: clean(body.coverNote, 1000),
        sharedAt: new Date(),
      },
    });

    // Optionally save the edits back to the profile. Projects and certifications are never touched here,
    // because the student may have unticked some of them just for this one application.
    let profileSaved = false;
    if (body.saveToProfile === true) {
      try {
        const updates = flattenForSet({ ...v });
        updates.name = name;
        await User.findByIdAndUpdate(req.user._id, updates, { runValidators: true });
        profileSaved = true;
      } catch {
        // The application is already sent, so a failed profile update must not undo it
      }
    }

    // Notify the recruiter who posted this job
    try {
      await createNotification(job.postedBy, `${name} applied to your listing: ${job.title}`);
    } catch {
      // A failed notification must not fail the application
    }

    res.status(201).json({ application, profileSaved });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You've already applied to this job" });
    }
    res.status(500).json({ message: "Failed to submit application", error: err.message });
  }
};

// @route  GET /api/applications/check/:jobId   (student only — have I already applied to this job?)
const checkApplied = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.jobId)) return res.json({ applied: false, status: null });
    const existing = await Application.findOne({ student: req.user._id, job: req.params.jobId }).select("status");
    res.json({ applied: !!existing, status: existing ? existing.status : null });
  } catch (err) {
    res.status(500).json({ message: "Failed to check application", error: err.message });
  }
};

// @route  GET /api/applications/:id   (recruiter who owns the job, or admin — one application with what was shared)
const getApplicationById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Application not found" });

    const application = await Application.findById(req.params.id)
      .populate("student", "name photoUrl")
      .populate("job", "title company postedBy");
    if (!application || !application.job) return res.status(404).json({ message: "Application not found" });

    const isOwner = application.job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only view applications to your own listings" });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch application", error: err.message });
  }
};


module.exports = { submitApplication, checkApplied, getApplicationById };