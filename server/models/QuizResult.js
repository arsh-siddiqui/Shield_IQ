const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    selectedOptionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    correct: { type: Boolean, required: true },
    xpAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One result per user per quiz — resubmitting updates the existing record.
quizResultSchema.index({ user: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model("QuizResult", quizResultSchema);
