const crypto = require("crypto");

const generateImageHash = (fileBuffer) => {
    // Read the file contents into a buffer
    return crypto.createHash("sha256").update(fileBuffer).digest("hex")
};

module.exports = { generateImageHash };