const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["Under Review", "Shortlisted", "Rejected"],
      default: "Under Review",
    },
    interviewInvite: {
      dateTime: { type: Date },
      location: { type: String, trim: true }, // address, or a video call link
      message: { type: String, trim: true },
      sentAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Prevents the same student from applying to the same job twice
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
