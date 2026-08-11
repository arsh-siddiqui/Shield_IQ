const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Article = require("../models/Article");
const Simulation = require("../models/Simulation");
const ScanHistory = require("../models/ScanHistory");
const AdminLog = require("../models/AdminLog");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const sendSuccess = require("../utils/apiResponse");
const { toPublicUser } = require("./authController");

// @route  GET /api/admin/stats
// @access Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalArticles, publishedArticles, totalSimulations, scansToday] = await Promise.all([
    User.countDocuments(),
    Article.countDocuments(),
    Article.countDocuments({ status: "Published" }),
    Simulation.countDocuments(),
    ScanHistory.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
  ]);

  return sendSuccess(res, {
    data: {
      totalUsers,
      totalArticles,
      publishedArticles,
      totalSimulations,
      scansToday,
    },
  });
});

// @route  GET /api/admin/analytics
// @access Private/Admin
// Monthly user growth + scan volume for the last 6 months, and a risk-level
// breakdown across all scans — powers the admin dashboard charts.
const getAnalytics = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [userGrowth, scanGrowth, riskDistribution] = await Promise.all([
    User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    ScanHistory.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    ScanHistory.aggregate([{ $group: { _id: "$riskLevel", count: { $sum: 1 } } }]),
  ]);

  return sendSuccess(res, { data: { userGrowth, scanGrowth, riskDistribution } });
});

// @route  GET /api/admin/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const search = req.query.search || "";

  const filter = search ? { name: { $regex: search, $options: "i" } } : {};

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    data: { users: users.map(toPublicUser) },
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  });
});

// @route  PUT /api/admin/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "accountRole", "status", "role"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  await AdminLog.create({ admin: req.user._id, action: "user.update", targetId: user._id, details: updates });

  return sendSuccess(res, { message: "User updated.", data: { user: toPublicUser(user) } });
});

// @route  DELETE /api/admin/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error("You can't delete your own admin account.");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  await AdminLog.create({ admin: req.user._id, action: "user.delete", targetId: req.params.id });

  return sendSuccess(res, { message: "User deleted." });
});

// ==========================================
// LEARN CMS / LESSONS
// ==========================================

// @route  GET /api/admin/lessons
// @access Private/Admin
const getAdminLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find().sort({ order: 1 });
  return sendSuccess(res, { data: { lessons } });
});

// @route  POST /api/admin/lessons
// @access Private/Admin
const createLesson = asyncHandler(async (req, res) => {
  const { title, slug, topic, difficulty, estimatedTime, xpReward, order, steps, isPublished } = req.body;
  
  if (!title || !slug || !topic) {
    res.status(400);
    throw new Error("Title, slug, and category (topic) are required.");
  }

  const existing = await Lesson.findOne({ slug });
  if (existing) {
    res.status(400);
    throw new Error("A lesson with this slug already exists.");
  }

  const lesson = await Lesson.create({
    title, slug, topic, difficulty, estimatedTime, xpReward, order, steps, isPublished
  });

  await AdminLog.create({ admin: req.user._id, action: "lesson.create", targetId: lesson._id });

  return sendSuccess(res, { message: "Lesson created.", data: { lesson } }, 201);
});

// @route  PUT /api/admin/lessons/:id
// @access Private/Admin
const updateLesson = asyncHandler(async (req, res) => {
  const { slug } = req.body;

  if (slug) {
    const existing = await Lesson.findOne({ slug, _id: { $ne: req.params.id } });
    if (existing) {
      res.status(400);
      throw new Error("Another lesson with this slug already exists.");
    }
  }

  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  
  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found.");
  }

  await AdminLog.create({ admin: req.user._id, action: "lesson.update", targetId: lesson._id });

  return sendSuccess(res, { message: "Lesson updated.", data: { lesson } });
});

// @route  DELETE /api/admin/lessons/:id
// @access Private/Admin
const deleteLesson = asyncHandler(async (req, res) => {
  // DELETE PROTECTION: Do not delete if progress exists
  const progressCount = await LessonProgress.countDocuments({ lessonId: req.params.id });
  
  if (progressCount > 0) {
    res.status(400);
    throw new Error("This lesson has learner progress and cannot be permanently deleted. Please unpublish it instead.");
  }

  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found.");
  }

  await AdminLog.create({ admin: req.user._id, action: "lesson.delete", targetId: req.params.id });

  return sendSuccess(res, { message: "Lesson deleted successfully." });
});

// @route  PATCH /api/admin/lessons/:id/publish
// @access Private/Admin
const togglePublishLesson = asyncHandler(async (req, res) => {
  const { publish } = req.body;
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, { isPublished: publish === true }, { new: true });
  
  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found.");
  }

  await AdminLog.create({ admin: req.user._id, action: publish ? "lesson.publish" : "lesson.unpublish", targetId: lesson._id });

  return sendSuccess(res, { message: `Lesson ${publish ? "published" : "unpublished"}.`, data: { lesson } });
});

module.exports = { 
  getStats, getAnalytics, getUsers, updateUser, deleteUser,
  getAdminLessons, createLesson, updateLesson, deleteLesson, togglePublishLesson
};
