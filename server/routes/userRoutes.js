const express = require("express");
const {
  getProfile,
  updateProfile,
  getDashboardData,
  getScanHistory,
  getProgress,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const requireDb = require("../middleware/requireDb");

const router = express.Router();

router.use(requireDb, protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/dashboard", getDashboardData);
router.get("/scans", getScanHistory);
router.get("/progress", getProgress);

module.exports = router;
