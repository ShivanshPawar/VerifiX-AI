const ai = require("../config/gemini.config");


// Generate's human-readable report from Reality Defender response
exports.generateScanReport = async ({ verdict, score, aiRawResponse }) => {
    try {
        const prompt = `
You are generating a simple, user-friendly AI image authenticity report.

IMPORTANT RULES:
- The verdict provided is FINAL and must be respected
- NEVER contradict or override the verdict
- LOW confidence means low evidence of manipulation, NOT guaranteed authenticity
- Use simple, non-technical language
- Do NOT mention AI models or internal systems
- Do NOT invent new manipulation labels
- Output ONLY valid JSON

Verdict: ${verdict}
Confidence Percent: ${score}
Ai Raw Response: ${aiRawResponse} 

Probability Interpretation:
1% – 20% → Low evidence of manipulation detected
21% – 70% → Suspicious signals detected, needs review
71% – 99% → Strong evidence of AI-based manipulation

Return JSON in this format:
{
  "summary": "",
  "confidence_level": "LOW | MEDIUM | HIGH",
  "confidence_percent": number,
  "manipulation_type": "Face-Swap | Edited | AI-Generated | Partial-Manipulation | No Clear - Manipulation | Uncertain",
  "what_this_means": [],
  "recommended_action": ""
}
`;




        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        });

        const text = response.text;
        return JSON.parse(text);


    } catch (error) {
        console.error("Gemini report error : ", error);
        throw new Error("Failed to generate AI report");
    }
};