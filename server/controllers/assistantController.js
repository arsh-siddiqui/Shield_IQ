'use strict';

const asyncHandler = require('express-async-handler');
const { askAssistant } = require('../services/assistant/assistantService');

/**
 * @desc    Chat with ShieldIQ AI Assistant
 * @route   POST /api/assistant/chat
 * @access  Private (Authenticated users)
 */
const handleAssistantChat = asyncHandler(async (req, res) => {
  const { message, conversationHistory, scanContext } = req.body;

  // Input Validation
  if (!message || typeof message !== 'string') {
    res.status(400);
    throw new Error('Message is required and must be a string.');
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length === 0) {
    res.status(400);
    throw new Error('Message cannot be empty or whitespace only.');
  }

  if (trimmedMessage.length > 2000) {
    res.status(400);
    throw new Error('Message is too long. Maximum allowed length is 2000 characters.');
  }

  // Call Assistant Service
  const result = await askAssistant({
    message: trimmedMessage,
    conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : [],
    scanContext: scanContext && typeof scanContext === 'object' ? scanContext : null,
  });

  if (!result.ok) {
    return res.status(503).json({
      success: false,
      message: result.message,
      fallback: true
    });
  }

  return res.json({
    success: true,
    data: result.data
  });
});

module.exports = { handleAssistantChat };
