const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { createJob, getJobs, getJobById, getMyJobs, updateJobStatus } = require("../controllers/jobController");

const router = express.Router();

// Public/student browsing — no login required to view listings
router.get("/", getJobs);

// IMPORTANT: this specific route must come BEFORE "/:id" below,
// otherwise Express would think "recruiter" is a job ID and never reach this one.
router.get("/recruiter/mine", protect, authorize("recruiter"), getMyJobs);

router.get("/:id", getJobById);

router.post("/", protect, authorize("recruiter"), createJob);
router.patch("/:id/status", protect, authorize("recruiter", "admin"), updateJobStatus);

module.exports = router;