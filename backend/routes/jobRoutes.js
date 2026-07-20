const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJobStatus,
  getRecommendedJobs,
  getRecruiterStats,
} = require("../controllers/jobController");

const router = express.Router();

// Public/student browsing — no login required to view listings
router.get("/", getJobs);
router.get("/recommended", getRecommendedJobs);

// IMPORTANT: these specific routes must come BEFORE "/:id" below,
// otherwise Express would think "recruiter" is a job ID and never reach these.
router.get("/recruiter/mine", protect, authorize("recruiter"), getMyJobs);
router.get("/recruiter/stats", protect, authorize("recruiter"), getRecruiterStats);

router.get("/:id", getJobById);

router.post("/", protect, authorize("recruiter"), createJob);
router.patch("/:id/status", protect, authorize("recruiter", "admin"), updateJobStatus);

module.exports = router;