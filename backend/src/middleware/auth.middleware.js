const env = require("../config/env")
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

function getBearerToken(req) {
    const authorization = req.get("authorization");

    if (!authorization) return { token: null };

    const match = authorization.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1]?.trim();

    if (!token || token.includes(" ")) {
        return { error: "Malformed authorization header" };
    }

    return { token };
}

// Middleware to authenticate requests using JWT tokens
module.exports = async function authMiddleware(req, res, next) {

    try {
        const bearerToken = getBearerToken(req);

        if (bearerToken.error) {
            return res.status(401).json({ message: bearerToken.error });
        }

        // Browsers authenticate with the httpOnly cookie; API clients may use Bearer tokens.
        const token = req.cookies?.token || bearerToken.token;

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Verify and decode the JWT token using the secret key
        const decoded = jwt.verify(token, env.jwt_secret);

        if (!decoded?.userId) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        // Fetch the user from database using the userId from decoded token
        const user = await User.findById(decoded.userId).select("-password")

        // Return error if user doesn't exist
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            })
        }

        // Attach user information to the request object for use in middleware/routes
        req.user = {
            id: user._id,
            userId: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role || "user"
        };

        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
        if (error?.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }

        if (error?.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}
