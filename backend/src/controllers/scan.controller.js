const Scan = require("../models/scan.model");
const { generateImageHash } = require("../utils/hash.util");
const { analyzeImage } = require("../services/realityDefender.service");
const { generateScanReport } = require("../services/geminiReport.service");

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

    console.log("Image send to the Reality Defender");

    // AI Detection (SYNC)
    const aiResult = await analyzeImage(
      req.file.buffer,
      req.file.originalname
    );

    console.log("Scan Completed and image send to the AI to Generate report");

    // AI Report Generation 
    const report = await generateScanReport({
      verdict: aiResult.verdict,
      score: Math.round(aiResult.score * 100),
      aiRawResponse: aiResult.raw,
    })

    console.log("Data fetched");


    // Update scan
    scan.status = "COMPLETED";
    scan.verdict = aiResult.verdict;
    scan.score = Math.round(aiResult.score * 100);
    scan.aiRawResponse = aiResult.raw;
    scan.report = report;

    await scan.save();

    console.log("Final Scan :", {
      scanId: scan._id,
      status: scan.status,
      verdict: scan.verdict,
      score: scan.score,
      report: report,
    });

    return res.status(200).json({
      message: "Scan completed",
      scanId: scan._id,
      status: scan.status,
      verdict: scan.verdict,
      score: scan.score,
      report,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Scan failed",
      error: error.message,
    });
  }
};
