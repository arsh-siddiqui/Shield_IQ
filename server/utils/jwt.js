const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signToken(userId) {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

/**
 * Signs a JWT for the given user and sets it as an httpOnly cookie on the
 * response. httpOnly + sameSite keep the token out of reach of JS running
 * on the page (mitigating XSS token theft); secure is enabled outside dev
 * so it's only ever sent over HTTPS.
 */
function sendTokenCookie(res, userId) {
  const token = signToken(userId);

  res.cookie(env.JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
}

function clearTokenCookie(res) {
  res.clearCookie(env.JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  });
}

module.exports = { signToken, sendTokenCookie, clearTokenCookie };
