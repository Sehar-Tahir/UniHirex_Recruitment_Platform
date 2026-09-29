const model = require("../config/gemini");

/**
 * Compares a set of skills against a set of requirements using AI,
 * returning a match percentage and a short explanation.
 */
async function getMatchScore(skills, requirements) {
  if (!skills || skills.length === 0 || !requirements || requirements.length === 0) {
    return { matchScore: 0, explanation: "Not enough information to compute a match." };
  }

  const prompt = `You are evaluating how well a person's skills match a set of job requirements.

Skills: ${skills.join(", ")}
Job requirements: ${requirements.join(", ")}

Consider that similar or equivalent skills should count as matches (e.g. "ReactJS" and "React.js" are the same thing, "Photoshop" and "Adobe Photoshop" are the same tool).

Respond with ONLY a JSON object in this exact format, no other text:
{"matchScore": <number 0-100>, "explanation": "<one short sentence, max 20 words>"}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Gemini sometimes wraps JSON in markdown code fences — strip those if present
    const cleaned = text.replace(/^```json\s*|\s*```$/g, "");
    const parsed = JSON.parse(cleaned);

    return {
      matchScore: Math.max(0, Math.min(100, Number(parsed.matchScore) || 0)),
      explanation: parsed.explanation || "No explanation provided.",
    };
  } catch (err) {
    console.error("Match score AI call failed:", err.message);
    return { matchScore: 0, explanation: "Unable to compute match score right now." };
  }
}

module.exports = getMatchScore;