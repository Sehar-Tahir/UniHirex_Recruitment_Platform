const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const ResumeAnalysis = require("../models/ResumeAnalysis");

// Cached in memory so the landing page can't hammer the database
const TTL_MS = 5 * 60 * 1000;
let cache = { at: 0, data: null };

// @route  GET /api/public/stats   (no login needed; only totals, never personal data)
const getPublicStats = async (req, res) => {
  try {
    // Lets Vercel's network cache this response too
    res.set("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=600");

    if (cache.data && Date.now() - cache.at < TTL_MS) return res.json(cache.data);

    const [students, recruiters, openListings, applications, interviews, analyses] = await Promise.all([
      User.countDocuments({ role: "student", status: "Active", isEmailVerified: true }),
      User.countDocuments({ role: "recruiter", status: "Active", isEmailVerified: true }),
      Job.countDocuments({ status: "Active" }),
      Application.countDocuments({}),
      Interview.countDocuments({ status: "Completed" }),
      ResumeAnalysis.countDocuments({}),
    ]);

    cache = { at: Date.now(), data: { students, recruiters, openListings, applications, interviews, analyses } };
    res.json(cache.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

module.exports = { getPublicStats };