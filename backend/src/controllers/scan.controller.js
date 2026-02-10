const { generateImageHash } = require("../utils/hash.util");
const { analyzeImage } = require("../services/realityDefender.service");
const { generateScanReport } = require("../services/geminiReport.service");
const ImageAnalysis = require("../models/imageAnalysis.model");
const UserScan = require("../models/userScan.model")

exports.createScan = async (req, res) => {

  // Simplify cleint messege
  const userId = req.user.id;
  const buffer = req.file.buffer;
  const originalName = req.file.originalname

  try {

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Generate hash
    const imageHash = generateImageHash(req.file.buffer);

    // Checks the image hash already exists in database 
    let analysis = await ImageAnalysis.findOne({ imageHash })

    // If image hash already exists in database, use cached analysis
    if (analysis) {
      // Create a user scan record linking user to existing analysis
      await UserScan.create({
        user: userId,
        imageHash,
        analysis: analysis._id
      })

      // Return cached results without re-analyzing
      return res.json({
        message: "Scan Completed",
        source: "CACHE",
        verdict: analysis.verdict,
        confidence_percent: analysis.confidencePercent,
        manipulation_type: analysis.manipulationType,
        report: analysis.report
      });
    }

    // AI Detection (SYNC) Reality Defender
    const rdResult = await analyzeImage(
      buffer,
      originalName
    );

    // simplification
    const verdict = rdResult.verdict;
    const confidencePercent = Math.round(rdResult.score * 100);
    const aiRawResponse = rdResult.raw

    // AI Report Generation 
    const report = await generateScanReport({
      verdict: verdict,
      score: confidencePercent,
      aiRawResponse: aiRawResponse,
    })

    // Save global analysis
    analysis = await ImageAnalysis.create({
      imageHash,
      verdict,
      confidencePercent,
      report,
      aiRawResponse
    })

    // Save user history
    await UserScan.create({
      user: userId,
      imageHash,
      analysis: analysis._id
    })

    // Response send to the client
    return res.status(200).json({
      message: "Scan completed",
      source: "NEW_ANALYSIS",
      verdict,
      confidence_percent: confidencePercent,
      report
    })


  } catch (error) {
    return res.status(500).json({
      message: "Scan failed",
      error: error.message,
    });
  }
};
