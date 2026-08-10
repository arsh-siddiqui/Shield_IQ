const express = require("express");
const {
  getProfile,
  updateProfile,
  getDashboardData,
  getScanHistory,
  getProgress,
  toggleBookmark,
  toggleLike,
  markArticleRead,
  completeChallenge,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const requireDb = require("../middleware/requireDb");
const { idParamValidator } = require("../validators/articleValidators");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(requireDb, protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/dashboard", getDashboardData);
router.get("/scans", getScanHistory);
router.get("/progress", getProgress);

router.post("/articles/:id/bookmark", idParamValidator, validate, toggleBookmark);
router.post("/articles/:id/like", idParamValidator, validate, toggleLike);
router.post("/articles/:id/read", idParamValidator, validate, markArticleRead);

// Custom challenge endpoint, no complex ID validation needed for strings like "passwords"
router.post("/challenges/:id", completeChallenge);

module.exports = router;
