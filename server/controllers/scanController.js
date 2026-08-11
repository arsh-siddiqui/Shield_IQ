'use strict';

const asyncHandler = require('express-async-handler');
const ScanHistory = require('../models/ScanHistory');
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
    result = await analyzeContent(content, scanType);
  } catch (error) {
    // Return a clean 500 without stack trace if engine fails
    res.status(500);
    throw new Error('An error occurred during analysis.');
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
      if (result.intelligence.phishtank?.status === 'found') {
        parts.push(`PhishTank: found${result.intelligence.phishtank.verified ? ' (verified)' : ''}`);
      }
      if (result.intelligence.urlhaus?.status === 'found') {
        parts.push(`URLhaus: found (${result.intelligence.urlhaus.threat || 'malware'})`);
      }
      if (parts.length > 0) threatIntelSummary = parts.join('; ');
    }

    const { updateStreak } = require("../utils/streakHelper");
    updateStreak(req.user);
    await req.user.save();

    saved = await ScanHistory.create({
      user: req.user._id,
      scanType: result.scanType,
      target,
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      confidence: result.confidence,
      category: result.category,
      summary: result.summary,
      reasons: result.reasons,
      recommendations: result.recommendations,
      detectedSignals: result.detectedSignals,
      // Extended fields (new)
      analysisSources: result.analysisSources || ['heuristics'],
      mlLabel: result.ml?.status === 'available' ? result.ml.label : undefined,
      mlProbability: result.ml?.status === 'available' ? result.ml.probability : undefined,
      threatIntelSummary: threatIntelSummary || undefined,
      modelVersion: result.ml?.status === 'available' ? result.ml.modelVersion : undefined,
    });
  }

  return sendSuccess(res, {
    message: 'Scan complete.',
    data: { result, savedToHistory: Boolean(saved), scanId: saved?._id },
  });
});

module.exports = { scanContent };
