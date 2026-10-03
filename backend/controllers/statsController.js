const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

const getStats = async (req, res) => {
  try {
    const [students, companies, activeJobs, applications] =
      await Promise.all([
        User.countDocuments({
          role: "student",
          status: "Active",
        }),

        User.countDocuments({
          role: "recruiter",
          status: "Active",
        }),

        Job.countDocuments({
          status: "Active",
        }),

        Application.countDocuments(),
      ]);

    res.status(200).json({
      students,
      companies,
      activeJobs,
      applications,
    });
  } catch (error) {
    console.error("Stats error:", error);

    res.status(500).json({
      message: "Failed to fetch platform statistics",
    });
  }
};

module.exports = {
  getStats,
};