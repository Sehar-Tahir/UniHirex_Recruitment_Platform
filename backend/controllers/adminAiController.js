const User = require("../models/User");
const { createNotification } = require("./notificationController");
const { getQuota } = require("../utils/aiQuota");

const MAX_LIMIT = 50;
const validLimit = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_LIMIT;

const findStudent = async (id) => {
  try {
    const user = await User.findById(id);
    return user && user.role === "student" ? user : null;
  } catch {
    return null;
  }
};

// @route  GET /api/admin/users/:id/ai-quota
const getUserAiQuota = async (req, res) => {
  const student = await findStudent(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(getQuota(student));
};

// @route  PATCH /api/admin/users/:id/ai-limits   body: { interviews?, resumeAnalyses?, resetUsage? }
const updateUserAiLimits = async (req, res) => {
  try {
    const student = await findStudent(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { interviews, resumeAnalyses, resetUsage } = req.body;
    const updates = {};

    if (interviews !== undefined) {
      if (!validLimit(interviews)) {
        return res.status(400).json({ message: `Interview limit must be a whole number from 0 to ${MAX_LIMIT}` });
      }
      updates["aiLimits.interviews"] = interviews;
    }

    if (resumeAnalyses !== undefined) {
      if (!validLimit(resumeAnalyses)) {
        return res.status(400).json({ message: `Resume analysis limit must be a whole number from 0 to ${MAX_LIMIT}` });
      }
      updates["aiLimits.resumeAnalyses"] = resumeAnalyses;
    }

    if (resetUsage === true) {
      updates["aiUsage.interviewsUsed"] = 0;
      updates["aiUsage.resumeAnalysesUsed"] = 0;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updated = await User.findByIdAndUpdate(student._id, { $set: updates }, { returnDocument: "after" });

    await createNotification(
      student._id,
      "An admin updated your AI feature access. Check the Interview Coach and Resume Analyzer to see your limits."
    );

    res.json(getQuota(updated));
  } catch (err) {
    res.status(500).json({ message: "Failed to update AI access", error: err.message });
  }
};

module.exports = { getUserAiQuota, updateUserAiLimits };