const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const Notification = require("../models/Notification");
const { createNotification } = require("./notificationController");
const { collectUserFileUrls, deleteUploadedFiles } = require("../utils/cloudinaryCleanup");

const DELETABLE_ROLES = ["student", "recruiter"];

async function findDeletableUser(id) {
  if (!mongoose.isValidObjectId(id)) return { error: { status: 404, message: "User not found" } };

  const user = await User.findById(id);
  if (!user) return { error: { status: 404, message: "User not found" } };

  if (!DELETABLE_ROLES.includes(user.role)) {
    return { error: { status: 400, message: "Admin accounts can't be deleted here." } };
  }
  return { user };
}

// @route  GET /api/admin/users/:id/deletion-summary   (what deleting this account would remove)
const getDeletionSummary = async (req, res) => {
  try {
    const { user, error } = await findDeletableUser(req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    let counts;
    if (user.role === "student") {
      const [applications, interviews, resumeAnalyses] = await Promise.all([
        Application.countDocuments({ student: user._id }),
        Interview.countDocuments({ student: user._id }),
        ResumeAnalysis.countDocuments({ student: user._id }),
      ]);
      const resumes = (user.resumes || []).length || (user.resumeUrl ? 1 : 0);
      counts = { applications, interviews, resumeAnalyses, resumes };
    } else {
      const jobIds = (await Job.find({ postedBy: user._id }).select("_id")).map((j) => j._id);
      const [applications, applicants] = await Promise.all([
        Application.countDocuments({ job: { $in: jobIds } }),
        Application.distinct("student", { job: { $in: jobIds } }),
      ]);
      counts = { listings: jobIds.length, applications, applicants: applicants.length };
    }

    res.json({ name: user.name, email: user.email, role: user.role, counts });
  } catch (err) {
    res.status(500).json({ message: "Failed to load deletion summary", error: err.message });
  }
};

// @route  POST /api/admin/users/:id/delete   body: { confirmEmail }
const deleteUserAccount = async (req, res) => {
  try {
    const { user, error } = await findDeletableUser(req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    const confirmEmail = String(req.body.confirmEmail || "").trim().toLowerCase();
    if (confirmEmail !== user.email.toLowerCase()) {
      return res.status(400).json({ message: "The email you typed doesn't match this account." });
    }

    const userId = user._id;
    const fileUrls = collectUserFileUrls(user);

    // Everything that depends on the account goes first and the account goes last,
    // so if something fails halfway the account still exists and the admin can simply try again.
    if (user.role === "student") {
      await Promise.all([
        Application.deleteMany({ student: userId }),
        Interview.deleteMany({ student: userId }),
        ResumeAnalysis.deleteMany({ student: userId }),
      ]);
      await User.updateMany({ savedCandidates: userId }, { $pull: { savedCandidates: userId } });
    } else {
      const jobIds = (await Job.find({ postedBy: userId }).select("_id")).map((j) => j._id);
      const affectedStudents = await Application.distinct("student", { job: { $in: jobIds } });

      await Application.deleteMany({ job: { $in: jobIds } });
      await User.updateMany({ savedJobs: { $in: jobIds } }, { $pull: { savedJobs: { $in: jobIds } } });
      await Job.deleteMany({ postedBy: userId });

      await Promise.all(
        affectedStudents.map((studentId) =>
          createNotification(
            studentId,
            "A company you applied to was removed from UniHirex, so your application to its listing(s) was removed."
          ).catch(() => {})
        )
      );
    }

    await Notification.deleteMany({ user: userId });
    const files = await deleteUploadedFiles(fileUrls);
    await User.deleteOne({ _id: userId });

    console.log(`[admin] ${req.user.email} deleted ${user.role} account ${user.email} (${userId})`);
    res.json({ message: "Account deleted", files });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete account", error: err.message });
  }
};

module.exports = { getDeletionSummary, deleteUserAccount };