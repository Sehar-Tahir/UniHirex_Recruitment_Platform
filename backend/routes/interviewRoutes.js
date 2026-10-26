const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  getCandidateMatchScore,
  sendInterviewInvite,
} = require("../controllers/applicationController");
const {
  submitApplication,
  checkApplied,
  getApplicationById,
} = require("../controllers/applicationDetailsController");

const router = express.Router();

router.post("/", protect, authorize("student"), submitApplication);
router.get("/mine", protect, authorize("student"), getMyApplications);
router.get("/check/:jobId", protect, authorize("student"), checkApplied);
router.get("/job/:jobId", protect, authorize("recruiter", "admin"), getApplicantsForJob);
router.patch("/:id/status", protect, authorize("recruiter", "admin"), updateApplicationStatus);
router.get("/:id/candidate-match", protect, authorize("recruiter", "admin"), getCandidateMatchScore);
router.post("/:id/invite-interview", protect, authorize("recruiter", "admin"), sendInterviewInvite);
router.get("/:id", protect, authorize("recruiter", "admin"), getApplicationById);

module.exports = router;