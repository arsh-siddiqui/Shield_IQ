const mongoose = require('mongoose');

const forensicReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    investigation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmailInvestigation',
      required: true,
      index: true,
    },
    reportVersion: {
      type: Number,
      default: 1,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    evidenceSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    deterministicSummary: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    aiFindings: {
      type: mongoose.Schema.Types.Mixed,
    },
    recommendedActions: {
      type: [mongoose.Schema.Types.Mixed],
    },
    limitations: {
      type: [String],
    },
    status: {
      type: String,
      enum: ['generated', 'failed'],
      default: 'generated',
    },
    aiStatus: {
      type: String,
      enum: ['available', 'unavailable', 'failed'],
      default: 'available',
    },
  },
  { timestamps: true }
);

forensicReportSchema.index({ user: 1, investigation: 1, createdAt: -1 });

module.exports = mongoose.model('ForensicReport', forensicReportSchema);
