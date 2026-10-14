const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  getCandidates,
  getCandidateById,
  toggleSavedJob,
  toggleSavedCandidate,
  getMyAiQuota,
  requestAiAccess,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);

router.get("/me/ai-quota", protect, authorize("student"), getMyAiQuota);
router.post("/me/ai-quota/request", protect, authorize("student"), requestAiAccess);

router.patch("/me/saved-jobs/:jobId", protect, authorize("student"), toggleSavedJob);
router.patch("/me/saved-candidates/:candidateId", protect, authorize("recruiter"), toggleSavedCandidate);

// IMPORTANT: these specific routes must come before any "/:id"-style route
router.get("/candidates", protect, authorize("recruiter", "admin"), getCandidates);
router.get("/candidates/:id", protect, authorize("recruiter", "admin"), getCandidateById);

module.exports = router;