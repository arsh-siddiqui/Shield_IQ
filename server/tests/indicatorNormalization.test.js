'use strict';

/**
 * indicatorNormalization.test.js
 * Tests: IP normalization, domain normalization, URL normalization,
 *        hash normalization, email normalization, public/private filtering,
 *        deduplication via buildIndicators.
 */

const assert = require('assert');
const {
  normalizeIPv4, normalizeIPv6, normalizeDomain, normalizeURL,
  normalizeHash, normalizeEmail, normalizeIndicator, buildIndicators,
} = require('../services/intelligence/indicatorNormalizer');



console.log('\n=== INDICATOR NORMALIZATION TESTS ===\n');

// --- IPv4 ---
console.log('--- IPv4 ---');
it('N1 — Valid IPv4 canonical', () => {
  assert.strictEqual(normalizeIPv4('8.8.8.8'), '8.8.8.8');
  assert.strictEqual(normalizeIPv4(' 192.168.1.1 '), '192.168.1.1');
});
it('N2 — Invalid IPv4 returns null', () => {
  assert.strictEqual(normalizeIPv4('256.0.0.1'), null);
  assert.strictEqual(normalizeIPv4('abc.def.ghi.jkl'), null);
  assert.strictEqual(normalizeIPv4('1.2.3'), null);
  assert.strictEqual(normalizeIPv4(''), null);
});

// --- IPv6 ---
console.log('--- IPv6 ---');
it('N3 — IPv6 lowercased', () => {
  assert.strictEqual(normalizeIPv6('2001:DB8::1'), '2001:db8::1');
});

// --- Domain ---
console.log('--- Domain ---');
it('N4 — Domain lowercased', () => {
  assert.strictEqual(normalizeDomain('Example.COM'), 'example.com');
});
it('N5 — Trailing dot removed', () => {
  assert.strictEqual(normalizeDomain('example.com.'), 'example.com');
});
it('N6 — Empty domain returns null', () => {
  assert.strictEqual(normalizeDomain(''), null);
  assert.strictEqual(normalizeDomain(null), null);
});
it('N7 — Very long domain returns null', () => {
  assert.strictEqual(normalizeDomain('a'.repeat(254)), null);
});

// --- URL ---
console.log('--- URL ---');
it('N8 — Valid URL normalized', () => {
  const r = normalizeURL('HTTPS://Example.com/path?q=1');
  assert.ok(r.startsWith('https://example.com/'), `Got: ${r}`);
});
it('N9 — Invalid URL returns null', () => {
  assert.strictEqual(normalizeURL('not-a-url'), null);
  assert.strictEqual(normalizeURL(''), null);
  assert.strictEqual(normalizeURL(null), null);
});

// --- Hash ---
console.log('--- Hash ---');
it('N10 — SHA-256 hash normalized (lowercase)', () => {
  const sha256 = '94ee4c496e402b5991637f40fe6e752d549afd4d9ab487bc1c210a0a00688b4d';
  assert.strictEqual(normalizeHash(sha256.toUpperCase()), sha256);
});
it('N11 — Invalid hash (non-hex) returns null', () => {
  assert.strictEqual(normalizeHash('xyz123'), null);
});
it('N12 — Unknown length hash returns null', () => {
  assert.strictEqual(normalizeHash('abcdef1234'), null); // 10 chars — not MD5/SHA1/SHA256
});
it('N13 — MD5 hash (32 chars) valid', () => {
  const md5 = 'd41d8cd98f00b204e9800998ecf8427e';
  assert.strictEqual(normalizeHash(md5), md5);
});

// --- Email ---
console.log('--- Email address ---');
it('N14 — Email normalized to lowercase', () => {
  assert.strictEqual(normalizeEmail('User@Example.COM'), 'user@example.com');
});

// --- normalizeIndicator ---
console.log('--- normalizeIndicator dispatch ---');
it('N15 — Public IP recognized', () => {
  const r = normalizeIndicator('ip', '8.8.8.8');
  assert.strictEqual(r.normalized, '8.8.8.8');
  assert.strictEqual(r.isPublic, true);
});
it('N16 — Private IP recognized', () => {
  const r = normalizeIndicator('ip', '192.168.1.1');
  assert.strictEqual(r.isPublic, false);
});
it('N17 — Loopback recognized as private', () => {
  const r = normalizeIndicator('ip', '127.0.0.1');
  assert.strictEqual(r.isPublic, false);
});

// --- buildIndicators and deduplication ---
console.log('--- buildIndicators deduplication ---');
it('N18 — Duplicate IPs produce one indicator', () => {
  const extracted = {
    ipAddresses: [
      { ip: '8.8.8.8', type: 'public' },
      { ip: '8.8.8.8', type: 'public' }, // duplicate
    ],
    urls: [], domains: [], emailAddresses: [],
  };
  const result = buildIndicators(extracted, []);
  const ips = result.filter(i => i.type === 'ip');
  assert.strictEqual(ips.length, 1);
});
it('N19 — Private IPs are still included in indicator list (filtering happens in enrichment)', () => {
  const extracted = {
    ipAddresses: [{ ip: '192.168.1.1', type: 'private' }],
    urls: [], domains: [], emailAddresses: [],
  };
  const result = buildIndicators(extracted, []);
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].isPublicIP, false);
});
it('N20 — Attachment hashes are included', () => {
  const extracted = { ipAddresses: [], urls: [], domains: [], emailAddresses: [] };
  const attachments = [{ filename: 'test.pdf', sha256: 'd41d8cd98f00b204e9800998ecf8427e' }];
  const result = buildIndicators(extracted, attachments);
  const hashes = result.filter(i => i.type === 'hash');
  assert.strictEqual(hashes.length, 1);
  assert.strictEqual(hashes[0].normalizedValue, 'd41d8cd98f00b204e9800998ecf8427e');
});
it('N21 — Invalid IP is excluded', () => {
  const extracted = {
    ipAddresses: [{ ip: '999.999.999.999', type: 'public' }],
    urls: [], domains: [], emailAddresses: [],
  };
  const result = buildIndicators(extracted, []);
  const ips = result.filter(i => i.type === 'ip');
  assert.strictEqual(ips.length, 0, 'Invalid IP should be excluded');
});



