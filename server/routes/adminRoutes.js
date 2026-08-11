const express = require("express");
const { getStats, getAnalytics, getUsers, updateUser, deleteUser } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");
const requireDb = require("../middleware/requireDb");
const validate = require("../middleware/validate");
const { idParamValidator } = require("../validators/articleValidators");

const router = express.Router();

router.use(requireDb, protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/analytics", getAnalytics);
router.get("/users", getUsers);
router.put("/users/:id", idParamValidator, validate, updateUser);
router.delete("/users/:id", idParamValidator, validate, deleteUser);

// Lesson CMS routes
const { getAdminLessons, createLesson, updateLesson, deleteLesson, togglePublishLesson } = require("../controllers/adminController");
router.get("/lessons", getAdminLessons);
router.post("/lessons", createLesson);
router.put("/lessons/:id", idParamValidator, validate, updateLesson);
router.delete("/lessons/:id", idParamValidator, validate, deleteLesson);
router.patch("/lessons/:id/publish", idParamValidator, validate, togglePublishLesson);

module.exports = router;
