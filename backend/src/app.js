const express = require('express');

// Imports
const authRoutes = require("./routes/auth.routes");
const scanRoutes = require("./routes/scan.routes")

// App intialization
const app = express();

// Using Middlewares
app.use(express.json());

// Sample Route
app.get('/', (req, res) => {
    res.send("Deepfake-Detection")
})

// Auth Routes prefix /api/v1/auth (e.g : http://localhost:3000/api/v1/auth/authRoutes)
app.use("/api/v1/auth/", authRoutes)
// Scan Route Protected
app.use("/api/v1/scan/", scanRoutes)


module.exports = app;