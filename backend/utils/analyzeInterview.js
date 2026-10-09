const model = require("../config/gemini");

async function analyzeInterview(questions, { role, level, type }) {
  const transcript = questions
    .map((q, i) => `Q${i + 1}: ${q.question}\nA${i + 1}: ${q.answer || "(no answer given)"}`)
    .join("\n\n");

  const prompt = `You are evaluating a mock interview transcript for a ${level} ${role} position (${type} interview).

Transcript:
${transcript}

Evaluate the candidate's performance. Respond with ONLY a JSON object in this exact format, no other text:
{
  "overallScore": <0-100>,
  "technicalScore": <0-100>,
  "communicationScore": <0-100>,
  "relevanceScore": <0-100>,
  "completenessScore": <0-100>,
  "confidenceScore": <0-100>,
  "strengths": ["<short strength point>", "..."],
  "improvements": ["<short improvement point>", "..."],
  "recommendation": "<one or two sentence overall recommendation>",
  "questionFeedback": [
    { "score": <0-10>, "feedback": "<one short sentence>" },
    ...one entry per question, in order
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\s*|\s*```$/g, "");
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Interview analysis failed:", err.message);
    return null;
  }
}

module.exports = analyzeInterview;