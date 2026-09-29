const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model name lives in .env so it can be changed without touching code —
// Google retires model names every few months, and this has already bitten us once.
const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
});

module.exports = model;