const env = require("../config/env");
const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in environment variables");
}

const ai = new GoogleGenAI({
  apiKey: env.gemini_api_key,
});

module.exports = ai;
