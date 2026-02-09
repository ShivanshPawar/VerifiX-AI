const express = require("express");
const router = express.Router()

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { createScan } = require("../controllers/scan.controller");


// Authenticated route to scan an image for deepfake detection
router.post("/image", authMiddleware, upload.single("image"), createScan);

module.exports = router;


