const { body } = require("express-validator");
const { VALID_TYPES } = require("../services/scanService");

const scanValidator = [
  body("scanType").isIn(VALID_TYPES).withMessage(`scanType must be one of: ${VALID_TYPES.join(", ")}`),
  body("content")
    .optional()
    .isString()
    .isLength({ max: 20000 })
    .withMessage("content must be a string under 20,000 characters."),
];

module.exports = { scanValidator };
