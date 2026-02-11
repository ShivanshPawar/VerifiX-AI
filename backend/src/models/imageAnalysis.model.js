const mongoose = require("mongoose");

const imageAnalysisSchema = new mongoose.Schema(
    {
        // Unique hash of uploaded image (used to prevent re-processing)
        imageHash: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        // Final AI verdict classification
        verdict: {
            type: String,
            enum: ["AUTHENTIC", "MANIPULATED", "INCONCLUSIVE"],
            required: true
        },
        // Confidence score returned by AI (1% – 100%)
        confidencePercent: {
            type: Number,
            min: 1,
            max: 100,
            required: true
        },

        // Cleaned and structured report for frontend display
        report: {
            type: Object,
            required: true
        },

        // Raw AI response stored for debugging or frontend work
        aiRawResponse: {
            type: Object,
            required: true
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("ImageAnalysis", imageAnalysisSchema);
