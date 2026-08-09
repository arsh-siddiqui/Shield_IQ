const mongoose = require("mongoose");

const feedbackOutcomeSchema = new mongoose.Schema(
  { correct: Boolean, message: String, xp: { type: Number, default: 0 } },
  { _id: false }
);

const simulationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    label: { type: String, required: [true, "Label is required."], trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
    icon: { type: String, default: "Shield" }, // lucide-react icon name, resolved client-side
    color: { type: String, enum: ["primary", "secondary", "accent"], default: "primary" },
    app: { type: String, default: "SMS" }, // e.g. Gmail, WhatsApp, SMS
    from: { type: String, required: true },
    subject: { type: String, default: "" },
    body: { type: String, required: [true, "Scenario body is required."] },
    feedback: {
      open: feedbackOutcomeSchema,
      ignore: feedbackOutcomeSchema,
      report: feedbackOutcomeSchema,
    },
    lessonsLearned: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Simulation", simulationSchema);
