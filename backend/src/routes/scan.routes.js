const express = require("express");
const router = express.Router()

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const scanController = require("../controllers/scan.controller");


// Route to scan an image for deepfake detection
router.post("/image", authMiddleware, upload.single("image"), scanController.createScan);

module.exports = router;


