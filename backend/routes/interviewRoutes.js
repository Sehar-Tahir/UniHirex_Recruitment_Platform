const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createEphemeralToken,
  createInterview,
  getInterviewById,
  saveTranscript,
  getMyInterviews,
} = require("../controllers/interviewController");

const router = express.Router();

router.get("/", protect, authorize("student"), getMyInterviews);
router.post("/", protect, authorize("student"), createInterview);
router.get("/:id", protect, authorize("student"), getInterviewById);
router.post("/:id/ephemeral-token", protect, authorize("student"), createEphemeralToken);
router.patch("/:id/transcript", protect, authorize("student"), saveTranscript);

module.exports = router;