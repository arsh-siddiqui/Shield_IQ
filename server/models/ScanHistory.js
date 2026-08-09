const mongoose = require("mongoose");

const reasonSchema = new mongoose.Schema(
  {
    title: String,
    detail: String,
    severity: { type: String, enum: ["low", "medium", "high"] },
  },
  { _id: false }
);

const scanHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    scanType: {
      type: String,
      enum: ["url", "email", "sms", "whatsapp", "qr"],
      required: true,
    },
    target: { type: String, required: true, trim: true, maxlength: 2000 },
    riskLevel: {
      type: String,
      enum: ["Safe", "Low", "Medium", "High"],
      required: true,
    },
    riskScore: { type: Number, min: 0, max: 100, required: true },
    confidence: { type: Number, min: 0, max: 100, required: true },
    category: String,
    summary: String,
    reasons: [reasonSchema],
    recommendations: [String],
  },
  { timestamps: true }
);

scanHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("ScanHistory", scanHistorySchema);
