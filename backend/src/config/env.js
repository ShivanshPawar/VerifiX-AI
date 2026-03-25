const env = {

    port: process.env.PORT || 3000,
    mongouri: process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET,
    rd_api_key: process.env.REALITY_DEFENDER_API_KEY,
    gemini_api_key: process.env.GEMINI_API_KEY,
    frontend_origin: process.env.FRONTEND_ORIGIN || "http://localhost:5174",
    cookie_secure: process.env.COOKIE_SECURE === "true"
}


module.exports = env;