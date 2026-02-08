const multer = require("multer");
const path = require("path");
const os = require("os");

// Configure storage settings for uploaded files
const storage = multer.diskStorage({
    // Set destination to system temporary directory
    destination: os.tmpdir(),
    // Generate unique filename using timestamp and original filename
    filename: (_, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

// Filter files based on MIME type
const fileFilter = (_, file, cb) => {
    // Define allowed image MIME types
    const allowed = ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"];

    // Reject file if MIME type is not in allowed list
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"), false);
    }

    // Accept file if MIME type is valid
    cb(null, true);
};

// Initialize multer with storage config, file size limit, and filter
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },   // 10MB limit
    fileFilter
});

module.exports = upload;