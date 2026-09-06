'use strict';

const crypto = require('crypto');

/**
 * Normalizes email text deterministically for embedding generation.
 * Strips HTML, normalizes whitespace, and lowercases everything to ensure
 * consistency between training, history storage, and scan queries.
 *
 * @param {string} text - Raw email text/body
 * @returns {string} Normalized text
 */
function normalizeEmailText(text) {
  if (!text || typeof text !== 'string') return '';
  
  // 1. Lowercase
  let normalized = text.toLowerCase();
  
  // 2. Strip HTML tags (simple regex, handles most cases)
  normalized = normalized.replace(/<[^>]+>/g, ' ');
  
  // 3. Remove consecutive punctuation repeats like "!!!" or "..." (matches ML preprocessing)
  normalized = normalized.replace(/([!?.,-])\1+/g, '$1');
  
  // 4. Normalize whitespace (tabs, newlines, multiple spaces -> single space)
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * Generates a consistent hash fingerprint for an email body.
 * Used to detect exact duplicates in the database to prevent redundant embedding.
 *
 * @param {string} normalizedText - The cleaned text
 * @returns {string} SHA-256 fingerprint
 */
function generateFingerprint(normalizedText) {
  if (!normalizedText) return '';
  return crypto.createHash('sha256').update(normalizedText).digest('hex');
}

module.exports = {
  normalizeEmailText,
  generateFingerprint
};
