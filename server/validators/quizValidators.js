const { body, param } = require("express-validator");

const createQuizValidator = [
  body("article").isMongoId().withMessage("A valid article id is required."),
  body("category")
    .isIn(["Bank Fraud", "UPI Scam", "QR Scam", "Job Scam", "Deepfake", "Social Engineering"])
    .withMessage("Invalid category."),
  body("difficulty").optional().isIn(["Beginner", "Intermediate", "Advanced"]),
  body("question").trim().notEmpty().withMessage("Question text is required."),
  body("options").isArray({ min: 2 }).withMessage("At least 2 options are required."),
  body("options.*.text").trim().notEmpty().withMessage("Every option needs text."),
  body("options.*.correct").optional().isBoolean(),
];

const updateQuizValidator = [
  param("id").isMongoId().withMessage("Invalid quiz id."),
  body("question").optional().trim().notEmpty(),
  body("options").optional().isArray({ min: 2 }),
];

const submitQuizValidator = [
  param("id").isMongoId().withMessage("Invalid quiz id."),
  body("optionId").isMongoId().withMessage("A valid optionId is required."),
];

module.exports = { createQuizValidator, updateQuizValidator, submitQuizValidator };
