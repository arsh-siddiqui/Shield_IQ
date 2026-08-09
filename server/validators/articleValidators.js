const { body, param, query } = require("express-validator");

const CATEGORIES = ["Bank Fraud", "UPI Scam", "QR Scam", "Job Scam", "Deepfake", "Social Engineering"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const createArticleValidator = [
  body("title").trim().notEmpty().withMessage("Title is required.").isLength({ max: 160 }),
  body("description").trim().notEmpty().withMessage("Description is required.").isLength({ max: 500 }),
  body("category").isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(", ")}`),
  body("difficulty").optional().isIn(DIFFICULTIES),
  body("status").optional().isIn(["Draft", "Published"]),
];

const updateArticleValidator = [
  param("id").isMongoId().withMessage("Invalid article id."),
  body("title").optional().trim().isLength({ max: 160 }),
  body("description").optional().trim().isLength({ max: 500 }),
  body("category").optional().isIn(CATEGORIES),
  body("difficulty").optional().isIn(DIFFICULTIES),
  body("status").optional().isIn(["Draft", "Published"]),
];

const idParamValidator = [param("id").isMongoId().withMessage("Invalid id.")];

const listQueryValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("category").optional().isIn(CATEGORIES),
  query("difficulty").optional().isIn(DIFFICULTIES),
  query("search").optional().trim().isLength({ max: 200 }),
];

module.exports = {
  createArticleValidator,
  updateArticleValidator,
  idParamValidator,
  listQueryValidator,
};
