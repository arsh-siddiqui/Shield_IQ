'use strict';

/**
 * mlService.js — Node.js client for the Python ML inference service.
 *
 * Calls the FastAPI ML service (POST /predict) for email/sms/whatsapp scans.
 * NOT used for URL-only scans — the email-trained model is not a URL classifier.
 *
 * CRITICAL FALLBACK BEHAVIOUR:
 * If the ML service is offline, timed out, or returns an error, this function
 * returns { status: 'unavailable' } and does NOT throw. The scanner continues
 * using heuristics. The result notes that ML evidence was unavailable.
 *
 * Environment:
 *   ML_SERVICE_URL        — default http://localhost:8001
 *   ML_SERVICE_TIMEOUT_MS — default 3000ms
 */

const axios = require('axios');
const env = require('../config/env');

const DEFAULT_URL     = 'http://localhost:8001';
const DEFAULT_TIMEOUT = 3000;

/**
 * Call the ML inference service to classify text.
 *
 * @param {string} text - The message content to classify
 * @returns {Promise<Object>} ML evidence object
 */
async function classifyText(text) {
  const serviceUrl = env.ML_SERVICE_URL || DEFAULT_URL;
  const timeout    = parseInt(env.ML_SERVICE_TIMEOUT_MS, 10) || DEFAULT_TIMEOUT;

  if (!text || !text.trim()) {
    return { status: 'unavailable', reason: 'empty_input' };
  }

  try {
    const response = await axios.post(
      `${serviceUrl}/predict`,
      { text: text.slice(0, 10000) }, // enforce max input length
      {
        timeout,
        headers: { 'Content-Type': 'application/json' },
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status === 200 && response.data?.label) {
      const data = response.data;
      return {
        status: 'available',
        label: data.label,                    // 'phishing' | 'safe'
        probability: data.probability,        // 0.0–1.0
        modelName: data.model?.name || 'ShieldIQ Phishing Text Classifier',
        modelVersion: data.model?.version || 'unknown',
      };
    }

    if (response.status === 503) {
      return { status: 'unavailable', reason: 'model_not_loaded' };
    }

    return { status: 'unavailable', reason: `http_${response.status}` };
  } catch (err) {
    const reason = err.code === 'ECONNABORTED'
      ? 'timeout'
      : err.code === 'ECONNREFUSED'
      ? 'service_offline'
      : 'network_error';

    return { status: 'unavailable', reason };
  }
}

module.exports = { classifyText };
