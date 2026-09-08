'use strict';

/**
 * server/services/forensics/emailParser.js
 * Uses mailparser to safely parse .eml bytes without executing HTML or scripts.
 */

const { simpleParser } = require('mailparser');
const { extractIocs, combineIocs } = require('./iocExtractor');
const { parseReceivedHeaders, parseAuthentication } = require('./headerParser');
const { analyzeAttachments } = require('./attachmentAnalyzer');

/**
 * Parses raw .eml buffer and returns a normalized forensic object.
 * @param {Buffer} buffer - The raw .eml file buffer
 * @returns {Promise<Object>} Normalized forensic data
 */
async function parseEmail(buffer) {
  try {
    const parsed = await simpleParser(buffer, {
      skipHtmlToText: true // We can just use the html if we want, or its built in text
    });

    const headers = parsed.headers || new Map();

    // 1. Basic Headers
    const getAddress = (addrObj) => (addrObj && addrObj.value && Array.isArray(addrObj.value)) 
        ? addrObj.value.map(a => a.address).join(', ') 
        : (addrObj && addrObj.text ? addrObj.text : '');

    const from = getAddress(parsed.from) || headers.get('from') || '';
    const to = getAddress(parsed.to) || headers.get('to') || '';
    const cc = getAddress(parsed.cc) || headers.get('cc') || '';
    const replyTo = getAddress(parsed.replyTo) || headers.get('reply-to') || '';
    const subject = parsed.subject || headers.get('subject') || '';
    const messageId = parsed.messageId || headers.get('message-id') || '';
    const date = parsed.date || (headers.get('date') ? new Date(headers.get('date')) : null);
    
    // 2. Forensic Headers
    const received = parseReceivedHeaders(headers);
    const authentication = parseAuthentication(headers);

    // 3. Body
    const htmlPresent = !!parsed.html;
    // Safely extract text. If text is missing but HTML is present, we just use the raw text fallback.
    let plainText = parsed.text || (htmlPresent ? 'HTML content present (not displayed for safety)' : '');
    
    // Fallback for completely malformed emails with no MIME/headers
    if (!plainText && !htmlPresent && buffer) {
      const rawString = buffer.toString('utf-8');
      if (rawString.trim().length > 0) {
        plainText = rawString;
      }
    }
    
    // Create a normalized text (lowercase, trimmed) for deterministic analysis
    const normalizedText = plainText.toLowerCase().replace(/\s+/g, ' ').trim();

    const bodyObj = {
      plainText,
      htmlPresent,
      normalizedText
    };

    // 4. Attachments
    const { attachments, hashes } = analyzeAttachments(parsed.attachments);

    // 5. IOCs
    const textIocs = extractIocs(plainText);
    const headerString = `From: ${from}\nTo: ${to}\nCC: ${cc}\nReply-To: ${replyTo}\nSubject: ${subject}\nMessage-ID: ${messageId}`;
    const headerIocs = extractIocs(headerString);
    const receivedIocs = extractIocs(received.map(r => r.raw).join('\n'));

    const extracted = combineIocs([textIocs, headerIocs, receivedIocs]);
    
    // Add attachment hashes to IOCs
    hashes.forEach(h => extracted.hashes.push(h));

    return {
      headers: {
        from,
        to,
        cc,
        replyTo,
        subject,
        date,
        messageId,
        inReplyTo: typeof headers.get('in-reply-to') === 'string' ? headers.get('in-reply-to') : '',
        references: [].concat(headers.get('references') || []),
        returnPath: (typeof headers.get('return-path') === 'object' && headers.get('return-path') !== null) 
                    ? getAddress(headers.get('return-path')) 
                    : (headers.get('return-path') || ''),
        mimeVersion: typeof headers.get('mime-version') === 'string' ? headers.get('mime-version') : '',
        contentType: (headers.get('content-type') && headers.get('content-type').value) 
                     ? headers.get('content-type').value 
                     : (typeof headers.get('content-type') === 'string' ? headers.get('content-type') : ''),
        contentTransferEncoding: typeof headers.get('content-transfer-encoding') === 'string' ? headers.get('content-transfer-encoding') : '',
        received
      },
      authentication,
      body: bodyObj,
      extracted,
      attachments
    };
  } catch (err) {
    const error = new Error('The uploaded email could not be parsed.');
    error.code = 'INVALID_EML';
    error.details = err.message;
    throw error;
  }
}

module.exports = {
  parseEmail
};
