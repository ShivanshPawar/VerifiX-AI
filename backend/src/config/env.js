function parseBoolean(value, fallback) {
    if (value === undefined || value === null || value === "") return fallback;

    const normalized = String(value).trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "off"].includes(normalized)) return false;

    throw new Error(`Invalid boolean environment value: ${value}`);
}

function parseFrontendOrigins() {
    const raw = process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN;
    const fallback = "http://localhost:5173,http://localhost:5174";

    return (raw || fallback)
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}

function parseSameSite(nodeEnv) {
    const fallback = nodeEnv === "production" ? "none" : "lax";
    const sameSite = String(process.env.COOKIE_SAME_SITE || fallback).trim().toLowerCase();
    const allowedValues = new Set(["none", "lax", "strict"]);

    if (!allowedValues.has(sameSite)) {
        throw new Error("COOKIE_SAME_SITE must be one of: none, lax, strict");
    }

    return sameSite;
}

function parseMaxAge() {
    const maxAge = Number(process.env.AUTH_COOKIE_MAX_AGE_MS);

    if (Number.isFinite(maxAge) && maxAge > 0) return maxAge;

    return 24 * 60 * 60 * 1000;
}

function validateEnv(env) {
    if (!env.jwt_secret) {
        throw new Error("JWT_SECRET is required for authentication");
    }
}

const nodeEnv = process.env.NODE_ENV || "development";
const frontendOrigins = parseFrontendOrigins();

const env = {
    port: process.env.PORT || 3000,
    mongouri: process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET,
    node_env: nodeEnv,
    rd_api_key: process.env.REALITY_DEFENDER_API_KEY,
    gemini_api_key: process.env.GEMINI_API_KEY,
    frontend_origin: frontendOrigins[0],
    frontend_origins: frontendOrigins,
    cookie_same_site: parseSameSite(nodeEnv),
    cookie_secure: parseBoolean(process.env.COOKIE_SECURE, nodeEnv === "production"),
    auth_cookie_max_age_ms: parseMaxAge()
}

validateEnv(env);

module.exports = env;
