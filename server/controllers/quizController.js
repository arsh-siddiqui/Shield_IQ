const asyncHandler = require("express-async-handler");
const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");
const AdminLog = require("../models/AdminLog");
const sendSuccess = require("../utils/apiResponse");

// @route  GET /api/quizzes
// @access Public
// Supports ?article=<id>, ?category=, ?difficulty= filters.
const getQuizzes = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.article) filter.article = req.query.article;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;

  const quizzes = await Quiz.find(filter).populate("article", "title category");
  return sendSuccess(res, { data: { quizzes } });
});

// @route  GET /api/quizzes/:id
// @access Public
const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found.");
  }
  return sendSuccess(res, { data: { quiz } });
});

// @route  POST /api/quizzes
// @access Private/Admin
const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create(req.body);
  await AdminLog.create({ admin: req.user._id, action: "quiz.create", targetId: quiz._id });
  return sendSuccess(res, { statusCode: 201, message: "Quiz created.", data: { quiz } });
});

// @route  PUT /api/quizzes/:id
// @access Private/Admin
const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found.");
  }
  await AdminLog.create({ admin: req.user._id, action: "quiz.update", targetId: quiz._id });
  return sendSuccess(res, { message: "Quiz updated.", data: { quiz } });
});

// @route  DELETE /api/quizzes/:id
// @access Private/Admin
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found.");
  }
  await AdminLog.create({ admin: req.user._id, action: "quiz.delete", targetId: req.params.id });
  return sendSuccess(res, { message: "Quiz deleted." });
});

// @route  POST /api/quizzes/results
// @access Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { lessonId, correct } = req.body;
  const xpAwarded = correct ? 10 : 0; 
  
  let lessonMongoId = null;
  if (lessonId) {
     const Lesson = require("../models/Lesson");
     const lesson = await Lesson.findOne({ slug: lessonId });
     if (lesson) lessonMongoId = lesson._id;
  }

  // Check if it was already correctly completed
  const existingResult = await QuizResult.findOne({ userId: req.user._id, lessonId: lessonMongoId });
  const alreadyCompleted = existingResult && existingResult.correctAnswers > 0;

  const result = await QuizResult.findOneAndUpdate(
    { userId: req.user._id, lessonId: lessonMongoId },
    { correctAnswers: correct ? 1 : 0, score: correct ? 100 : 0, xpEarned: xpAwarded, completedAt: new Date() },
    { new: true, upsert: true }
  );

  if (xpAwarded > 0 && !alreadyCompleted) {
    req.user.xp += xpAwarded;
    await req.user.save();
  }

  return sendSuccess(res, { data: { result, correct, xpAwarded: !alreadyCompleted ? xpAwarded : 0, xpTotal: req.user.xp } });
});

const getQuizResults = asyncHandler(async (req, res) => {
  const results = await QuizResult.find({ userId: req.user._id });
  return sendSuccess(res, { data: { results } });
});

module.exports = { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, submitQuiz, getQuizResults };
