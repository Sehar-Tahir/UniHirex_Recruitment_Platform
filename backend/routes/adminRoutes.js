const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getAllUsers, approveUser, toggleUserStatus, createAdmin } = require("../controllers/adminController");

const router = express.Router();

// Every route here requires a valid token AND the admin role
router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.patch("/users/:id/approve", approveUser);
router.patch("/users/:id/toggle-status", toggleUserStatus);
router.post("/create-admin", createAdmin);

module.exports = router;