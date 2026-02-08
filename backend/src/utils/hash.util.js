// Import the crypto module for hashing operations
const crypto = require("crypto");
// Import the fs module for file system operations
const fs = require("fs");

// Function to generate a SHA256 hash of an image file
const generateImageHash = (filePath) => {
    // Read the file contents into a buffer
    const fileBuffer = fs.readFileSync(filePath);
    // Create a SHA256 hash of the file buffer and return as hexadecimal string
    return crypto.createHash("sha256").update(fileBuffer).digest("hex")
};

// Export the function for use in other modules
module.exports = { generateImageHash };