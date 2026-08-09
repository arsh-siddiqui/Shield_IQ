const asyncHandler = require("express-async-handler");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const QuickLearn = require("../models/QuickLearn");
const SafetyTip = require("../models/SafetyTip");
const User = require("../models/User");
const sendSuccess = require("../utils/apiResponse");

const getTopics = asyncHandler(async (req, res) => {
  const topics = await Lesson.distinct("topic");
  return sendSuccess(res, { data: { topics } });
});

const getLessons = asyncHandler(async (req, res) => {
  const filter = { isPublished: true };
  if (req.query.topic) filter.topic = req.query.topic;
  
  const lessons = await Lesson.find(filter).sort({ order: 1 });
  return sendSuccess(res, { data: { lessons } });
});

const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findOne({ slug: req.params.id, isPublished: true });
  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }
  return sendSuccess(res, { data: { lesson } });
});

const getLessonProgress = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findOne({ slug: req.params.id });
  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  const progress = await LessonProgress.findOne({ userId: req.user._id, lessonId: lesson._id });
  return sendSuccess(res, { data: { progress: progress || { status: "not_started" } } });
});

const updateLessonProgress = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findOne({ slug: req.params.id });
  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  const progress = await LessonProgress.findOneAndUpdate(
    { userId: req.user._id, lessonId: lesson._id },
    { ...req.body, status: "in_progress" },
    { new: true, upsert: true }
  );
  
  return sendSuccess(res, { data: { progress } });
});

const completeLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findOne({ slug: req.params.id });
  if (!lesson) {
    res.status(404);
    throw new Error("Lesson not found");
  }

  const progress = await LessonProgress.findOneAndUpdate(
    { userId: req.user._id, lessonId: lesson._id },
    { 
      status: "completed", 
      completedAt: new Date(),
      xpEarned: lesson.xpReward || 30
    },
    { new: true, upsert: true }
  );

  // Update User XP
  if (progress.isNew || progress.xpEarned > 0) { // Naive XP award just to match dummy
    const user = await User.findById(req.user._id);
    if (user) {
      user.xp += progress.xpEarned;
      await user.save();
    }
  }

  return sendSuccess(res, { data: { progress } });
});

const getQuickLearns = asyncHandler(async (req, res) => {
  const quickLearns = await QuickLearn.find({ isActive: true });
  return sendSuccess(res, { data: { quickLearns } });
});

const getSafetyTips = asyncHandler(async (req, res) => {
  const safetyTips = await SafetyTip.find({ isActive: true }).sort({ order: 1 });
  return sendSuccess(res, { data: { safetyTips } });
});

module.exports = {
  getTopics,
  getLessons,
  getLessonById,
  getLessonProgress,
  updateLessonProgress,
  completeLesson,
  getQuickLearns,
  getSafetyTips
};
