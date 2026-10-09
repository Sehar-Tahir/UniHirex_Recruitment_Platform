const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true, trim: true },
    level: { type: String, enum: ["Junior", "Mid", "Senior"], required: true },
    type: { type: String, enum: ["Technical", "HR", "Behavioral", "Mixed", "Role Specific"], required: true },
    questionCount: { type: Number, required: true, min: 1, max: 10 },

    questions: [
      {
        question: String,
        answer: String,
        score: Number,
        feedback: String,
      },
    ],

    overallScore: { type: Number },
    technicalScore: { type: Number },
    communicationScore: { type: Number },
    relevanceScore: { type: Number },
    completenessScore: { type: Number },
    confidenceScore: { type: Number },

    strengths: [{ type: String }],
    improvements: [{ type: String }],
    recommendation: { type: String },

    status: { type: String, enum: ["In Progress", "Completed", "Abandoned"], default: "In Progress" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);