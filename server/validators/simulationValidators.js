const { body, param } = require("express-validator");

const feedbackOutcomeValidator = (field) => [
  body(`feedback.${field}.correct`).optional().isBoolean(),
  body(`feedback.${field}.message`).optional().isString(),
  body(`feedback.${field}.xp`).optional().isInt({ min: 0 }),
];

const createSimulationValidator = [
  body("slug").trim().notEmpty().withMessage("Slug is required.").isSlug().withMessage("Slug must be URL-safe (e.g. bank-scam)."),
  body("label").trim().notEmpty().withMessage("Label is required."),
  body("body").trim().notEmpty().withMessage("Scenario body is required."),
  body("from").trim().notEmpty().withMessage("Sender (from) is required."),
  body("difficulty").optional().isIn(["Easy", "Medium", "Hard"]),
  ...feedbackOutcomeValidator("open"),
  ...feedbackOutcomeValidator("ignore"),
  ...feedbackOutcomeValidator("report"),
];

const updateSimulationValidator = [
  param("id").trim().notEmpty().withMessage("Invalid simulation id."),
  body("label").optional().trim().notEmpty(),
  body("body").optional().trim().notEmpty(),
  body("difficulty").optional().isIn(["Easy", "Medium", "Hard"]),
];

const submitSimulationValidator = [
  param("id").trim().notEmpty().withMessage("Invalid simulation id."),
  body("choice").isIn(["open", "ignore", "report"]).withMessage("Choice must be open, ignore, or report."),
];

module.exports = { createSimulationValidator, updateSimulationValidator, submitSimulationValidator };
