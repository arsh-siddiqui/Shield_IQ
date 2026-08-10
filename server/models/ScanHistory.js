const mongoose = require('mongoose');

const reasonSchema = new mongoose.Schema(
  {
    title:    String,
    detail:   String,
    severity: { type: String, enum: ['low', 'medium', 'high'] },
  },
  { _id: false }
);

const scanHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scanType: {
      type: String,
      enum: ['url', 'email', 'sms', 'whatsapp', 'qr'],
      required: true,
    },
    target: { type: String, required: true, trim: true, maxlength: 2000 },
    riskLevel: {
      type: String,
      enum: ['Safe', 'Low', 'Medium', 'High'],
      required: true,
    },
    riskScore:   { type: Number, min: 0, max: 100, required: true },
    confidence:  { type: Number, min: 0, max: 100, required: true },
    category:    String,
    summary:     String,
    reasons:         [reasonSchema],
    recommendations: [String],
    detectedSignals: [String],

    // -----------------------------------------------------------------------
    // Extended fields added in Phase 5B/5C — all optional for backward
    // compatibility with existing scan history documents.
    // -----------------------------------------------------------------------

    /** Which analysis layers contributed to this result */
    analysisSources: {
      type: [String],
      default: ['heuristics'],
    },

    /** ML model prediction label ('phishing' | 'safe') */
    mlLabel: {
      type: String,
      enum: ['phishing', 'safe', null],
      default: null,
    },

    /** ML model phishing probability (0.0–1.0) */
    mlProbability: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },

    /** Human-readable threat intelligence summary, e.g. "PhishTank: found (verified)" */
    threatIntelSummary: {
      type: String,
      default: null,
      maxlength: 500,
    },

    /** ML model version string */
    modelVersion: {
      type: String,
      default: null,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

scanHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ScanHistory', scanHistorySchema);
