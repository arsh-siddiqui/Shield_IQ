const express = require("express");
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const { protect, authorize, optionalAuth } = require("../middleware/auth");
const requireDb = require("../middleware/requireDb");
const validate = require("../middleware/validate");
const {
  createArticleValidator,
  updateArticleValidator,
  idParamValidator,
  listQueryValidator,
} = require("../validators/articleValidators");

const router = express.Router();

router.get("/", requireDb, optionalAuth, listQueryValidator, validate, getArticles);
router.get("/:id", requireDb, idParamValidator, validate, getArticleById);

router.post("/", requireDb, protect, authorize("admin"), createArticleValidator, validate, createArticle);
router.put("/:id", requireDb, protect, authorize("admin"), updateArticleValidator, validate, updateArticle);
router.delete("/:id", requireDb, protect, authorize("admin"), idParamValidator, validate, deleteArticle);

module.exports = router;
