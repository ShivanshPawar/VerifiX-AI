const { generateImageHash } = require("../utils/hash.util");
const { analyzeImage } = require("../services/realityDefender.service");
const { generateScanReport } = require("../services/geminiReport.service");
const ImageAnalysis = require("../models/imageAnalysis.model");
const UserScan = require("../models/userScan.model");
const sharp = require("sharp");
const env = require("../config/env");

// ─── Constants ────────────────────────────────────────────────────────────────

const MODEL_DISPLAY_NAMES = {
  "rd-img-ensemble": "Final AI Verdict",
  "rd-context-img": "Context Analysis",
  "rd-pine-img": "Facial Integrity Check",
  "rd-full-pine-img": "Advanced Facial Analysis",
  "rd-elm-img": "Texture Analysis",
  "rd-full-elm-img": "Detailed Texture Scan",
  "rd-oak-img": "Artifact Detection",
  "rd-full-oak-img": "Advanced Artifact Detection",
  "rd-cedar-img": "Image Consistency Check",
  "rd-full-cedar-img": "Deep Consistency Analysis",
};

// ─── Private helpers ──────────────────────────────────────────────────────────

function guestCookieOptions() {
  return { httpOnly: true, sameSite: "lax", secure: env.cookie_secure };
}

/** Normalize raw RD model list into a clean, client-safe shape with display names. */
function normalizeRdModels(raw) {
  const models = raw?.models;
  if (!models) return [];

  const list = Array.isArray(models)
    ? models
    : Object.entries(models).map(([name, value]) => ({ name, ...value }));

  return list
    .map((m) => {
      const name = String(m?.name ?? m?.model ?? m?.id ?? m?.key ?? "");
      const status = m?.status ?? m?.verdict ?? m?.label ?? m?.result ?? null;

      const scoreLike =
        typeof m?.score === "number" ? m.score :
          typeof m?.confidence === "number" ? m.confidence : null;

      const rawPercent =
        typeof m?.confidence_percent === "number" ? m.confidence_percent :
          typeof scoreLike === "number" ? (scoreLike > 1 ? scoreLike : scoreLike * 100) : null;

      const confidence_percent =
        typeof rawPercent === "number"
          ? Math.max(0, Math.min(100, Math.round(rawPercent)))
          : null;

      return {
        name,
        display_name: MODEL_DISPLAY_NAMES[name.toLowerCase()] ?? name,
        status: status ? String(status) : null,
        confidence_percent,
      };
    })
    .filter((m) => m.name);
}

/** Generate a small compressed thumbnail and return it as a base64 string. */
async function generateThumbnail(buffer) {
  const thumbnailBuffer = await sharp(buffer)
    .resize(120, 120)
    .jpeg({ quality: 35 })
    .toBuffer();
  return thumbnailBuffer.toString("base64");
}

/**
 * Look up a cached analysis or run a fresh one.
 * Returns { analysis, models, source }.
 */
async function getOrCreateAnalysis(imageHash, buffer, originalName) {
  const cached = await ImageAnalysis.findOne({ imageHash });
  if (cached) {
    return {
      analysis: cached,
      models: normalizeRdModels(cached.aiRawResponse),
      source: "CACHE",
    };
  }

  const rdResult = await analyzeImage(buffer, originalName);
  const verdict = rdResult.verdict;
  const confidencePercent = Math.round(rdResult.score * 100);
  const aiRawResponse = rdResult.raw;
  const models = normalizeRdModels(aiRawResponse);

  const report = await generateScanReport({
    verdict,
    score: confidencePercent,
    aiRawResponse,
  });

  const analysis = await ImageAnalysis.create({
    imageHash,
    verdict,
    confidencePercent,
    report,
    aiRawResponse,
  });

  return { analysis, models, source: "NEW_ANALYSIS" };
}

// ─── Controllers ──────────────────────────────────────────────────────────────

exports.createScan = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const userId = req.user.id;
  const { buffer, originalname: originalName } = req.file;
  const title = req.body.title?.trim() || "Untitled Scan";

  try {
    const imageHash = generateImageHash(buffer);
    const thumbnail = await generateThumbnail(buffer);

    const { analysis, models, source } = await getOrCreateAnalysis(imageHash, buffer, originalName);

    await UserScan.create({
      user: userId,
      imageHash,
      analysis: analysis._id,
      title,
      thumbnail,
    });

    return res.status(200).json({
      message: "Scan completed",
      source,
      verdict: analysis.verdict,
      confidence_percent: analysis.confidencePercent,
      manipulation_type: analysis.manipulationType ?? null,
      report: analysis.report,
      models,
    });
  } catch (error) {
    return res.status(500).json({ message: "Scan failed", error: error.message });
  }
};

/** One free scan before sign-up — no auth, no UserScan record, sets a cookie on success. */
exports.guestScan = async (req, res) => {
  if (req.cookies?.guest_scan_used === "1") {
    return res.status(403).json({
      message: "Free trial scan used. Sign up or sign in to scan more images.",
    });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const { buffer, originalname: originalName = "upload.jpg" } = req.file;

  try {
    const imageHash = generateImageHash(buffer);
    const thumbnail = await generateThumbnail(buffer);

    const { analysis, models, source } = await getOrCreateAnalysis(imageHash, buffer, originalName);

    res.cookie("guest_scan_used", "1", guestCookieOptions());

    return res.status(200).json({
      message: "Scan completed",
      source,
      guest: true,
      verdict: analysis.verdict,
      confidence_percent: analysis.confidencePercent,
      manipulation_type: analysis.manipulationType ?? null,
      report: analysis.report,
      models,
      thumbnail_preview: thumbnail,
    });
  } catch (error) {
    return res.status(500).json({ message: "Scan failed", error: error.message });
  }
};