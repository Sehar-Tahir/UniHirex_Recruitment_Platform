const Notification = require("../models/Notification");

const { getPaginationParams, buildPaginatedResponse } = require("../utils/paginate");

// @route  GET /api/notifications/mine
const getMyNotifications = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, 10);

    const [notifications, total] = await Promise.all([
      Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments({ user: req.user._id }),
    ]);

    res.json(buildPaginatedResponse(notifications, total, page, limit));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
  }
};

// @route  PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { returnDocument: "after" }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification", error: err.message });
  }
};

// @route  PATCH /api/notifications/mark-all-read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications", error: err.message });
  }
};

// Internal helper — used by other controllers to create a notification.
// Not an HTTP route; just a plain function other backend code can call directly.
const createNotification = async (userId, text) => {
  try {
    await Notification.create({ user: userId, text });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, createNotification };