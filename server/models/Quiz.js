const mongoose = require("mongoose");

const quizOptionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    correct: { type: Boolean, default: false },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true, index: true },
    category: {
      type: String,
      enum: ["Bank Fraud", "UPI Scam", "QR Scam", "Job Scam", "Deepfake", "Social Engineering"],
      required: true,
    },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    question: { type: String, required: [true, "Question text is required."] },
    options: {
      type: [quizOptionSchema],
      validate: {
        validator: (opts) => opts.length >= 2 && opts.some((o) => o.correct),
        message: "A quiz needs at least 2 options and exactly one correct answer.",
      },
    },
    xpReward: { type: Number, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
