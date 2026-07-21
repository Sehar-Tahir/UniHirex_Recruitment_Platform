const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      required: true,
    },
    companyName: {
      type: String,
      trim: true,
      // only relevant for recruiters
    },
    // Student-specific fields
    phone: { type: String, trim: true, default: "" },
    university: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    semester: { type: String, trim: true, default: "" },
    cgpa: { type: String, trim: true, default: "" },
    skills: [{ type: String }],
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        year: String,
      },
    ],
    resumeUrl: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
   savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    savedCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    // Recruiter-specific fields (beyond companyName)
    industry: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    logoUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "Pending", "Suspended"],
      default: function () {
        // students are active immediately; recruiters need admin approval
        return this.role === "recruiter" ? "Pending" : "Active";
      },
    },
  },
  { timestamps: true }
);

// Hash the password before saving, but only if it changed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare a plain password against the hashed one
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);