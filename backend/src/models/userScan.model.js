const mongoose = require("mongoose");


const UserScanSchema = new mongoose.Schema(
    {
        // Reference to the user who performed the scan
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Image hash (used for quick lookups or debugging)
        imageHash: {
            type: String,
            required: true
        },

        // Reference to stored AI analysis result
        analysis: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ImageAnalysis",
            required: true
        },

        // Timestamp when the scan was performed
        scannedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false
    }


);

module.exports = mongoose.model("UserScan", UserScanSchema)