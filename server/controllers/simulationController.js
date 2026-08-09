const asyncHandler = require("express-async-handler");
const Simulation = require("../models/Simulation");
const SimulationResult = require("../models/SimulationResult");
const AdminLog = require("../models/AdminLog");
const sendSuccess = require("../utils/apiResponse");

// @route  GET /api/simulations
// @access Public
const getSimulations = asyncHandler(async (req, res) => {
  const simulations = await Simulation.find({ isActive: true }).sort({ createdAt: 1 });
  return sendSuccess(res, { data: { simulations } });
});

// @route  GET /api/simulations/:id
// @access Public
const getSimulationById = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) {
    res.status(404);
    throw new Error("Simulation not found.");
  }
  return sendSuccess(res, { data: { simulation } });
});

// @route  POST /api/simulations
// @access Private/Admin
const createSimulation = asyncHandler(async (req, res) => {
  const simulation = await Simulation.create(req.body);
  await AdminLog.create({ admin: req.user._id, action: "simulation.create", targetId: simulation._id });
  return sendSuccess(res, { statusCode: 201, message: "Simulation created.", data: { simulation } });
});

// @route  PUT /api/simulations/:id
// @access Private/Admin
const updateSimulation = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!simulation) {
    res.status(404);
    throw new Error("Simulation not found.");
  }
  await AdminLog.create({ admin: req.user._id, action: "simulation.update", targetId: simulation._id });
  return sendSuccess(res, { message: "Simulation updated.", data: { simulation } });
});

// @route  DELETE /api/simulations/:id
// @access Private/Admin
const deleteSimulation = asyncHandler(async (req, res) => {
  const simulation = await Simulation.findByIdAndDelete(req.params.id);
  if (!simulation) {
    res.status(404);
    throw new Error("Simulation not found.");
  }
  await AdminLog.create({ admin: req.user._id, action: "simulation.delete", targetId: req.params.id });
  return sendSuccess(res, { message: "Simulation deleted." });
});

// @route  POST /api/simulations/:id/submit
// @access Private
// Records the user's choice, awards XP, and upserts so replaying a
// scenario updates the previous result instead of erroring on the
// unique (user, simulation) index.
const submitSimulation = asyncHandler(async (req, res) => {
  const { choice } = req.body;
  const simulation = await Simulation.findById(req.params.id);
  if (!simulation) {
    res.status(404);
    throw new Error("Simulation not found.");
  }

  const outcome = simulation.feedback?.[choice];
  if (!outcome) {
    res.status(400);
    throw new Error(`This scenario has no feedback configured for choice "${choice}".`);
  }

  const result = await SimulationResult.findOneAndUpdate(
    { user: req.user._id, simulation: simulation._id },
    { choice, correct: outcome.correct, xpAwarded: outcome.xp },
    { new: true, upsert: true }
  );

  req.user.xp += outcome.xp;
  await req.user.save();

  return sendSuccess(res, {
    message: "Submission recorded.",
    data: { result, feedback: outcome, lessonsLearned: simulation.lessonsLearned, xpTotal: req.user.xp },
  });
});

module.exports = {
  getSimulations,
  getSimulationById,
  createSimulation,
  updateSimulation,
  deleteSimulation,
  submitSimulation,
};
