'use strict';

/**
 * scanService.js — Re-exports from scanner/index.js
 *
 * analyzeContent     — async, full multi-layer pipeline (ML + TI + Groq)
 * analyzeContentSync — synchronous heuristic-only (for tests + local fallback)
 * VALID_TYPES        — supported scan type strings
 */
const { analyzeContent, analyzeContentSync, VALID_TYPES } = require('./scanner/index');

module.exports = { analyzeContent, analyzeContentSync, VALID_TYPES };
