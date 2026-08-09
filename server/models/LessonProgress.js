const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    status: { type: String, enum: ["not_started", "in_progress", "completed"], default: "not_started" },
    currentStep: { type: String, default: "understand" },
    progress: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model("LessonProgress", lessonProgressSchema);
