const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    type: { type: String, enum: ["Full-time", "Part-time", "Internship"], required: true },
    location: { type: String, required: true, trim: true },
    salary: { type: String, trim: true }, // friendly display text, e.g. "PKR 25,000 - 35,000/mo"
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    experienceLevel: { type: String, enum: ["Entry Level", "Mid Level", "Senior Level"], required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    status: { type: String, enum: ["Active", "Flagged", "Closed"], default: "Active" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true }, // snapshot of recruiter's company name at post time
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);