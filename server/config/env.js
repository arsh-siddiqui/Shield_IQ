require('dotenv').config();

/**
 * Central place all environment variables are read from.
 * Every other file imports from here instead of calling process.env directly,
 * so defaults and validation only live in one place.
 */
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shieldiq',

  JWT_SECRET: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_COOKIE_NAME: 'shieldiq_token',

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  ADMIN_SEED_EMAIL: process.env.ADMIN_SEED_EMAIL || 'admin@shieldiq.app',
  ADMIN_SEED_PASSWORD: process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!',

  // ---------------------------------------------------------------------------
  // Threat Intelligence
  // ---------------------------------------------------------------------------

  /** PhishDestroy API URL */
  PHISHDESTROY_API_URL: process.env.PHISHDESTROY_API_URL || 'https://api.destroy.tools',

  /** Timeout for PhishDestroy API calls (ms) */
  PHISHDESTROY_TIMEOUT_MS: process.env.PHISHDESTROY_TIMEOUT_MS || '4000',

  /** Threat intel cache TTL in hours */
  THREAT_INTEL_CACHE_TTL: process.env.THREAT_INTEL_CACHE_TTL || '6',

  // ---------------------------------------------------------------------------
  // ML Inference Service
  // ---------------------------------------------------------------------------

  /** Base URL of the Python FastAPI ML service */
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8001',

  /** Timeout for ML service calls (ms) */
  ML_SERVICE_TIMEOUT_MS: process.env.ML_SERVICE_TIMEOUT_MS || '3000',

  // ---------------------------------------------------------------------------
  // Groq AI
  // ---------------------------------------------------------------------------

  /** Groq API key — obtain from console.groq.com */
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',

  /** Groq model to use — e.g. 'llama-3.1-8b-instant', 'mixtral-8x7b-32768' */
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',

  /** Timeout for Groq API calls (ms) */
  GROQ_TIMEOUT_MS: process.env.GROQ_TIMEOUT_MS || '7000',
};

const isProd = env.NODE_ENV === 'production';

if (isProd && env.JWT_SECRET === 'dev-only-insecure-secret-change-me') {
  // eslint-disable-next-line no-console
  console.warn(
    '[shieldiq] WARNING: JWT_SECRET is using the insecure development default in production. ' +
      'Set a real JWT_SECRET in your environment before deploying.'
  );
}

module.exports = env;
