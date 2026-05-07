const env = {

    port: process.env.PORT || 3000,
    mongouri: process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET,
    node_env: process.env.NODE_ENV || "development",
    rd_api_key: process.env.REALITY_DEFENDER_API_KEY,
    gemini_api_key: process.env.GEMINI_API_KEY,
    frontend_origin: process.env.FRONTEND_ORIGIN || "http://localhost:5174",
    cookie_secure: process.env.COOKIE_SECURE === "true",
    auth_cookie_max_age_ms: Number(process.env.AUTH_COOKIE_MAX_AGE_MS) || (24 * 60 * 60 * 1000)
}


module.exports = env;