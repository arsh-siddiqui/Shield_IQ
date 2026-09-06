const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vulnerability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vulnerability',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    theoryCompleted: {
      type: Boolean,
      default: false,
    },
    labCompleted: {
      type: Boolean,
      default: false,
    },
    assessmentScore: {
      type: Number,
      default: 0,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    timeSpent: {
      type: Number, // seconds
      default: 0,
    },
    lastAttempt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Ensure one progress record per user per vulnerability
learningProgressSchema.index({ user: 1, vulnerability: 1 }, { unique: true });

module.exports = mongoose.model('LearningProgress', learningProgressSchema);
