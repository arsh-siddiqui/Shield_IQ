const mongoose = require("mongoose");

const quickLearnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    category: { type: String, default: "General" },
    difficulty: { type: String, default: "Beginner" },
    estimatedTime: { type: String, default: "1 min" },
    content: { type: String },
    question: { type: String },
    options: [
      {
        id: String,
        text: String,
        isSuspicious: Boolean,
        correct: Boolean
      }
    ],
    correctAnswer: { type: String },
    feedback: { type: String },
    xpReward: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

quickLearnSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("QuickLearn", quickLearnSchema);
