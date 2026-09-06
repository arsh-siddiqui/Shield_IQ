'use strict';

const asyncHandler = require('express-async-handler');
const Scan = require('../models/Scan');
const sendSuccess = require('../utils/apiResponse');
const { analyzeContent, VALID_TYPES } = require('../services/scanService');

// @route  POST /api/scan
// @access Public (saves to history only when authenticated)
const scanContent = asyncHandler(async (req, res) => {
  const { scanType, content } = req.body;

  if (!scanType || typeof scanType !== 'string' || !VALID_TYPES.includes(scanType)) {
    res.status(400);
    throw new Error('Unsupported scan type.');
  }

  if (content === undefined || content === null || typeof content !== 'string' || content.trim().length === 0) {
    res.status(400);
    throw new Error('Scan input is required.');
  }

  if (content.length > 5000) {
    res.status(413);
    throw new Error('Input exceeds the maximum allowed length (5000 characters).');
  }

  let result;
  try {
    // analyzeContent is now async (multi-layer pipeline)
    const userId = req.user ? req.user._id : null;
    result = await analyzeContent(content, scanType, userId);
  } catch (error) {
    // Return a clean 500 without stack trace if engine fails
    console.error("Scan engine error:", error);
    res.status(500);
    throw new Error('An error occurred during analysis. ' + error.message);
  }

  let saved = null;
  if (req.user) {
    const target =
      scanType === 'qr' && !content
        ? 'Uploaded QR code'
        : (content || '').trim().slice(0, 300) || '(empty input)';

    // Build threat intel summary for storage (no raw external responses)
    let threatIntelSummary = null;
    if (result.intelligence) {
      const parts = [];
      if (result.intelligence.phishdestroy?.status === 'found') {
        parts.push(`PhishDestroy: malicious`);
      }
      if (parts.length > 0) threatIntelSummary = parts.join('; ');
    }

    const { updateStreak } = require("../utils/streakHelper");
    updateStreak(req.user);
    await req.user.save();

    const inputHash = require('crypto').createHash('sha256').update(content).digest('hex');

    saved = await Scan.create({
      user: req.user._id,
      inputType: result.scanType,
      inputHash: inputHash,
      classification: result.classification || (result.riskLevel === 'Safe' ? 'legitimate' : result.riskLevel === 'Critical' ? 'phishing' : 'suspicious'),
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      confidence: result.confidence,
      mlResult: result.ml,
      heuristicResult: { category: result.category, detectedSignals: result.detectedSignals },
      threatIntelResult: result.intelligence,
      ragResult: result.rag,
      llmResult: result.groq,
      evidence: result.reasons || [],
      retrievedEmails: result.rag?.retrievedEmails || [],
      recommendations: result.recommendations || []
    });
  }

  return sendSuccess(res, {
    message: 'Scan complete.',
    data: { result, savedToHistory: Boolean(saved), scanId: saved?._id },
  });
});

module.exports = { scanContent };
