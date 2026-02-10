const mongoose = require('mongoose');
const env = require('./env');

// function to connect database
const connectDB = async () => {
    try {
        await mongoose.connect(env.mongouri); // Method
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Database connection failed ", error);
        process.exit(1);
    }
};

module.exports = connectDB;