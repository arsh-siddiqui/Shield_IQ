const mongoose = require("mongoose");

const safetyTipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String },
    fullExplanation: { type: String, default: "" },
    detail: { type: String, required: true },
    category: { type: String, default: "General" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

safetyTipSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("SafetyTip", safetyTipSchema);
