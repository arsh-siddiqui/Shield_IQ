const { validationResult } = require("express-validator");

/**
 * Runs after an express-validator chain. If any validator failed, responds
 * with a 422 and a flat list of field/message pairs; otherwise passes through.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    success: false,
    message: "Validation failed.",
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
}

module.exports = validate;
