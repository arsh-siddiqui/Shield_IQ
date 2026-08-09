require("dotenv").config();

/**
 * Central place all environment variables are read from. Every other file
 * imports from here instead of calling process.env directly, so defaults
 * and validation only live in one place.
 */
const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,

  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shieldiq",

  JWT_SECRET: process.env.JWT_SECRET || "dev-only-insecure-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  JWT_COOKIE_NAME: "shieldiq_token",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  ADMIN_SEED_EMAIL: process.env.ADMIN_SEED_EMAIL || "admin@shieldiq.app",
  ADMIN_SEED_PASSWORD: process.env.ADMIN_SEED_PASSWORD || "ChangeMe123!",
};

const isProd = env.NODE_ENV === "production";

if (isProd && env.JWT_SECRET === "dev-only-insecure-secret-change-me") {
  // eslint-disable-next-line no-console
  console.warn(
    "[shieldiq] WARNING: JWT_SECRET is using the insecure development default in production. " +
      "Set a real JWT_SECRET in your environment before deploying."
  );
}

module.exports = env;
