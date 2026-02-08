const env = require("../config/env")
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Middleware to authenticate requests using JWT tokens
module.exports = async function authMiddleware(req, res, next) {

    try {
        // Extract the authorization header from the request
        const authHeader = req.headers.authorization;

        // Check if authorization header exists and follows "Bearer <token>" format
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Extract the token from the "Bearer <token>" format
        const token = authHeader.split(" ")[1];

        // Verify and decode the JWT token using the secret key
        const decoded = jwt.verify(token, env.jwt_secret);

        // Fetch the user from database using the userId from decoded token
        const user = await User.findById(decoded.userId).select("-password")

        // Return error if user doesn't exist
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        // Attach user information to the request object for use in subsequent middleware/routes
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role || "user"
        };

        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
        // Return error for invalid or expired tokens
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}