const liveClient = require("../config/geminiLive");
const Interview = require("../models/Interview");
const analyzeInterview = require("../utils/analyzeInterview");
const { getPaginationParams, buildPaginatedResponse } = require("../utils/paginate");

const CONCLUSION_PHRASE = "This concludes our interview session. Thank you for your time.";
const CONCLUSION_MARKER = "this concludes our interview session";

function buildSystemInstruction({ role, level, type, questionCount }) {
  return `You are a professional interviewer conducting a realistic, spoken mock interview.

Interview configuration:
- Job Role: ${role}
- Candidate Level: ${level}
- Interview Type: ${type}
- Total Questions: ${questionCount}

Rules you must follow strictly:
1. Ask exactly ${questionCount} questions in total, one at a time. Wait for the candidate's spoken answer before continuing.
2. Every turn of yours must contain exactly one question. Never ask extra follow-up questions beyond the ${questionCount} total, though each new question may build on the candidate's previous answer.
3. After the candidate answers, give at most one short sentence of acknowledgement, then ask the next question.
4. Keep every turn brief and natural, like a real interviewer. Do not lecture or give detailed feedback during the interview.
5. After the candidate answers question number ${questionCount}, give at most one short sentence of acknowledgement, then say exactly this phrase, word for word, and stop speaking: "${CONCLUSION_PHRASE}"
6. Never say that phrase at any other point in the conversation.
7. Start immediately when the session begins: introduce yourself in one short sentence, then ask question 1.`;
}

// @route  POST /api/interviews   (student only — create a new interview session record)
const createInterview = async (req, res) => {
  try {
    const { role, level, type, questionCount } = req.body;
    const count = Number(questionCount);

    if (!role || !role.trim() || !level || !type || !Number.isInteger(count) || count < 1 || count > 10) {
      return res
        .status(400)
        .json({ message: "Role, level, type, and a question count between 1 and 10 are required" });
    }

    const interview = await Interview.create({
      student: req.user._id,
      role: role.trim(),
      level,
      type,
      questionCount: count,
    });

    res.status(201).json(interview);
  } catch (err) {
    res.status(500).json({ message: "Failed to create interview session", error: err.message });
  }
};

// @route  POST /api/interviews/:id/ephemeral-token   (student only — must own this interview)
const createEphemeralToken = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    if (interview.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only access your own interviews" });
    }

    if (interview.status === "Completed") {
      return res.status(400).json({ message: "This interview has already been completed" });
    }

    const systemInstruction = buildSystemInstruction({
      role: interview.role,
      level: interview.level,
      type: interview.type,
      questionCount: interview.questionCount,
    });

    const token = await liveClient.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: process.env.GEMINI_LIVE_MODEL,
          config: {
            responseModalities: ["AUDIO"],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: { parts: [{ text: systemInstruction }] },
          },
        },
      },
    });

    res.json({ token: token.name, model: process.env.GEMINI_LIVE_MODEL });
  } catch (err) {
    console.error("Failed to create ephemeral token:", err.message);
    res.status(500).json({ message: "Failed to start interview session", error: err.message });
  }
};

// @route  GET /api/interviews/:id   (student only — must own this interview)
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    if (interview.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only access your own interviews" });
    }

    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch interview", error: err.message });
  }
};

// @route  PATCH /api/interviews/:id/transcript   (student only — save the conversation, then score it)
const saveTranscript = async (req, res) => {
  try {
    const { turns } = req.body; // [{ role: "model" | "user", text: "..." }] in chronological order
    if (!Array.isArray(turns)) {
      return res.status(400).json({ message: "Transcript turns are required" });
    }

    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    if (interview.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own interviews" });
    }

    if (interview.status === "Completed") {
      return res.status(400).json({ message: "This interview has already been saved" });
    }

    const cleanTurns = turns
      .filter((t) => t && (t.role === "model" || t.role === "user") && typeof t.text === "string")
      .map((t) => ({ role: t.role, text: t.text.slice(0, 4000) }));

    // Each AI question is followed by the student's answer. The closing line is not a question.
    const questions = [];
    for (let i = 0; i < cleanTurns.length; i++) {
      const turn = cleanTurns[i];
      if (turn.role !== "model") continue;
      if (turn.text.toLowerCase().includes(CONCLUSION_MARKER)) continue;

      const next = cleanTurns[i + 1];
      questions.push({
        question: turn.text,
        answer: next && next.role === "user" ? next.text : "",
      });
    }

    const answeredCount = questions.filter((q) => q.answer.trim()).length;
    if (answeredCount === 0) {
      interview.questions = questions;
      interview.status = "Abandoned";
      await interview.save();
      return res.json(interview);
    }

    interview.questions = questions;
    interview.status = "Completed";

    const analysis = await analyzeInterview(questions, {
      role: interview.role,
      level: interview.level,
      type: interview.type,
    });

    if (analysis) {
      interview.overallScore = analysis.overallScore;
      interview.technicalScore = analysis.technicalScore;
      interview.communicationScore = analysis.communicationScore;
      interview.relevanceScore = analysis.relevanceScore;
      interview.completenessScore = analysis.completenessScore;
      interview.confidenceScore = analysis.confidenceScore;
      interview.strengths = analysis.strengths || [];
      interview.improvements = analysis.improvements || [];
      interview.recommendation = analysis.recommendation || "";

      interview.questions = interview.questions.map((q, i) => ({
        ...q.toObject(),
        score: analysis.questionFeedback?.[i]?.score,
        feedback: analysis.questionFeedback?.[i]?.feedback,
      }));
    }

    await interview.save();
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: "Failed to save transcript", error: err.message });
  }
};

// @route  GET /api/interviews   (student only — their completed interviews, newest first)
const getMyInterviews = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query, 10);
    const filter = { student: req.user._id, status: "Completed" };

    const [interviews, total, recent] = await Promise.all([
      Interview.find(filter)
        .select("role level type questionCount overallScore createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Interview.countDocuments(filter),
      Interview.find({ ...filter, overallScore: { $ne: null } })
        .select("overallScore createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const recentScores = recent.reverse().map((i) => ({ score: i.overallScore, date: i.createdAt }));

    res.json({ ...buildPaginatedResponse(interviews, total, page, limit), recentScores });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch interview history", error: err.message });
  }
};

module.exports = { createEphemeralToken, createInterview, getInterviewById, saveTranscript, getMyInterviews };