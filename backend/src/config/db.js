const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(env.mongouri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Database connection failed ", error);
    }
};

module.exports = connectDB;