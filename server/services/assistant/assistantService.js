'use strict';

/**
 * assistantService.js — Backend service communicating with Groq API for ShieldIQ Assistant.
 */

const axios = require('axios');
const env = require('../../config/env');
const { buildMessagesPayload } = require('./promptBuilder');
const { validateAndSanitizeResponse } = require('./responseValidator');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_TIMEOUT = 8000;
const FALLBACK_MESSAGE = 'ShieldIQ Assistant is temporarily unavailable. Please try again later.';

async function askAssistant({ message, conversationHistory = [], scanContext = null }) {
  const apiKey = env.GROQ_API_KEY;
  const model = env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const timeout = parseInt(env.GROQ_TIMEOUT_MS, 10) || DEFAULT_TIMEOUT;

  if (!apiKey) {
    return {
      ok: false,
      message: FALLBACK_MESSAGE,
      fallback: true,
      reason: 'GROQ_API_KEY not configured'
    };
  }

  const messagesPayload = buildMessagesPayload(message, conversationHistory, scanContext);

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model,
        messages: messagesPayload,
        temperature: 0.3,
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout,
      }
    );

    const rawContent = response.data?.choices?.[0]?.message?.content;
    const validated = validateAndSanitizeResponse(rawContent, model);

    if (!validated.isValid) {
      return {
        ok: false,
        message: FALLBACK_MESSAGE,
        fallback: true,
        reason: validated.reason
      };
    }

    return {
      ok: true,
      data: validated.data
    };
  } catch (err) {
    // Timeout, network error, rate limit (429), or 500 error from Groq
    return {
      ok: false,
      message: FALLBACK_MESSAGE,
      fallback: true,
      reason: err.response?.data?.error?.message || err.message
    };
  }
}

module.exports = { askAssistant };
