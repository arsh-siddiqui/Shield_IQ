const mongoose = require("mongoose");

const simulationResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    simulation: { type: mongoose.Schema.Types.ObjectId, ref: "Simulation", required: true },
    choice: { type: String, enum: ["open", "ignore", "report"], required: true },
    correct: { type: Boolean, required: true },
    xpAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

simulationResultSchema.index({ user: 1, simulation: 1 }, { unique: true });

module.exports = mongoose.model("SimulationResult", simulationResultSchema);
