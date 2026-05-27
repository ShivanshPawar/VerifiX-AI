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

function getTokenCandidates(req, bearerToken) {
    return [...new Set([req.cookies?.token, bearerToken.token].filter(Boolean))];
}

function verifyTokenCandidates(tokens) {
    let lastError = null;

    for (const token of tokens) {
        try {
            const decoded = jwt.verify(token, env.jwt_secret);

            if (decoded?.userId) {
                return { decoded };
            }

            lastError = new Error("Invalid token payload");
        } catch (error) {
            lastError = error;
        }
    }

    return { error: lastError };
}

// Middleware to authenticate requests using JWT tokens
module.exports = async function authMiddleware(req, res, next) {

    try {
        const bearerToken = getBearerToken(req);

        if (bearerToken.error) {
            return res.status(401).json({ message: bearerToken.error });
        }

        // Browsers prefer the httpOnly cookie; split-origin deploys may fall back to Bearer tokens.
        const tokenCandidates = getTokenCandidates(req, bearerToken);

        if (!tokenCandidates.length) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const tokenVerification = verifyTokenCandidates(tokenCandidates);

        if (tokenVerification.error) {
            throw tokenVerification.error;
        }

        if (!tokenVerification.decoded?.userId) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        // Fetch the user from database using the userId from decoded token
        const user = await User.findById(tokenVerification.decoded.userId).select("-password")

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
