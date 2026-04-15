const env = require('../config/env');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

function getCookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: env.cookie_secure
    };
}

// Register User Controller
exports.register = async (req, res) => {
    // Extract email, firstName, lastName, and password from request body
    const { email, fullName, password } = req.body;
    const firstName = fullName?.firstName;
    const lastName = fullName?.lastName;

    if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({
            message: "email, fullName.firstName, fullName.lastName, and password are required"
        });
    }

    // Check if user with this email already exists in database
    const userExists = await userModel.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password using bcrypt with salt rounds of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document in database with hashed password
    const user = await userModel.create({
        email,
        fullName: {
            firstName: firstName,
            lastName: lastName
        },
        password: hashedPassword
    });

    // Generate JWT token with userId payload and secret key
    const token = jwt.sign({ userId: user._id }, env.jwt_secret);

    // Set token in HTTP-only cookie for client
    res.cookie("token", token, getCookieOptions())

    // Send success response with user details
    res.status(201).json({
        message: "user register successfully",
        user: {
            userId: user._id,
            email: user.email,
            fullName: user.fullName
        }
    });
};

// Login User Controller
exports.login = async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Find user by email in database
    const user = await userModel.findOne({ email });

    // Return error if user not found
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Return error if password doesn't match
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password please try again" });
    }

    // Generate JWT token with 24 hour expiration
    const token = jwt.sign({ userId: user._id }, env.jwt_secret, { expiresIn: "24h" });

    // Set token in HTTP-only cookie
    res.cookie("token", token, getCookieOptions())

    // Send success response with user details
    res.status(200).json({
        message: "User Logged in Successfully",
        user: {
            userId: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })
}

exports.logout = (req, res) => {
    res.clearCookie("token", getCookieOptions());
    res.clearCookie("guest_scan_used", getCookieOptions());
    res.status(200).json({ message: "Logged out" });
};

// AI code: Session validation endpoint used by the frontend during startup.
exports.getCurrentUser = async (req, res) => {
    res.status(200).json({
        user: {
            userId: req.user.userId,
            email: req.user.email,
            fullName: req.user.fullName
        }
    });
};
