const ResumeAnalysis = require("../models/ResumeAnalysis");
const getResumeContent = require("../utils/resumeContent");
const analyzeResume = require("../utils/analyzeResume");
const { getPaginationParams, buildPaginatedResponse } = require("../utils/paginate");
const { reserveSlot, refundSlot } = require("../utils/aiQuota");

const RESUME_QUOTA_MESSAGE =
  "You've used all of your free resume analyses. You can request more access from an admin.";

// @route  POST /api/resume-analysis   (student only — analyze their current uploaded resume)
const createAnalysis = async (req, res) => {
  let reserved = false;
  try {
    if (!req.user.resumeUrl) {
      return res.status(400).json({ message: "Please upload your resume first." });
    }

    const targetRole = String(req.body.targetRole || "").trim().slice(0, 100);
    const jobDescription = String(req.body.jobDescription || "").trim().slice(0, 5000);

    let content;
    try {
      content = await getResumeContent(req.user.resumeUrl);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    // Only now (resume is readable, AI is about to be called) does this use one of the student's slots
    reserved = await reserveSlot(req.user._id, "resumeAnalyses");
    if (!reserved) {
      return res.status(403).json({ message: RESUME_QUOTA_MESSAGE, code: "QUOTA_EXCEEDED" });
    }

    let analysis;
    try {
      analysis = await analyzeResume(content, targetRole, jobDescription);
    } catch (err) {
      console.error("Resume analysis failed:", err.message);
      await refundSlot(req.user._id, "resumeAnalyses").catch(() => {});
      reserved = false;
      return res.status(502).json({
        message:
          "The AI service couldn't analyze your resume right now. This attempt was not counted. Please try again in a moment.",
      });
    }

    // Version = which resume FILE this is. Re-analyzing the same file keeps its version.
    const [previousAnalysis, sameFile, highest] = await Promise.all([
      ResumeAnalysis.findOne({ student: req.user._id }).sort({ createdAt: -1 }),
      ResumeAnalysis.findOne({ student: req.user._id, resumeUrl: req.user.resumeUrl }).select("version"),
      ResumeAnalysis.findOne({ student: req.user._id }).sort({ version: -1 }).select("version"),
    ]);
    const version = sameFile?.version || (highest?.version || 0) + 1;

    const previous = previousAnalysis
      ? {
          overallScore: previousAnalysis.overallScore,
          contentScore: previousAnalysis.contentScore,
          structureScore: previousAnalysis.structureScore,
          skillsScore: previousAnalysis.skillsScore,
          languageScore: previousAnalysis.languageScore,
          atsScore: previousAnalysis.atsScore,
          version: previousAnalysis.version || 1,
          createdAt: previousAnalysis.createdAt,
        }
      : undefined;

    const saved = await ResumeAnalysis.create({
      student: req.user._id,
      targetRole,
      resumeUrl: req.user.resumeUrl,
      version,
      previous,
      ...analysis,
    });

    res.status(201).json(saved);
  } catch (err) {
    if (reserved) await refundSlot(req.user._id, "resumeAnalyses").catch(() => {});
    res.status(500).json({ message: "Failed to analyze resume", error: err.message });
  }
};

// @route  GET /api/resume-analysis   (student only — past analyses, newest first)
const getMyAnalyses = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, 10);
    const filter = { student: req.user._id };

    const [analyses, total, recent] = await Promise.all([
      ResumeAnalysis.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ResumeAnalysis.countDocuments(filter),
      ResumeAnalysis.find(filter).sort({ createdAt: -1 }).limit(6).select("overallScore version createdAt"),
    ]);

    const recentScores = recent.reverse().map((a) => ({ score: a.overallScore, version: a.version, date: a.createdAt }));

    res.json({ ...buildPaginatedResponse(analyses, total, page, limit), recentScores });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analyses", error: err.message });
  }
};

// @route  GET /api/resume-analysis/:id   (student only — one of their own analyses)
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, student: req.user._id });
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    res.json(analysis);
  } catch (err) {
    if (err.name === "CastError") return res.status(404).json({ message: "Analysis not found" });
    res.status(500).json({ message: "Failed to fetch analysis", error: err.message });
  }
};

// @route  PATCH /api/resume-analysis/:id/suggestions   (mark a suggestion as applied / not applied)
const updateSuggestion = async (req, res) => {
  try {
    const { target, index, accepted } = req.body;
    if (!["summary", "rewrite"].includes(target) || typeof accepted !== "boolean") {
      return res.status(400).json({ message: "Invalid request" });
    }

    const analysis = await ResumeAnalysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    if (analysis.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own analyses" });
    }

    if (target === "summary") {
      analysis.summaryAccepted = accepted;
    } else {
      if (!Number.isInteger(index) || index < 0 || index >= analysis.rewrites.length) {
        return res.status(400).json({ message: "Invalid suggestion" });
      }
      analysis.rewrites[index].accepted = accepted;
    }

    await analysis.save();
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: "Failed to update suggestion", error: err.message });
  }
};

// @route  DELETE /api/resume-analysis/:id   (student only — delete one of their own analyses)
const deleteAnalysis = async (req, res) => {
  try {
    const deleted = await ResumeAnalysis.findOneAndDelete({ _id: req.params.id, student: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Analysis not found" });
    res.json({ message: "Analysis deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete analysis", error: err.message });
  }
};

module.exports = { createAnalysis, getMyAnalyses, getAnalysisById, updateSuggestion, deleteAnalysis };