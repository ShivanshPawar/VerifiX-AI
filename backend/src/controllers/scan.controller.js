const Scan = require("../models/scan.model");
const { generateImageHash } = require("../utils/hash.util");
const { analyzeImage } = require("../services/realityDefender.service");

exports.createScan = async (req, res) => {

  try {


    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Generate hash
    const imageHash = generateImageHash(req.file.buffer);

    // Create scan (PENDING)
    const scan = await Scan.create({
      user: req.user.id,
      filename: req.file.originalname,
      imageHash,
      status: "PENDING",
    });

    // AI Detection (SYNC)
    const aiResult = await analyzeImage(
      req.file.buffer,
      req.file.originalname
    );

    // Update scan
    scan.status = "COMPLETED";
    scan.verdict = aiResult.verdict;
    scan.score = aiResult.score;
    scan.aiRawResponse = aiResult.raw;

    await scan.save();

    console.log("Final Scan :", {
      scanId: scan._id,
      status: scan.status,
      verdict: scan.verdict,
      score: scan.score,
    });

    return res.status(200).json({
      message: "Scan completed",
      scanId: scan._id,
      status: scan.status,
      verdict: scan.verdict,
      score: scan.score,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Scan failed",
      error: error.message,
    });
  }
};
