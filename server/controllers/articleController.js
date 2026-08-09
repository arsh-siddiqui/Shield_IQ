const asyncHandler = require("express-async-handler");
const Article = require("../models/Article");
const AdminLog = require("../models/AdminLog");
const sendSuccess = require("../utils/apiResponse");

// @route  GET /api/articles
// @access Public (only returns Published articles unless requester is admin)
const getArticles = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 12;
  const { category, difficulty, search } = req.query;

  const filter = {};
  const isAdmin = req.user?.role === "admin";
  if (!isAdmin) filter.status = "Published";

  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (search) filter.$text = { $search: search };

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Article.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    data: { articles },
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

// @route  GET /api/articles/:id
// @access Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    res.status(404);
    throw new Error("Article not found.");
  }

  article.views += 1;
  await article.save();

  return sendSuccess(res, { data: { article } });
});

// @route  POST /api/articles
// @access Private/Admin
const createArticle = asyncHandler(async (req, res) => {
  const article = await Article.create({ ...req.body, author: req.user._id });
  await AdminLog.create({ admin: req.user._id, action: "article.create", targetId: article._id });
  return sendSuccess(res, { statusCode: 201, message: "Article created.", data: { article } });
});

// @route  PUT /api/articles/:id
// @access Private/Admin
const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!article) {
    res.status(404);
    throw new Error("Article not found.");
  }
  await AdminLog.create({ admin: req.user._id, action: "article.update", targetId: article._id });
  return sendSuccess(res, { message: "Article updated.", data: { article } });
});

// @route  DELETE /api/articles/:id
// @access Private/Admin
const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) {
    res.status(404);
    throw new Error("Article not found.");
  }
  await AdminLog.create({ admin: req.user._id, action: "article.delete", targetId: req.params.id });
  return sendSuccess(res, { message: "Article deleted." });
});

module.exports = { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };
