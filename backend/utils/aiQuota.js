const User = require("../models/User");

// Default limits for every student. Only students an admin has customised store their own limits,
// so changing these numbers later changes the limit for everyone else too.
const DEFAULT_LIMITS = { interviews: 2, resumeAnalyses: 2 };

const FIELDS = {
  interviews: { used: "aiUsage.interviewsUsed", limit: "aiLimits.interviews", usedKey: "interviewsUsed" },
  resumeAnalyses: {
    used: "aiUsage.resumeAnalysesUsed",
    limit: "aiLimits.resumeAnalyses",
    usedKey: "resumeAnalysesUsed",
  },
};

// Uses one slot, atomically, so two requests at the same moment can't both squeeze in.
// Returns true if a slot was available, false if the student has none left.
async function reserveSlot(userId, feature) {
  const f = FIELDS[feature];
  const updated = await User.findOneAndUpdate(
    {
      _id: userId,
      $expr: {
        $lt: [{ $ifNull: [`$${f.used}`, 0] }, { $ifNull: [`$${f.limit}`, DEFAULT_LIMITS[feature]] }],
      },
    },
    { $inc: { [f.used]: 1 } },
    { returnDocument: "after" }
  );
  return !!updated;
}

// Gives a slot back. Used when the AI call fails through no fault of the student.
async function refundSlot(userId, feature) {
  const f = FIELDS[feature];
  await User.updateOne({ _id: userId, [f.used]: { $gt: 0 } }, { $inc: { [f.used]: -1 } });
}

function getQuota(user) {
  const data = typeof user.toObject === "function" ? user.toObject() : user;
  const build = (feature) => {
    const f = FIELDS[feature];
    const used = data.aiUsage?.[f.usedKey] ?? 0;
    const limit = data.aiLimits?.[feature] ?? DEFAULT_LIMITS[feature];
    return { used, limit, remaining: Math.max(0, limit - used) };
  };
  return { interviews: build("interviews"), resumeAnalyses: build("resumeAnalyses") };
}

module.exports = { DEFAULT_LIMITS, reserveSlot, refundSlot, getQuota };