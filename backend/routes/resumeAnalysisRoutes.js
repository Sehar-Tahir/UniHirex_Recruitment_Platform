const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createAnalysis,
  getMyAnalyses,
  getAnalysisById,
  updateSuggestion,
  deleteAnalysis,
} = require("../controllers/resumeAnalysisController");

const router = express.Router();

router.post("/", protect, authorize("student"), createAnalysis);
router.get("/", protect, authorize("student"), getMyAnalyses);
router.get("/:id", protect, authorize("student"), getAnalysisById);
router.patch("/:id/suggestions", protect, authorize("student"), updateSuggestion);
router.delete("/:id", protect, authorize("student"), deleteAnalysis);

module.exports = router;