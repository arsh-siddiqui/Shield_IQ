const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    estimatedTime: { type: String, default: "3 min" },
    order: { type: Number, default: 0 },
    skill: { type: String, default: "Phishing Detection" },
    xpReward: { type: Number, default: 30 },
    steps: {
      // NEW: Quick Intro step shown before Understand
      intro: {
        tagline: String,
        objectives: [String],
      },
      // IMPROVED: Understand now supports concept + points array for card-based layout
      understand: {
        title: String,
        text: String,           // legacy: kept for backward compat
        concept: String,        // new: one short key idea
        points: [
          { title: String, text: String }   // new: numbered concept cards
        ]
      },
      seeIt: {
        example: String,
        sender: String,
        redFlags: [
          { text: String, reason: String }
        ]
      },
      tryItYourself: {
        example: String,
        sender: String,
        redFlags: [
          { text: String, reason: String }
        ]
      },
      realWorld: {
        scenario: String,
        options: [
          { id: String, text: String, correct: Boolean, feedback: String }
        ]
      },
      quiz: [
        {
          question: String,
          explanation: String,   // new: explains correct answer after selection
          options: [
            { id: String, text: String, correct: Boolean }
          ]
        }
      ],
      takeaway: {
        title: String,
        summary: String,       // new: one memorable sentence
        points: [
          { title: String, text: String }
        ]
      }
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

lessonSchema.index({ topic: 1, order: 1 });

module.exports = mongoose.model("Lesson", lessonSchema);
