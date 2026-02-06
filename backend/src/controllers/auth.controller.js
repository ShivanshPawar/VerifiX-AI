const env = require('../config/env');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');


// Register User Controller
exports.register = async (req, res) => {
    // Extract email, firstName, lastName, and password from request body
    const { email, fullName: { firstName, lastName }, password } = req.body;

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
    res.cookie("token", token)

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
    res.cookie("token", token)

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