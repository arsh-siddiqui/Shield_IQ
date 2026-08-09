const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required."], trim: true, maxlength: 160 },
    description: { type: String, required: [true, "Description is required."], trim: true, maxlength: 500 },
    body: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["Bank Fraud", "UPI Scam", "QR Scam", "Job Scam", "Deepfake", "Social Engineering"],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
      index: true,
    },
    readingTime: { type: String, default: "3 min" },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
      index: true,
    },
    views: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

articleSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Article", articleSchema);
