const express = require("express");
const {
  getTopics,
  getLessons,
  getLessonById,
  getLessonProgress,
  updateLessonProgress,
  completeLesson,
  getQuickLearns,
  getSafetyTips
} = require("../controllers/learnController");
const { protect, optionalAuth } = require("../middleware/auth");
const requireDb = require("../middleware/requireDb");

const router = express.Router();

router.get("/topics", requireDb, getTopics);
router.get("/lessons", requireDb, getLessons);
router.get("/lessons/:id", requireDb, getLessonById);

router.get("/lessons/:id/progress", requireDb, protect, getLessonProgress);
router.put("/lessons/:id/progress", requireDb, protect, updateLessonProgress);
router.post("/lessons/:id/complete", requireDb, protect, completeLesson);

router.get("/quick-learns", requireDb, getQuickLearns);
router.get("/safety-tips", requireDb, getSafetyTips);

module.exports = router;
