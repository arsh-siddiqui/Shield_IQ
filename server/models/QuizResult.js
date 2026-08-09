const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 1 },
    correctAnswers: { type: Number, default: 0 },
    answers: [mongoose.Schema.Types.Mixed],
    xpEarned: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

quizResultSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model("QuizResult", quizResultSchema);
