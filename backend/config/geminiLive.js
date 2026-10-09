const { GoogleGenAI } = require("@google/genai");

// Separate client specifically for Live API token minting —
// distinct from the text-based Gemini client used for AI matching.
const liveClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports = liveClient;