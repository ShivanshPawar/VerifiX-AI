const env = {

    port: process.env.PORT || 3000,
    mongouri: process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET,
    rd_api_key: process.env.REALITY_DEFENDER_API_KEY,
    rd_base_url: process.env.REALITY_DEFENDER_BASE_URL
}


module.exports = env;