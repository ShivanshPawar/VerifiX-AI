const express = require('express');
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");


// Authenticated route to get Deshboard Data
router.get("/", authMiddleware, dashboardController.getDashboard);

module.exports = router;