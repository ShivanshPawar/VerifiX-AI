const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');

// Imports Routes
const authRoutes = require("./routes/auth.routes");
const scanRoutes = require("./routes/scan.routes");
const historyRoutes = require("./routes/history.routes");

// App intialization
const app = express();

// Using Middlewares
const allowedFrontendOrigin = env.frontend_origin
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === allowedFrontendOrigin) {
            return callback(null, true)
        }
        return callback(new Error(`CORS origin denied: ${origin}`))
    },
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())


// Sample Route
app.get('/', (req, res) => {
    res.send("Deepfake-Detection")
})

// Auth Routes prefix /api/v1/auth (e.g : http://localhost:3000/api/v1/auth/authRoutes)
app.use("/api/v1/auth/", authRoutes)
// Scan Protected Route 
app.use("/api/v1/scan/", scanRoutes)
// History Protected Route 
app.use("/api/v1/history", historyRoutes)
// Dashboard Protected Route (also under /api/v1 for frontend consistency)
const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);


module.exports = app;