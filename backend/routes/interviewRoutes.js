const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const {
createInterview,
createEphemeralToken,
getInterviewById,
saveTranscript,
getMyInterviews,
} = require("../controllers/interviewController");

const router = express.Router();

// Create AI practice interview
router.post("/", protect, authorize("student"), createInterview);

// Get student's interviews
router.get("/", protect, authorize("student"), getMyInterviews);

// Get a specific interview
router.get("/:id", protect, authorize("student"), getInterviewById);

// Generate Gemini Live ephemeral token
router.post("/:id/ephemeral-token", protect, authorize("student"), createEphemeralToken);

// Save interview transcript
router.patch("/:id/transcript", protect, authorize("student"), saveTranscript);

module.exports = router;
