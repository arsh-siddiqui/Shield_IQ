/**
 * Phase 5A QA — Full Scanner Test Suite
 *
 * Tests two layers:
 *   1. ENGINE tests  — call analyzeContentSync() directly, verifying correct heuristic output.
 *   2. VALIDATION tests — simulate the controller's validation guard logic for empty/missing/
 *      invalid inputs that should be rejected before the engine is ever called.
 *
 * NOTE: Phase 5B/5C adds the async analyzeContent() pipeline (ML + TI + Groq).
 * These tests specifically test the deterministic heuristic engine via analyzeContentSync().
 *
 * Run with:  node server/tests/scanner.test.js
 */

'use strict';

const assert = require('assert');
const { analyzeContentSync: analyzeContent, VALID_TYPES } = require('../services/scanService');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ✗ ${name}`);
    console.error(`    → ${e.message}`);
    failed++;
  }
}

/**
 * Simulates the controller's validation gate that runs BEFORE analyzeContent().
 * Returns { status, error } for invalid input, or null if input passes validation.
 */
function simulateValidation(body) {
  const { scanType, content } = body || {};

  if (!scanType || typeof scanType !== 'string' || !VALID_TYPES.includes(scanType)) {
    return { status: 400, error: 'Unsupported scan type.' };
  }
  if (content === undefined || content === null || typeof content !== 'string' || content.trim().length === 0) {
    return { status: 400, error: 'Scan input is required.' };
  }
  if (content.length > 5000) {
    return { status: 413, error: 'Input exceeds the maximum allowed length (5000 characters).' };
  }
  return null; // passes validation
}

// ---------------------------------------------------------------------------
// Section A — Validation Gate (controller-level)
// ---------------------------------------------------------------------------

console.log('\n=== SECTION A: Validation Gate ===');

test('A1 — Empty string → HTTP 400 (Scan input is required)', () => {
  const v = simulateValidation({ scanType: 'url', content: '' });
  assert.ok(v !== null, 'Expected a validation error');
  assert.strictEqual(v.status, 400);
  assert.ok(v.error.toLowerCase().includes('required'), `Unexpected message: ${v.error}`);
});

test('A2 — Whitespace-only string → HTTP 400', () => {
  const v = simulateValidation({ scanType: 'sms', content: '   \t\n  ' });
  assert.ok(v !== null, 'Expected a validation error');
  assert.strictEqual(v.status, 400);
});

test('A3 — Missing content field → HTTP 400', () => {
  const v = simulateValidation({ scanType: 'email' });
  assert.ok(v !== null, 'Expected a validation error');
  assert.strictEqual(v.status, 400);
});

test('A4 — null content → HTTP 400', () => {
  const v = simulateValidation({ scanType: 'whatsapp', content: null });
  assert.ok(v !== null, 'Expected a validation error');
  assert.strictEqual(v.status, 400);
});

test('A5 — Unsupported scan type "phone" → HTTP 400', () => {
  const v = simulateValidation({ scanType: 'phone', content: 'some text' });
  assert.ok(v !== null, 'Expected a validation error');
  assert.strictEqual(v.status, 400);
  assert.ok(v.error.toLowerCase().includes('scan type'), `Unexpected message: ${v.error}`);
});

test('A6 — Unsupported scan type "text" → HTTP 400', () => {
  const v = simulateValidation({ scanType: 'text', content: 'some text' });
  assert.ok(v !== null);
  assert.strictEqual(v.status, 400);
});

test('A7 — Unsupported scan type "image" → HTTP 400', () => {
  const v = simulateValidation({ scanType: 'image', content: 'some text' });
  assert.ok(v !== null);
  assert.strictEqual(v.status, 400);
});

test('A8 — Missing scanType field → HTTP 400', () => {
  const v = simulateValidation({ content: 'some text' });
  assert.ok(v !== null);
  assert.strictEqual(v.status, 400);
});

test('A9 — Oversized input (>5000 chars) → HTTP 413', () => {
  const v = simulateValidation({ scanType: 'email', content: 'A'.repeat(5001) });
  assert.ok(v !== null);
  assert.strictEqual(v.status, 413);
});

test('A10 — Valid input passes (no error returned)', () => {
  const v = simulateValidation({ scanType: 'url', content: 'https://example.com' });
  assert.strictEqual(v, null, 'Valid input should pass with null (no error)');
});

test('A11 — All supported types pass validation', () => {
  for (const type of VALID_TYPES) {
    const v = simulateValidation({ scanType: type, content: 'test content' });
    assert.strictEqual(v, null, `Type "${type}" should pass validation`);
  }
});

// ---------------------------------------------------------------------------
// Section B — Engine Tests: Risk Scoring & Detection
// ---------------------------------------------------------------------------

console.log('\n=== SECTION B: Heuristic Engine ===');

test('B1 — Normal benign message → Safe or Low (NOT Medium or High)', () => {
  const r = analyzeContent('Hey, are we still meeting at 5 PM?', 'sms');
  assert.ok(
    r.riskLevel === 'Safe' || r.riskLevel === 'Low',
    `Expected Safe or Low, got ${r.riskLevel} (score: ${r.riskScore})`
  );
});

test('B2 — Fake bank phishing SMS → High, detects urgency + threat + credential signals', () => {
  const r = analyzeContent(
    'URGENT! Your bank account will be blocked today. Verify your KYC immediately: https://some-fake-link.com/verify',
    'sms'
  );
  assert.strictEqual(r.riskLevel, 'High', `Expected High, got ${r.riskLevel} (score: ${r.riskScore})`);
  assert.ok(r.detectedSignals.includes('urgency'), 'Missing urgency signal');
  assert.ok(r.detectedSignals.includes('threat'), 'Missing threat signal');
  assert.ok(
    r.detectedSignals.includes('credential_request') || r.detectedSignals.includes('credential_path'),
    'Missing credential signal'
  );
});

test('B3 — OTP scam message → High, detects otp_request', () => {
  const r = analyzeContent(
    'Your transaction failed. Tell me the OTP you just received to cancel it.',
    'whatsapp'
  );
  assert.strictEqual(r.riskLevel, 'High', `Expected High, got ${r.riskLevel} (score: ${r.riskScore})`);
  assert.ok(r.detectedSignals.includes('otp_request'), 'Missing otp_request signal');
});

test('B4 — Fake job scam → High or Medium, detects job_scam + payment_request', () => {
  const r = analyzeContent(
    'Congratulations! You are selected for a work-from-home job. Pay ₹999 registration fee to confirm your position.',
    'whatsapp'
  );
  assert.ok(
    r.riskLevel === 'High' || r.riskLevel === 'Medium',
    `Expected High or Medium, got ${r.riskLevel} (score: ${r.riskScore})`
  );
  assert.ok(r.detectedSignals.includes('job_scam'), 'Missing job_scam signal');
  assert.ok(r.detectedSignals.includes('payment_request'), 'Missing payment_request signal');
});

test('B5 — Investment scam → High, detects investment_scam', () => {
  const r = analyzeContent(
    'Guaranteed 30% return every week. Double your money with zero risk.',
    'sms'
  );
  assert.strictEqual(r.riskLevel, 'High', `Expected High, got ${r.riskLevel} (score: ${r.riskScore})`);
  assert.ok(r.detectedSignals.includes('investment_scam'), 'Missing investment_scam signal');
});

test('B6 — Suspicious URL with typosquatting + credential path → High', () => {
  const r = analyzeContent('https://amaz0n-login.example/verify-account', 'url');
  assert.strictEqual(r.riskLevel, 'High', `Expected High, got ${r.riskLevel} (score: ${r.riskScore})`);
  assert.ok(
    r.detectedSignals.includes('brand_impersonation') || r.detectedSignals.includes('typosquatting'),
    'Missing brand/typosquatting signal'
  );
});

test('B7 — Legitimate URL (well-known domain, no suspicious paths) → Safe or Low', () => {
  const r = analyzeContent('https://www.example.com', 'url');
  assert.ok(
    r.riskLevel === 'Safe' || r.riskLevel === 'Low',
    `Expected Safe or Low, got ${r.riskLevel} (score: ${r.riskScore})`
  );
});

test('B8 — URL with a URL shortener → Low (not High on its own)', () => {
  const r = analyzeContent('https://bit.ly/3someCode', 'url');
  // A single medium signal (url_shortener) should be Low or Medium, not High
  assert.ok(
    r.riskLevel !== 'High',
    `URL shortener alone should not reach High, got ${r.riskLevel} (score: ${r.riskScore})`
  );
  assert.ok(r.detectedSignals.includes('url_shortener'), 'Missing url_shortener signal');
});

test('B9 — Message + embedded suspicious URL combined → signals from both sources', () => {
  const r = analyzeContent(
    'Your account will be blocked today. Verify here: https://amaz0n-login.example/verify',
    'email'
  );
  assert.ok(r.riskLevel === 'High', `Expected High due to combined signals, got ${r.riskLevel}`);
  // Should have message signals
  assert.ok(r.detectedSignals.includes('threat') || r.detectedSignals.includes('urgency'), 'Missing message signal');
  // Should have URL signals
  assert.ok(
    r.detectedSignals.includes('brand_impersonation') || r.detectedSignals.includes('typosquatting'),
    'Missing URL signal'
  );
  // Deduplication: same signal type should not appear twice
  const signalSet = new Set(r.detectedSignals);
  assert.strictEqual(signalSet.size, r.detectedSignals.length, 'Duplicate signals detected — deduplication failed');
});

test('B10 — Risk score is always 0–100', () => {
  const inputs = [
    ['https://www.google.com', 'url'],
    ['URGENT! Verify your KYC. Share OTP. Guaranteed returns. Work from home. Arrest warrant.', 'sms'],
    ['Hello world', 'email'],
    ['https://192.168.1.1/login', 'url'],
  ];
  for (const [content, type] of inputs) {
    const r = analyzeContent(content, type);
    assert.ok(r.riskScore >= 0 && r.riskScore <= 100, `Score out of bounds: ${r.riskScore} for "${content}"`);
    assert.ok(r.confidence >= 0 && r.confidence <= 100, `Confidence out of bounds: ${r.confidence}`);
  }
});

test('B11 — IP address hostname → High (standalone)', () => {
  const r = analyzeContent('http://192.168.1.100/login', 'url');
  assert.ok(r.detectedSignals.includes('ip_hostname'), 'Missing ip_hostname signal');
});

test('B12 — Brand impersonation: official subdomain NOT flagged', () => {
  // pay.google.com is a real Google domain — should NOT be flagged as brand impersonation
  const r = analyzeContent('https://pay.google.com/checkout', 'url');
  assert.ok(!r.detectedSignals.includes('brand_impersonation'), 'pay.google.com should NOT be flagged');
});

test('B13 — Brand impersonation: fake brand domain IS flagged', () => {
  const r = analyzeContent('https://google-support-verify.net/security', 'url');
  assert.ok(
    r.detectedSignals.includes('brand_impersonation') || r.detectedSignals.includes('typosquatting'),
    'Fake google domain should be flagged'
  );
});

test('B14 — Risk level always maps to one of four valid bands', () => {
  const VALID_LEVELS = new Set(['Safe', 'Low', 'Medium', 'High']);
  const inputs = [
    ['hi', 'sms'],
    ['guaranteed returns double money', 'sms'],
    ['https://bit.ly/abc', 'url'],
    ['https://amaz0n.fake-bank.ru/verify', 'url'],
  ];
  for (const [content, type] of inputs) {
    const r = analyzeContent(content, type);
    assert.ok(VALID_LEVELS.has(r.riskLevel), `Invalid riskLevel: "${r.riskLevel}" for "${content}"`);
  }
});

test('B15 — Result shape contains all required frontend fields', () => {
  const r = analyzeContent('URGENT! Your account will be blocked. Share OTP.', 'sms');
  assert.ok(typeof r.riskScore === 'number', 'Missing riskScore');
  assert.ok(typeof r.confidence === 'number', 'Missing confidence');
  assert.ok(typeof r.riskLevel === 'string', 'Missing riskLevel');
  assert.ok(typeof r.scanType === 'string', 'Missing scanType');
  assert.ok(typeof r.scannedAt === 'string', 'Missing scannedAt');
  assert.ok(typeof r.category === 'string', 'Missing category');
  assert.ok(typeof r.summary === 'string', 'Missing summary');
  assert.ok(Array.isArray(r.reasons), 'Missing reasons array');
  assert.ok(Array.isArray(r.recommendations), 'Missing recommendations array');
  assert.ok(Array.isArray(r.detectedSignals), 'Missing detectedSignals array');
});

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

const total = passed + failed;
console.log(`\n─────────────────────────────────────────`);
console.log(`Results: ${passed}/${total} passed, ${failed} failed.`);
console.log(`─────────────────────────────────────────\n`);

if (failed > 0) {
  process.exit(1);
}
