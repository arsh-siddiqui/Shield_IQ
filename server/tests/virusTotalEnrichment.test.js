'use strict';

/**
 * virusTotalEnrichment.test.js
 * Tests: VirusTotal service normalizeStats + response handling (mocked).
 */

const assert = require('assert');
const { normalizeStats } = require('../services/threatIntel/virusTotalService');



console.log('\n=== VIRUSTOTAL ENRICHMENT TESTS ===\n');

// --- normalizeStats ---
console.log('--- Normalization ---');
it('VT1 — Clean result: zero malicious votes', () => {
  const r = normalizeStats('ip', { malicious: 0, suspicious: 0, harmless: 50, undetected: 5 });
  assert.strictEqual(r.threat, 'clean');
  assert.strictEqual(r.severity, 'none');
  assert.strictEqual(r.maliciousVotes, 0);
  assert.strictEqual(r.confidence, 0);
  assert.ok(r.summary.includes('no threats'));
});

it('VT2 — 1 malicious vote → medium severity', () => {
  const r = normalizeStats('domain', { malicious: 1, suspicious: 0, harmless: 49, undetected: 5 });
  assert.strictEqual(r.threat, 'malicious');
  assert.strictEqual(r.severity, 'medium');
  assert.strictEqual(r.maliciousVotes, 1);
});

it('VT3 — 3 malicious votes → high severity', () => {
  const r = normalizeStats('url', { malicious: 3, suspicious: 0, harmless: 47, undetected: 5 });
  assert.strictEqual(r.threat, 'malicious');
  assert.strictEqual(r.severity, 'high');
  assert.strictEqual(r.maliciousVotes, 3);
});

it('VT4 — 5+ malicious votes → critical severity', () => {
  const r = normalizeStats('hash', { malicious: 7, suspicious: 2, harmless: 40, undetected: 5 });
  assert.strictEqual(r.threat, 'malicious');
  assert.strictEqual(r.severity, 'critical');
});

it('VT5 — Only suspicious votes → suspicious threat', () => {
  const r = normalizeStats('ip', { malicious: 0, suspicious: 3, harmless: 47, undetected: 5 });
  assert.strictEqual(r.threat, 'suspicious');
  assert.strictEqual(r.severity, 'high');
});

it('VT6 — 1 suspicious vote → medium severity suspicious', () => {
  const r = normalizeStats('domain', { malicious: 0, suspicious: 1, harmless: 49, undetected: 5 });
  assert.strictEqual(r.threat, 'suspicious');
  assert.strictEqual(r.severity, 'medium');
});

it('VT7 — confidence = malicious / total × 100', () => {
  const r = normalizeStats('ip', { malicious: 5, suspicious: 0, harmless: 45, undetected: 0, timeout: 0 });
  // total = 5 + 45 = 50, confidence = 5/50*100 = 10
  assert.strictEqual(r.confidence, 10);
  assert.strictEqual(r.totalEngines, 50);
});

it('VT8 — Zero total engines → confidence 0 (no division by zero)', () => {
  const r = normalizeStats('hash', {});
  assert.strictEqual(r.confidence, 0);
  assert.strictEqual(r.totalEngines, 0);
});

// --- Status field normalization ---
console.log('\n--- Status field ---');
it('VT9 — Result always has required fields', () => {
  const r = normalizeStats('ip', { malicious: 0, suspicious: 0 });
  assert.ok(typeof r.provider === 'string');
  assert.ok(typeof r.indicatorType === 'string');
  assert.ok(typeof r.status === 'string');
  assert.ok(typeof r.threat === 'string');
  assert.ok(typeof r.severity === 'string');
  assert.ok(typeof r.confidence === 'number');
  assert.ok(typeof r.summary === 'string');
  assert.ok(typeof r.checkedAt === 'string');
});

it('VT10 — Confidence is always 0–100', () => {
  const cases = [
    { malicious: 0, harmless: 100 },
    { malicious: 100, harmless: 0 },
    { malicious: 50, harmless: 50 },
    {},
  ];
  for (const stats of cases) {
    const r = normalizeStats('ip', stats);
    assert.ok(r.confidence >= 0 && r.confidence <= 100, `confidence out of range: ${r.confidence}`);
  }
});

// --- VirusTotal key not configured ---
console.log('\n--- API key not configured ---');
it('VT11 — skipped response when API key missing', async () => {
  // Temporarily clear env key
  const originalKey = process.env.VIRUSTOTAL_API_KEY;
  process.env.VIRUSTOTAL_API_KEY = '';
  const env = require('../config/env');
  env.VIRUSTOTAL_API_KEY = '';
  const { checkVirusTotalHash } = require('../services/threatIntel/virusTotalService');
  const result = await checkVirusTotalHash('d41d8cd98f00b204e9800998ecf8427e');
  assert.strictEqual(result.status, 'skipped');
  assert.strictEqual(result.threat, 'unknown');
  // Restore
  process.env.VIRUSTOTAL_API_KEY = originalKey;
  env.VIRUSTOTAL_API_KEY = originalKey;
});

// --- VIRUSTOTAL_API_KEY not in frontend ---
console.log('\n--- Security: API key not in frontend ---');
it('VT12 — VIRUSTOTAL_API_KEY not referenced in frontend code', () => {
  const fs = require('fs');
  const path = require('path');
  const srcDir = path.resolve(__dirname, '../../src');

  function searchDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) searchDir(full);
      else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx') || entry.name.endsWith('.ts')) {
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes('VIRUSTOTAL_API_KEY')) {
          throw new Error(`VIRUSTOTAL_API_KEY found in frontend file: ${full}`);
        }
      }
    }
  }
  searchDir(srcDir);
});



