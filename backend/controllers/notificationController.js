const Notification = require("../models/Notification");

// @route  GET /api/notifications/mine
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
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
      { new: true }
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