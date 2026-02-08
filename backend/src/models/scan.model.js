const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    filename: String,

    imageHash: {
      type: String,
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING"
    },

    verdict: {
      type: String,
      enum: ["AUTHENTIC", "MANIPULATED", "SUSPICIOUS"],
    },

    score: Number,

    aiRawResponse: {
      type: Object   // full Reality Defender JSON
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scan", scanSchema);
