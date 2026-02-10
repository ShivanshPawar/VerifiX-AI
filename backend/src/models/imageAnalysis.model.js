const mongoose = require("mongoose");

const imageAnalysisSchema = new mongoose.Schema(
    {
        imageHash: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        verdict: {
            type: String,
            enum: ["AUTHENTIC", "MANIPULATED", "INCONCLUSIVE"],
            required: true
        },

        confidencePercent: {
            type: Number,
            min: 1,
            max: 100,
            required: true
        },

        report: {
            type: Object,
            required: true
        },

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
