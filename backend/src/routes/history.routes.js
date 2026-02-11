const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

// History controller methods
const { getUserHistory, getScanDetails, deleteHistory } = require("../controllers/history.controller");

// Fetch paginated scan history of the logged-in user
router.get("/", authMiddleware, getUserHistory);

// Fetch detailed scan result by scan ID
router.get("/:id", authMiddleware, getScanDetails);

// Delete a specific scan history entry
router.delete("/:id", authMiddleware, deleteHistory);

module.exports = router;