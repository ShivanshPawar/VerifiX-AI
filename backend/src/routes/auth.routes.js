const express = require("express");
const router = express.Router();


const authController = require("../controllers/auth.controller");

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

// Logout — clears auth + guest trial cookies
router.post("/logout", authController.logout);

module.exports = router;