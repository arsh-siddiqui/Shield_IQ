'use strict';

/**
 * server/services/forensics/attachmentAnalyzer.js
 * Performs static metadata extraction and SHA-256 hashing for attachments.
 * DOES NOT EXECUTE OR EXTERNALIZE FILES.
 */

const crypto = require('crypto');

/**
 * Safely analyzes attachments provided by mailparser.
 * @param {Array} attachments - mailparser attachments array
 * @returns {Object} { attachments: Array, hashes: Array }
 */
function analyzeAttachments(attachments) {
  if (!attachments || !Array.isArray(attachments)) {
    return { attachments: [], hashes: [] };
  }

  const result = [];
  const hashes = new Set();

  attachments.forEach(att => {
    // Basic metadata
    const meta = {
      filename: att.filename || 'unknown',
      contentType: att.contentType || 'application/octet-stream',
      sizeBytes: att.size || 0,
      contentId: att.contentId || '',
      disposition: att.contentDisposition || '',
      extension: '',
      sha256: ''
    };

    // Safely extract extension
    if (meta.filename.includes('.')) {
      const parts = meta.filename.split('.');
      meta.extension = parts[parts.length - 1].toLowerCase();
    }

    // Safely hash bytes
    if (att.content && Buffer.isBuffer(att.content)) {
      const hash = crypto.createHash('sha256').update(att.content).digest('hex');
      meta.sha256 = hash;
      hashes.add(hash);
      meta.sizeBytes = att.content.length; // Ensure accurate size
    }

    result.push(meta);
  });

  return {
    attachments: result,
    hashes: Array.from(hashes)
  };
}

module.exports = {
  analyzeAttachments
};
