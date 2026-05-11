const express = require("express");
const router = express.Router();


const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

// Logout — clears auth + guest trial cookies
router.post("/logout", authController.logout);

// Lightweight session check for restoring auth state after refresh.
router.get("/me", authMiddleware, authController.getCurrentUser);

module.exports = router;
