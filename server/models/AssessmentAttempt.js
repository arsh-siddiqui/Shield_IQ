const mongoose = require('mongoose');

const assessmentAttemptSchema = new mongoose.Schema(
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
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        selectedOptionId: { type: mongoose.Schema.Types.ObjectId, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

assessmentAttemptSchema.index({ user: 1, vulnerability: 1, attemptedAt: -1 });

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
