const env = require("../config/env");

function getCookieOptions() {
    const sameSite = env.cookie_same_site;
    const secure = env.cookie_secure || sameSite === "none";

    return {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: env.auth_cookie_max_age_ms,
        path: "/",
    };
}

function getClearCookieOptions() {
    const { maxAge, ...options } = getCookieOptions();
    return options;
}

module.exports = { getCookieOptions, getClearCookieOptions };
