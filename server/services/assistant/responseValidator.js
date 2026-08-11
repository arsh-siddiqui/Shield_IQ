'use strict';

/**
 * responseValidator.js — Validates and sanitizes assistant responses from Groq.
 */

function validateAndSanitizeResponse(rawContent, modelName) {
  if (!rawContent || typeof rawContent !== 'string') {
    return {
      isValid: false,
      reason: 'Empty or non-string response received from model.'
    };
  }

  const trimmed = rawContent.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      reason: 'Blank response content.'
    };
  }

  // Safety check: ensure raw API keys or internal prompt leaks aren't present
  if (trimmed.includes('gsk_') || trimmed.includes('GROQ_API_KEY')) {
    return {
      isValid: false,
      reason: 'Response contained prohibited system strings.'
    };
  }

  return {
    isValid: true,
    data: {
      message: trimmed,
      model: modelName || 'groq-model',
      timestamp: new Date().toISOString()
    }
  };
}

module.exports = { validateAndSanitizeResponse };
