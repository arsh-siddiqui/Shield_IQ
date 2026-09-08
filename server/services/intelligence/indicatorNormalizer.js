'use strict';

/**
 * indicatorNormalizer.js — Normalizes raw extracted indicators into canonical forms.
 *
 * Rules:
 *   IP:     canonical string representation, validate format
 *   Domain: lowercase, remove trailing dot, no www stripping (preserves semantics)
 *   URL:    lowercase scheme+host, preserve path
 *   Hash:   lowercase hex, validate length for known hash types
 *   Email:  lowercase
 *
 * Deduplication: callers should use normalizedValue as the unique key.
 */

const { isPrivateIPv4, isPrivateIPv6 } = require('../forensics/iocExtractor');

/**
 * Normalize an IPv4 address.
 * Returns null if invalid format.
 */
function normalizeIPv4(ip) {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  const nums = parts.map(Number);
  if (nums.some(n => isNaN(n) || n < 0 || n > 255)) return null;
  return nums.join('.');
}

/**
 * Normalize an IPv6 address (minimal lowercasing — full expansion is complex).
 */
function normalizeIPv6(ip) {
  return ip.trim().toLowerCase();
}

/**
 * Normalize a domain name.
 */
function normalizeDomain(domain) {
  if (!domain || typeof domain !== 'string') return null;
  let d = domain.trim().toLowerCase();
  // Remove trailing dot (DNS FQDN)
  if (d.endsWith('.')) d = d.slice(0, -1);
  if (d.length === 0 || d.length > 253) return null;
  return d;
}

/**
 * Normalize a URL.
 * Returns null for invalid URLs.
 */
function normalizeURL(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  try {
    const u = new URL(rawUrl.trim());
    // lowercase scheme and host
    u.hostname = u.hostname.toLowerCase();
    return u.href;
  } catch {
    return null;
  }
}

/**
 * Normalize a hex hash (SHA-256, MD5, SHA-1).
 * Returns null if not a valid hex string of known hash length.
 */
function normalizeHash(hash) {
  if (!hash || typeof hash !== 'string') return null;
  const h = hash.trim().toLowerCase();
  const VALID_LENGTHS = new Set([32, 40, 64]); // MD5, SHA-1, SHA-256
  if (!/^[0-9a-f]+$/.test(h)) return null;
  if (!VALID_LENGTHS.has(h.length)) return null;
  return h;
}

/**
 * Normalize an email address.
 */
function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return null;
  return email.trim().toLowerCase();
}

/**
 * Normalize any indicator by type.
 * @param {string} type - 'ip'|'domain'|'url'|'hash'|'email'
 * @param {string} value - raw value
 * @returns {{ normalized: string|null, isPublic: boolean|null }}
 */
function normalizeIndicator(type, value) {
  switch (type) {
    case 'ip': {
      // Try IPv4 first
      const v4 = normalizeIPv4(value);
      if (v4) {
        const pub = !isPrivateIPv4(v4);
        return { normalized: v4, isPublic: pub };
      }
      // Only attempt IPv6 if the value contains a colon (IPv6 separator)
      if (typeof value === 'string' && value.includes(':')) {
        const v6 = normalizeIPv6(value);
        if (v6) {
          const pub = !isPrivateIPv6(v6);
          return { normalized: v6, isPublic: pub };
        }
      }
      return { normalized: null, isPublic: null };
    }
    case 'domain':
      return { normalized: normalizeDomain(value), isPublic: null };
    case 'url':
      return { normalized: normalizeURL(value), isPublic: null };
    case 'hash':
      return { normalized: normalizeHash(value), isPublic: null };
    case 'email':
      return { normalized: normalizeEmail(value), isPublic: null };
    default:
      return { normalized: null, isPublic: null };
  }
}

/**
 * Build a deduplicated list of Indicator records from raw extracted data.
 * @param {Object} extracted - from EmailInvestigation.extracted
 * @param {Array} attachments - from EmailInvestigation.attachments
 * @returns {Array<{ type, value, normalizedValue, isPublicIP, sources }>}
 */
function buildIndicators(extracted, attachments) {
  const seen = new Set();
  const results = [];

  function add(type, value, source) {
    const { normalized, isPublic } = normalizeIndicator(type, value);
    if (!normalized) return;
    const key = `${type}:${normalized}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push({
      type,
      value,
      normalizedValue: normalized,
      isPublicIP: type === 'ip' ? isPublic : null,
      sources: [source],
    });
  }

  for (const { ip, type: ipType } of (extracted?.ipAddresses || [])) {
    add('ip', ip, 'email_header_or_body');
    // We already know if it's public from extraction
    // Override the isPublicIP if needed
    const last = results[results.length - 1];
    if (last && last.type === 'ip' && last.value === ip) {
      last.isPublicIP = (ipType === 'public');
    }
  }
  for (const url of (extracted?.urls || [])) add('url', url, 'email_body');
  for (const domain of (extracted?.domains || [])) add('domain', domain, 'email_body');
  for (const email of (extracted?.emailAddresses || [])) add('email', email, 'email_body');
  for (const att of (attachments || [])) {
    if (att.sha256) add('hash', att.sha256, `attachment:${att.filename || 'unknown'}`);
  }

  return results;
}

module.exports = {
  normalizeIndicator,
  buildIndicators,
  normalizeIPv4,
  normalizeIPv6,
  normalizeDomain,
  normalizeURL,
  normalizeHash,
  normalizeEmail,
};
