const mongoose = require('mongoose');

/**
 * ThreatIntelCache — Caches threat intelligence lookups to avoid hammering
 * external APIs with repeated queries for the same URL.
 *
 * Cache key: SHA-256 hash of the normalised URL (lowercase, stripped of
 * trailing slash). Raw URLs are never stored as primary keys.
 *
 * TTL strategy:
 *   - PhishTank results: configurable via THREAT_INTEL_CACHE_TTL (hours)
 *   - URLhaus results:   same TTL
 *   - MongoDB TTL index on `expiresAt` handles automatic document removal.
 */
const threatIntelCacheSchema = new mongoose.Schema(
  {
    // SHA-256 hex digest of the normalised URL — used as the lookup key.
    urlHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
      maxlength: 64,
    },

    // The normalised URL (stored for debugging; not exposed in API responses)
    normalizedUrl: {
      type: String,
      required: true,
      maxlength: 2048,
      select: false, // exclude from default queries for privacy
    },

    // Results from each provider, stored as a structured object
    providers: {
      phishtank: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
      urlhaus: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },

    checkedAt: {
      type: Date,
      default: Date.now,
    },

    // MongoDB TTL index on this field automatically removes expired documents.
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: delete when expiresAt is reached
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('ThreatIntelCache', threatIntelCacheSchema);
