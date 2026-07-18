const User = require("../models/User");

// @route  GET /api/users/me
const getMyProfile = async (req, res) => {
  res.json(req.user);
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
      new: true,
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

module.exports = { getMyProfile, updateMyProfile, getCandidates, getCandidateById };