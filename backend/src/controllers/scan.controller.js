const fs = require("fs");
const Scan = require("../models/scan.model");
const { generateImageHash } = require("../utils/hash.util");

// Controller to create a new scan for deepfake detection
exports.createScan = async (req, res) => {
    try {
        // Validate that an image file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Image is required!" })
        }
        
        // Generate a hash of the uploaded image for comparison
        const imageHash = generateImageHash(req.file.path);

        // Create a new scan record in the database
        const scan = await Scan.create({
            user: req.user.id,
            fileName: req.file.originalName,
            imageHash
        })

        // Remove the temporary image file from the server
        fs.unlinkSync(req.file.path);

        // Return the scan details to the client
        res.status(201).json({
            message: "scan intialized",
            scanId: scan._id,
            status: scan.status
        })
    } catch (error) {
        // Handle any errors during the scan creation process
        res.status(500).json({ message: "Scan failed", error: error.message });
    }
}