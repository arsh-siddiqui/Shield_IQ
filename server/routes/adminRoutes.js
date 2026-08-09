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

module.exports = router;
