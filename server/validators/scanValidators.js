const { body } = require("express-validator");
const { VALID_TYPES } = require("../services/scanService");

// These validators handle structural checks at the route level.
// Semantic checks (empty string, whitespace-only, 5000-char limit) are handled
// in scanController so the error message and status code are consistent.
const scanValidator = [
  body("scanType")
    .notEmpty().withMessage("Unsupported scan type.")
    .isIn(VALID_TYPES).withMessage("Unsupported scan type."),
  // content may be absent from the body entirely — the controller handles that
  body("content")
    .optional({ nullable: true })
    .customSanitizer((val) => (val === null || val === undefined ? undefined : val)),
];

module.exports = { scanValidator };
