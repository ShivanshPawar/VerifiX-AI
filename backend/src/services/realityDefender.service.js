const rdClient = require("../config/realityDefender.config");
const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Analyze image using Reality Defender
 * @param {Buffer} imageBuffer
 * @param {string} filename
 */
exports.analyzeImage = async (imageBuffer, filename) => {

  let tempFilePath = null;

  try {
    // Create a temporary file from the buffer
    // The RD SDK requires a file path, not a buffer
    const tempDir = os.tmpdir();
    const ext = path.extname(filename) || ".jpg";
    tempFilePath = path.join(tempDir, `rd-${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`);

    // Write buffer to temporary file
    fs.writeFileSync(tempFilePath, imageBuffer);

    // Use the detect method which handles upload and analysis
    const response = await rdClient.detect({
      filePath: tempFilePath,
    });

    if (!response || !response.status) {
      throw new Error("Invalid response from Reality Defender");
    }

    // Map the SDK response to our expected format
    // SDK returns: { status, score, models }
    return {
      verdict: response.status, // e.g., "MANIPULATED", "AUTHENTIC", etc.
      score: response.score, // Score between 0 and 1
      raw: response,
    };

  } catch (error) {

    console.error("Reality Defender error:", error);
    throw error;

  } finally {
    // Clean up temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error("Error cleaning up temp file:", cleanupError);
      }
    }
  }
};
