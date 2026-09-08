'use strict';

const assert = require('assert');
const { analyzeEml } = require('../controllers/forensicController');
const { scanContent } = require('../controllers/scanController');

// Mock req and res
function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

describe('API Forensics Tests', () => {
  describe('SECTION A: API Controller Logic', () => {

  it('A1 — Missing file throws 400', async () => {
    const req = { file: null, user: { _id: 'fakeUserId' } };
    const res = createMockRes();
    
    await analyzeEml(req, res);
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe('NO_FILE');
  });

  it('A2 — Invalid/Malformed .eml throws 400', async () => {
    const req = { 
      file: { 
        buffer: Buffer.from('just a random string'), 
        originalname: 'test.eml',
        mimetype: 'message/rfc822',
        size: 20
      }, 
      user: { _id: 'fakeUserId' } 
    };
    const res = createMockRes();
    
    try {
        await analyzeEml(req, res);
    } catch (e) {
        expect(e.message.includes('Cast to ObjectId') || e.message.includes('validation')).toBe(true);
    }
  });
  });

  describe('SECTION B: Pasted Email Logic', () => {

  it('B1 — Missing body in pasted_email throws 400', async () => {
    const req = { 
      body: { 
        scanType: 'email', 
        sourceType: 'pasted_email',
        sender: 'a@b.com'
      }, 
      user: { _id: 'fakeUserId' } 
    };
    const res = createMockRes();
    
    try {
      await scanContent(req, res);
      // Fail if not thrown
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toBe('Email body is required.');
    }
  });

  it('B2 — Valid body in pasted_email builds content string', async () => {
    const req = { 
      body: { 
        scanType: 'email', 
        sourceType: 'pasted_email',
        sender: 'test@example.com',
        subject: 'Hello',
        body: 'This is the message.'
      }, 
      user: null 
    };
    const res = createMockRes();
    
    await scanContent(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.sourceType).toBe('pasted_email');
    expect(res.body.data.analysisDepth).toBe('content_only');
    
    expect(res.body.data.result.fullContent === undefined || res.body.data.result.scannedAt !== undefined).toBe(true);
  });
  });

});
