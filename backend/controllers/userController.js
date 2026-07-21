const User = require("../models/User");

// @route  GET /api/users/me
const getMyProfile = async (req, res) => {
  const user = req.user;

  if (user.role === "student") {
    const fields = ["phone", "university", "department", "semester", "cgpa"];
    const filledCount = fields.filter((f) => user[f] && user[f].trim() !== "").length;
    const hasSkills = user.skills && user.skills.length > 0;
    const hasResume = user.resumeUrl && user.resumeUrl.trim() !== "";

    const totalChecks = fields.length + 2; // +2 for skills and resume
    const completedChecks = filledCount + (hasSkills ? 1 : 0) + (hasResume ? 1 : 0);
    const completion = Math.round((completedChecks / totalChecks) * 100);

    const missing = [];
    if (!hasResume) missing.push("Resume");
    if (!hasSkills) missing.push("Skills");
    if (!user.university) missing.push("University");
    if (!user.cgpa) missing.push("CGPA");

    return res.json({ ...user.toObject(), profileCompletion: completion, profileMissing: missing });
  }

  res.json(user);
};

// @route  PATCH /api/users/me
const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name", "phone", "university", "department", "semester", "cgpa",
      "skills", "projects", "certifications", "resumeUrl", "photoUrl",
      "companyName", "industry", "website", "logoUrl",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

// @route  GET /api/users/candidates   (recruiter/admin only — search students)
const getCandidates = async (req, res) => {
  try {
    const { search, skill } = req.query;
    const filter = { role: "student" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
      ];
    }
    if (skill) filter.skills = skill;

    const candidates = await User.find(filter).select(
      "name email university department semester cgpa skills projects"
    );
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidates", error: err.message });
  }
};

// @route  GET /api/users/candidates/:id   (recruiter/admin only — one student's full public profile)
const getCandidateById = async (req, res) => {
  try {
    const candidate = await User.findOne({ _id: req.params.id, role: "student" }).select(
      "name email university department semester cgpa skills projects"
    );
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidate", error: err.message });
  }
};

// @route  PATCH /api/users/me/saved-jobs/:jobId   (student only — toggle save)
const toggleSavedJob = async (req, res) => {
  try {
    const user = req.user;
    const jobId = req.params.jobId;
    const alreadySaved = user.savedJobs.some((id) => id.toString() === jobId);

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }
    await user.save();
    res.json({ savedJobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to update saved jobs", error: err.message });
  }
};

// @route  PATCH /api/users/me/saved-candidates/:candidateId   (recruiter only — toggle save)
const toggleSavedCandidate = async (req, res) => {
  try {
    const user = req.user;
    const candidateId = req.params.candidateId;
    const alreadySaved = user.savedCandidates.some((id) => id.toString() === candidateId);

    if (alreadySaved) {
      user.savedCandidates = user.savedCandidates.filter((id) => id.toString() !== candidateId);
    } else {
      user.savedCandidates.push(candidateId);
    }
    await user.save();
    res.json({ savedCandidates: user.savedCandidates });
  } catch (err) {
    res.status(500).json({ message: "Failed to update saved candidates", error: err.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getCandidates,
  getCandidateById,
  toggleSavedJob,
  toggleSavedCandidate,
};