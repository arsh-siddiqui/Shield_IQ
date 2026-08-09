const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // mapping to id in dummy data
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    estimatedTime: { type: String, default: "3 min" },
    order: { type: Number, default: 0 },
    skill: { type: String, default: "Phishing Detection" },
    xpReward: { type: Number, default: 30 },
    steps: {
      understand: {
        title: String,
        text: String,
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
          options: [
            { id: String, text: String, correct: Boolean }
          ]
        }
      ],
      takeaway: {
        title: String,
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
