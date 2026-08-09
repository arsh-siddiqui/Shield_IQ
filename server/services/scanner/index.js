const { detectSignals } = require('./signalDetector');
const { calculateRisk } = require('./riskScorer');
const { buildResult } = require('./resultBuilder');

const VALID_TYPES = ['url', 'email', 'sms', 'whatsapp', 'qr'];

/**
 * Main entry point for the deterministic scan engine.
 * @param {string} content - The input string (URL, message, etc.)
 * @param {string} scanType - The type of scan ("url", "email", etc.)
 * @returns {Object} - Complete structured scan result object.
 */
function analyzeContent(content, scanType = 'url') {
  const type = VALID_TYPES.includes(scanType) ? scanType : 'url';
  
  // 1. Extract signals
  const signals = detectSignals(content, type);
  
  // 2. Calculate risk & confidence
  const { riskScore, confidence, riskLevel } = calculateRisk(signals);
  
  // 3. Build UI-friendly result structure
  const result = buildResult(signals, riskLevel);

  return {
    riskScore,
    confidence,
    riskLevel, // e.g. "Safe", "Low", "Medium", "High"
    scanType: type,
    scannedAt: new Date().toISOString(),
    category: result.category,
    summary: result.summary,
    reasons: result.reasons,
    recommendations: result.recommendations,
    detectedSignals: signals.map(s => s.type)
  };
}

module.exports = { analyzeContent, VALID_TYPES };
