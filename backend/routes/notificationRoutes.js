const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getMyNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");

const router = express.Router();

router.get("/mine", protect, getMyNotifications);
router.patch("/:id/read", protect, markAsRead);
router.patch("/mark-all-read", protect, markAllAsRead);

module.exports = router;