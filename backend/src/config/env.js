const env = {

    port: process.env.PORT || 3000,
    mongouri: process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET,
    rd_api_key: process.env.REALITY_DEFENDER_API_KEY,
    gemini_api_key: process.env.GEMINI_API_KEY
}


module.exports = env;