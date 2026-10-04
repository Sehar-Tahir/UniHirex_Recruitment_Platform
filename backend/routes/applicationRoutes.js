const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getCandidateMatchScore,
  sendInterviewInvite,
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/", protect, authorize("student"), applyToJob);
router.get("/mine", protect, authorize("student"), getMyApplications);
router.get("/job/:jobId", protect, authorize("recruiter", "admin"), getApplicantsForJob);
router.patch("/:id/status", protect, authorize("recruiter", "admin"), updateApplicationStatus);
router.get("/:id/candidate-match", protect, authorize("recruiter", "admin"), getCandidateMatchScore);
router.post("/:id/invite-interview", protect, authorize("recruiter", "admin"), sendInterviewInvite);

module.exports = router;