'use strict';

/**
 * scanner/index.js — Multi-layer scan orchestrator.
 *
 * Layer 1: Heuristic engine (always runs, always provides baseline + fallback)
 * Layer 2: ML inference (email/sms/whatsapp only — not a URL classifier)
 * Layer 3: Threat intelligence (URL-bearing content — PhishTank + URLhaus)
 * Layer 4: Evidence fusion (combines all sources via decision rules)
 * Layer 5: Groq contextual analysis (refines explanation, not primary detector)
 *
 * FALLBACK CHAIN:
 *   If ML fails → continue with heuristics
 *   If TI fails → continue with heuristics + ML
 *   If Groq fails → continue with heuristics + ML + TI
 *   If only heuristics available → return heuristic result (same as Phase 5A)
 *
 * The existing analyzeContentSync() is preserved for use in tests and
 * the local frontend fallback (scanEngine.js). The new analyzeContent()
 * is async and runs the full pipeline.
 */

const { detectSignals } = require('./signalDetector');
const { calculateRisk } = require('./riskScorer');
const { buildResult } = require('./resultBuilder');
const { fuseEvidence } = require('./evidenceFusion');

const VALID_TYPES = ['url', 'email', 'sms', 'whatsapp', 'qr'];

// Lazy imports for external services — avoids startup failures if env is misconfigured
let mlService, threatIntelService, groqService;

function getMlService() {
  if (!mlService) mlService = require('../mlService');
  return mlService;
}

function getThreatIntelService() {
  if (!threatIntelService) threatIntelService = require('../threatIntel/threatIntelService');
  return threatIntelService;
}

function getGroqService() {
  if (!groqService) groqService = require('../groqService');
  return groqService;
}

/**
 * Run the synchronous heuristic engine only.
 * Preserved for: tests, local frontend fallback, scanEngine.js compatibility.
 *
 * @param {string} content
 * @param {string} scanType
 * @returns {Object} Deterministic heuristic result
 */
function analyzeContentSync(content, scanType = 'url') {
  const type = VALID_TYPES.includes(scanType) ? scanType : 'url';
  const signals = detectSignals(content, type);
  const { riskScore, confidence, riskLevel } = calculateRisk(signals);
  const result = buildResult(signals, riskLevel);

  return {
    riskScore,
    confidence,
    riskLevel,
    scanType: type,
    scannedAt: new Date().toISOString(),
    category: result.category,
    summary: result.summary,
    reasons: result.reasons,
    recommendations: result.recommendations,
    detectedSignals: signals.map(s => s.type),
  };
}

/**
 * Run the full multi-layer scan pipeline (async).
 *
 * Heuristic engine always runs first and provides the fallback baseline.
 * ML + Threat Intel + Groq run concurrently where possible.
 *
 * @param {string} content
 * @param {string} scanType
 * @returns {Promise<Object>} Final fused result
 */
async function analyzeContent(content, scanType = 'url') {
  const type = VALID_TYPES.includes(scanType) ? scanType : 'url';

  // -------------------------------------------------------------------------
  // Layer 1: Heuristic engine — synchronous, always completes
  // -------------------------------------------------------------------------
  const heuristicResult = analyzeContentSync(content, type);

  // -------------------------------------------------------------------------
  // Layers 2 & 3: ML + Threat Intelligence — run concurrently
  // -------------------------------------------------------------------------
  const TEXT_TYPES = new Set(['email', 'sms', 'whatsapp']);
  const URL_TYPES  = new Set(['url', 'qr']);

  // For email/sms/whatsapp → run ML
  // For url/qr and messages containing URLs → run Threat Intel
  // Both can run simultaneously
  const mlTask = TEXT_TYPES.has(type)
    ? getMlService().classifyText(content).catch(() => ({ status: 'unavailable', reason: 'exception' }))
    : Promise.resolve({ status: 'unavailable', reason: 'not_applicable_for_url' });

  // Run threat intel for: URL/QR scans, and messages that contain URLs
  const shouldRunThreatIntel = URL_TYPES.has(type) || /https?:\/\//i.test(content);
  const tiTask = shouldRunThreatIntel
    ? getThreatIntelService().getThreatIntelligence(content, type).catch(() => null)
    : Promise.resolve(null);

  const [mlEvidence, threatIntel] = await Promise.all([mlTask, tiTask]);

  // -------------------------------------------------------------------------
  // Layer 4: Evidence Fusion
  // -------------------------------------------------------------------------
  const fusedResult = fuseEvidence(heuristicResult, mlEvidence, threatIntel, null);

  // -------------------------------------------------------------------------
  // Layer 5: Groq contextual analysis (sequential — needs fused result)
  // -------------------------------------------------------------------------
  let groqResult = null;
  try {
    groqResult = await getGroqService().analyzeWithGroq(
      content,
      heuristicResult,
      mlEvidence,
      threatIntel
    );
  } catch {
    // Groq failure is non-fatal
    groqResult = null;
  }

  // Re-fuse with Groq result if Groq succeeded
  if (groqResult) {
    return fuseEvidence(heuristicResult, mlEvidence, threatIntel, groqResult);
  }

  return fusedResult;
}

// Keep the old export name for backward compatibility with tests
// (tests import analyzeContent from scanService.js which re-exports from here)
module.exports = { analyzeContent, analyzeContentSync, VALID_TYPES };
