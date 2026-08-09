const mongoose = require("mongoose");

/**
 * Admin data itself lives on User (role: "admin") — a separate account
 * table would just duplicate auth. What genuinely deserves its own
 * collection is an audit trail of admin actions, which this model provides
 * and the admin controllers write to on every mutation (user suspended,
 * article deleted, etc).
 */
const adminLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: {
      type: String,
      required: true,
      enum: [
        "user.update",
        "user.delete",
        "article.create",
        "article.update",
        "article.delete",
        "simulation.create",
        "simulation.update",
        "simulation.delete",
        "quiz.create",
        "quiz.update",
        "quiz.delete",
      ],
    },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

adminLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AdminLog", adminLogSchema);
