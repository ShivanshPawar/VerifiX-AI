const mongoose = require("mongoose");


const UserScanSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        imageHash: {
            type: String,
            required: true
        },

        analysis: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "imageAnalysis",
            required: true
        },

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