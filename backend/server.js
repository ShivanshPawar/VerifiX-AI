require('dotenv').config(); // load .env FIRST

const app = require('./src/app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');


connectDB(); // Connect to Database


// Start the server
app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
});