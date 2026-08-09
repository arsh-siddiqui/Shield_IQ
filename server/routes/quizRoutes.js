const express = require("express");
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
} = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/auth");
const requireDb = require("../middleware/requireDb");
const validate = require("../middleware/validate");
const { createQuizValidator, updateQuizValidator, submitQuizValidator } = require("../validators/quizValidators");
const { idParamValidator } = require("../validators/articleValidators");

const router = express.Router();

router.get("/", requireDb, getQuizzes);
router.get("/results", requireDb, protect, require("../controllers/quizController").getQuizResults);
router.post("/results", requireDb, protect, submitQuiz);

router.get("/:id", requireDb, idParamValidator, validate, getQuizById);
router.post("/", requireDb, protect, authorize("admin"), createQuizValidator, validate, createQuiz);
router.put("/:id", requireDb, protect, authorize("admin"), updateQuizValidator, validate, updateQuiz);
router.delete("/:id", requireDb, protect, authorize("admin"), idParamValidator, validate, deleteQuiz);
router.post("/:id/submit", requireDb, protect, submitQuiz);

module.exports = router;
