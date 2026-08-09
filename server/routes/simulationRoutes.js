const express = require("express");
const {
  getSimulations,
  getSimulationById,
  createSimulation,
  updateSimulation,
  deleteSimulation,
  submitSimulation,
} = require("../controllers/simulationController");
const { protect, authorize } = require("../middleware/auth");
const requireDb = require("../middleware/requireDb");
const validate = require("../middleware/validate");
const {
  createSimulationValidator,
  updateSimulationValidator,
  submitSimulationValidator,
} = require("../validators/simulationValidators");
const { idParamValidator } = require("../validators/articleValidators");

const router = express.Router();

router.get("/", requireDb, getSimulations);
router.get("/:id", requireDb, idParamValidator, validate, getSimulationById);

router.post("/", requireDb, protect, authorize("admin"), createSimulationValidator, validate, createSimulation);
router.put("/:id", requireDb, protect, authorize("admin"), updateSimulationValidator, validate, updateSimulation);
router.delete("/:id", requireDb, protect, authorize("admin"), idParamValidator, validate, deleteSimulation);

router.post("/:id/submit", requireDb, protect, submitSimulationValidator, validate, submitSimulation);

module.exports = router;
