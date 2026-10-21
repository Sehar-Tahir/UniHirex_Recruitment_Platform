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
      location: { type: String, trim: true },
      message: { type: String, trim: true },
      sentAt: { type: Date },
    },
    // A copy of what the student chose to share when applying. Later profile edits never change it.
    // Applications made before this existed have no sharedAt, which is how the app tells them apart.
    snapshot: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true, default: "" },
      university: { type: String, trim: true, default: "" },
      department: { type: String, trim: true, default: "" },
      semester: { type: String, trim: true, default: "" },
      cgpa: { type: String, trim: true, default: "" },
      skills: [{ type: String }],
      projects: [{ title: String, description: String, link: String, liveLink: String }],
      certifications: [{ name: String, issuer: String, year: String }],
      portfolioUrl: { type: String, trim: true, default: "" },
      socialLinks: {
        linkedin: { type: String, trim: true, default: "" },
        github: { type: String, trim: true, default: "" },
      },
      resume: { label: String, url: String, fileName: String },
      coverNote: { type: String, trim: true, default: "" },
      sharedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Prevents the same student from applying to the same job twice
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);