const { RealityDefender } = require("@realitydefender/realitydefender");
const env = require("./env");

// Checks Reality Defender API key is available or not in env.js/.env (if not throw's error)
if (!env.rd_api_key) {
    throw new Error("Reality defender api key is missing");
}

// Rreates a client (connection object)
const rdClient = new RealityDefender({
    apiKey: env.rd_api_key
});

module.exports = rdClient;