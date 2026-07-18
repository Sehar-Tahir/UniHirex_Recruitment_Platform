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

module.exports = { getMyProfile, updateMyProfile };