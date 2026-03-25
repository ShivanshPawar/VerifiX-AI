const { generateImageHash } = require("../utils/hash.util");
const { analyzeImage } = require("../services/realityDefender.service");
const { generateScanReport } = require("../services/geminiReport.service");
const ImageAnalysis = require("../models/imageAnalysis.model");
const UserScan = require("../models/userScan.model")
const sharp = require("sharp");
const env = require("../config/env");

function guestCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.cookie_secure,
  };
}

function normalizeRdModels(raw) {
  const models = raw?.models;
  if (!models) return [];

  // RD SDK typically returns an array; handle object map as well.
  const list = Array.isArray(models)
    ? models
    : Object.entries(models).map(([name, value]) => ({ name, ...value }));

  return list
    .map((m) => {
      const name = m?.name ?? m?.model ?? m?.id ?? m?.key ?? "Model";
      const status = m?.status ?? m?.verdict ?? m?.label ?? m?.result ?? null;
      const scoreLike =
        typeof m?.score === "number"
          ? m.score
          : (typeof m?.confidence === "number" ? m.confidence : null);

      // Normalize to 0–100 always:
      // - If field already looks like percent (>1), keep as-is.
      // - If it looks like 0–1, convert to percent.
      const rawPercent =
        typeof m?.confidence_percent === "number"
          ? m.confidence_percent
          : typeof scoreLike === "number"
            ? (scoreLike > 1 ? scoreLike : scoreLike * 100)
            : null;

      const confidence_percent =
        typeof rawPercent === "number"
          ? Math.max(0, Math.min(100, Math.round(rawPercent)))
          : null;

      return {
        name: String(name),
        status: status ? String(status) : null,
        confidence_percent,
        raw: m
      };
    })
    .filter((m) => m.name);
}
exports.createScan = async (req, res) => {

  // Simplify cleint messege
  const userId = req.user.id;
  const buffer = req.file.buffer;
  const originalName = req.file.originalname
  const title = req.body.title || "Untitled Scan";
  try {

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Generate hash
    const imageHash = generateImageHash(req.file.buffer);

    // Generate small compressed thumbnail (per user)
    const thumbnailBuffer = await sharp(buffer)
      .resize(120, 120)
      .jpeg({ quality: 35 })
      .toBuffer();

    const thumbnailBase64 = thumbnailBuffer.toString("base64");

    // Checks the image hash already exists in database 
    let analysis = await ImageAnalysis.findOne({ imageHash })

    // If image hash already exists in database, use cached analysis
    if (analysis) {
      // Create a user scan record linking user to existing analysis
      await UserScan.create({
        user: userId,
        imageHash,
        analysis: analysis._id,
        title,
        thumbnail: thumbnailBase64
      })

      // Return cached results without re-analyzing
      const models = normalizeRdModels(analysis.aiRawResponse);
      return res.json({
        message: "Scan Completed",
        source: "CACHE",
        verdict: analysis.verdict,
        confidence_percent: analysis.confidencePercent,
        manipulation_type: analysis.manipulationType,
        report: analysis.report,
        models,
        raw_result: analysis.aiRawResponse
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
    const models = normalizeRdModels(aiRawResponse);

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
      analysis: analysis._id,
      title,
      thumbnail: thumbnailBase64
    })

    // Response send to the client
    return res.status(200).json({
      message: "Scan completed",
      source: "NEW_ANALYSIS",
      verdict,
      confidence_percent: confidencePercent,
      report,
      models,
      raw_result: aiRawResponse
    })


  } catch (error) {
    return res.status(500).json({
      message: "Scan failed",
      error: error.message,
    });
  }
};

/** One free scan before sign-up: no auth; does not create UserScan; sets guest_scan_used cookie after success */
exports.guestScan = async (req, res) => {
  if (req.cookies?.guest_scan_used === "1") {
    return res.status(403).json({
      message: "Free trial scan used. Sign up or sign in to scan more images.",
    });
  }

  const buffer = req.file?.buffer;
  const originalName = req.file?.originalname || "upload.jpg";

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageHash = generateImageHash(req.file.buffer);

    const thumbnailBuffer = await sharp(buffer)
      .resize(120, 120)
      .jpeg({ quality: 35 })
      .toBuffer();

    const thumbnailBase64 = thumbnailBuffer.toString("base64");

    let analysis = await ImageAnalysis.findOne({ imageHash });

    if (analysis) {
      const models = normalizeRdModels(analysis.aiRawResponse);
      res.cookie("guest_scan_used", "1", guestCookieOptions());
      return res.json({
        message: "Scan Completed",
        source: "CACHE",
        guest: true,
        verdict: analysis.verdict,
        confidence_percent: analysis.confidencePercent,
        manipulation_type: analysis.manipulationType,
        report: analysis.report,
        models,
        raw_result: analysis.aiRawResponse,
        thumbnail_preview: thumbnailBase64,
      });
    }

    const rdResult = await analyzeImage(buffer, originalName);
    const verdict = rdResult.verdict;
    const confidencePercent = Math.round(rdResult.score * 100);
    const aiRawResponse = rdResult.raw;
    const models = normalizeRdModels(aiRawResponse);

    const report = await generateScanReport({
      verdict: verdict,
      score: confidencePercent,
      aiRawResponse: aiRawResponse,
    });

    analysis = await ImageAnalysis.create({
      imageHash,
      verdict,
      confidencePercent,
      report,
      aiRawResponse,
    });

    res.cookie("guest_scan_used", "1", guestCookieOptions());

    return res.status(200).json({
      message: "Scan completed",
      source: "NEW_ANALYSIS",
      guest: true,
      verdict,
      confidence_percent: confidencePercent,
      report,
      models,
      raw_result: aiRawResponse,
      thumbnail_preview: thumbnailBase64,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Scan failed",
      error: error.message,
    });
  }
};
