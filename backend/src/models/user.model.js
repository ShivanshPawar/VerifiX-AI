const mongoose = require('mongoose');


// User Schema
const userSchema = new mongoose.Schema({
    // Email field
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    // Full Name field
    fullName: {
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        }
    },

    // Password field
    password: {
        type: String,
        required: true
    },

},
    {
        timestamps: true
    }
)

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;