const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// @route  POST /api/upload/:uploadType   (uploadType: resume | photo | logo)
router.post("/:uploadType", protect, (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err.message);
      return res.status(500).json({ message: err.message || "Upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ url: req.file.path });
  });
});

module.exports = router;