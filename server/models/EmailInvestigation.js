const mongoose = require('mongoose');

const emailInvestigationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scan',
      index: true,
    },
    sourceType: {
      type: String,
      enum: ['pasted_email', 'eml_upload'],
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    analysisDepth: {
      type: String,
      enum: ['content_only', 'forensic'],
      required: true,
    },
    headers: {
      from: String,
      to: String,
      cc: String,
      replyTo: String,
      subject: String,
      date: Date,
      messageId: String,
      inReplyTo: String,
      references: [String],
      returnPath: String,
      mimeVersion: String,
      contentType: String,
      contentTransferEncoding: String,
      received: [
        {
          raw: String,
          from: String,
          by: String,
          with: String,
          id: String,
          for: String,
          timestamp: Date,
          ipAddresses: [String],
        }
      ]
    },
    authentication: {
      spf: {
        status: { type: String, enum: ['pass', 'fail', 'neutral', 'softfail', 'none', 'temperror', 'permerror', 'unknown', null] },
        domain: String,
        details: String
      },
      dkim: {
        status: { type: String, enum: ['pass', 'fail', 'neutral', 'softfail', 'none', 'temperror', 'permerror', 'unknown', null] },
        domain: String,
        selector: String,
        details: String
      },
      dmarc: {
        status: { type: String, enum: ['pass', 'fail', 'neutral', 'softfail', 'none', 'temperror', 'permerror', 'unknown', null] },
        policy: String,
        aligned: String, // E.g., 'none', 'strict', 'relaxed' or boolean representation
        details: String
      }
    },
    body: {
      plainText: String,
      htmlPresent: Boolean,
      normalizedText: String,
    },
    extracted: {
      emailAddresses: [String],
      urls: [String],
      domains: [String],
      ipAddresses: [
        {
          ip: String,
          type: { type: String, enum: ['public', 'private'] }
        }
      ],
      hashes: [String]
    },
    attachments: [
      {
        filename: String,
        contentType: String,
        sizeBytes: Number,
        contentId: String,
        disposition: String,
        extension: String,
        sha256: String,
      }
    ],
    analysisSummary: String,
    sourceMetadata: {
      originalFilename: String,
      contentType: String,
      sizeBytes: Number,
      uploadedAt: Date,
      inputMethod: String
    },
    // Phase 2: enrichment
    enrichmentStatus: {
      type: String,
      enum: ['pending', 'completed', 'partial', 'skipped'],
      default: 'pending',
    },
    indicators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Indicator',
    }],
    geoPoints: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

emailInvestigationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('EmailInvestigation', emailInvestigationSchema);
