const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetRole: { type: String, trim: true, default: "" },
    resumeUrl: { type: String },
    resumeLabel: { type: String, trim: true, default: "" },
    version: { type: Number },
    hadJobDescription: { type: Boolean, default: false },

    overallScore: Number,
    contentScore: Number,
    structureScore: Number,
    skillsScore: Number,
    languageScore: Number,
    atsScore: Number,

    summary: String,
    strengths: [String],
    improvements: [String], // kept so older analyses still display
    issues: [
      {
        title: String,
        severity: { type: String, enum: ["high", "medium", "low"], default: "medium" },
        solution: String,
      },
    ],
    sections: [{ name: String, present: Boolean }],

    parsed: {
      currentSummary: { type: String, default: "" },
      education: [{ degree: String, institution: String, period: String }],
      skills: [String],
      projects: [{ name: String, description: String }],
      experience: [{ role: String, company: String, period: String }],
      certifications: [String],
    },

    atsIssues: [String],
    skillGaps: [{ skill: String, reason: String }],

    suggestedSummary: String,
    summaryAccepted: { type: Boolean, default: false },
    rewrites: [
      {
        section: String,
        original: String,
        improved: String,
        reason: String,
        accepted: { type: Boolean, default: false },
      },
    ],

    jobMatch: {
      matchScore: Number,
      summary: String,
      matchedKeywords: [String],
      missingKeywords: [String],
    },

    // Snapshot of the student's previous analysis, used to show score changes
    previous: {
      overallScore: Number,
      contentScore: Number,
      structureScore: Number,
      skillsScore: Number,
      languageScore: Number,
      atsScore: Number,
      version: Number,
      createdAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);